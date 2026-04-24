import { z } from 'zod'
import { prisma } from '~/server/utils/db'
import { processSignedDocument } from '~/server/utils/pki'
import { sendCompletedNotifications } from '~/server/utils/notifications'

const signSchema = z.object({
  fields: z.array(z.object({
    fieldId: z.string(),
    value: z.string(), // base64 image for signature, text for text fields
  })),
  authMethod: z.string().optional(),
  authCiHash: z.string().optional(),
})

/** Submit signature (no auth required - public signing) */
export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')!
  const body = await readValidatedBody(event, signSchema.parse)

  const signRequest = await prisma.signRequest.findUnique({
    where: { token },
    include: { document: true },
  })

  if (!signRequest) {
    throw createError({ statusCode: 404, statusMessage: 'Sign request not found' })
  }

  if (signRequest.status !== 'pending') {
    throw createError({ statusCode: 400, statusMessage: 'Sign request is not pending' })
  }

  const ipAddress = getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || ''
  const userAgent = getHeader(event, 'user-agent') || ''

  // Update field values and sign request
  await prisma.$transaction([
    // Update each field value
    ...body.fields.map((f) =>
      prisma.signField.update({
        where: { id: f.fieldId },
        data: { value: f.value },
      }),
    ),
    // Mark sign request as signed
    prisma.signRequest.update({
      where: { id: signRequest.id },
      data: {
        status: 'signed',
        signedAt: new Date(),
        ipAddress,
        userAgent,
        authMethod: body.authMethod,
        authCiHash: body.authCiHash,
      },
    }),
  ])

  // Check if all sign requests for this document are completed
  const pendingCount = await prisma.signRequest.count({
    where: { documentId: signRequest.documentId, status: 'pending' },
  })

  if (pendingCount === 0) {
    // All signed — process PKI signing + send notifications (async, don't block response)
    processSignedDocument(signRequest.documentId)
      .then(() => sendCompletedNotifications(signRequest.documentId))
      .catch((err) => console.error('Post-sign processing error:', err))
  } else {
    // Partially signed
    await prisma.document.update({
      where: { id: signRequest.documentId },
      data: { status: 'partially_signed' },
    })
  }

  // Audit log
  await createAuditLog(event, {
    documentId: signRequest.documentId,
    signRequestId: signRequest.id,
    eventType: 'signed',
    actorType: 'signer',
    metadata: {
      signerEmail: signRequest.signerEmail,
      signerName: signRequest.signerName,
      fieldCount: body.fields.length,
    },
  })

  return { success: true, documentCompleted: pendingCount === 0 }
})
