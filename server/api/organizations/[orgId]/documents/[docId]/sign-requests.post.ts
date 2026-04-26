import { z } from 'zod'
import { prisma } from '~~/server/utils/db'
import { sendSignRequestNotifications } from '~~/server/utils/notifications'

const signRequestSchema = z.object({
  signers: z.array(z.object({
    email: z.string().email(),
    name: z.string().min(1),
    phone: z.string().optional(),
    orderIndex: z.number().int().min(0).default(0),
  })).min(1),
})

/** Add sign requests to a document and send invitations (member+) */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const docId = getRouterParam(event, 'docId')!
  const { auth } = await requireOrgRole(event, orgId, 'member')

  const body = await readValidatedBody(event, signRequestSchema.parse)

  // Verify document exists and is in draft status
  const doc = await prisma.document.findFirst({ where: { id: docId, orgId } })
  if (!doc) {
    throw createError({ statusCode: 404, statusMessage: 'Document not found' })
  }
  if (doc.status !== 'draft') {
    throw createError({ statusCode: 400, statusMessage: 'Document must be in draft status' })
  }

  // Create sign requests
  const signRequests = await prisma.$transaction(
    body.signers.map((signer) =>
      prisma.signRequest.create({
        data: {
          documentId: docId,
          signerEmail: signer.email,
          signerName: signer.name,
          signerPhone: signer.phone,
          orderIndex: signer.orderIndex,
        },
      }),
    ),
  )

  // Update document status to pending
  await prisma.document.update({
    where: { id: docId },
    data: { status: 'pending' },
  })

  // Increment org quota
  await prisma.organization.update({
    where: { id: orgId },
    data: { usedQuota: { increment: 1 } },
  })

  // Audit log
  await createAuditLog(event, {
    documentId: docId,
    eventType: 'sent',
    actorType: 'user',
    actorId: auth.userId,
    metadata: { signerCount: body.signers.length },
  })

  // Send email notifications (async, don't block response)
  sendSignRequestNotifications(docId).catch((err) =>
    console.error('Failed to send sign request notifications:', err),
  )

  return { signRequests }
})
