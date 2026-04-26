import { prisma } from '~~/server/utils/db'

/** Get sign request info by token (no auth required - public signing link) */
export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')!

  const signRequest = await prisma.signRequest.findUnique({
    where: { token },
    include: {
      document: {
        select: {
          id: true,
          title: true,
          status: true,
          originalFileKey: true,
          org: { select: { name: true, logoUrl: true, primaryColor: true } },
        },
      },
      signFields: true,
    },
  })

  if (!signRequest) {
    throw createError({ statusCode: 404, statusMessage: 'Sign request not found' })
  }

  if (signRequest.status === 'signed') {
    throw createError({ statusCode: 400, statusMessage: 'Already signed' })
  }

  // Log opened event
  await createAuditLog(event, {
    documentId: signRequest.documentId,
    signRequestId: signRequest.id,
    eventType: 'opened',
    actorType: 'signer',
    metadata: { signerEmail: signRequest.signerEmail },
  })

  return {
    id: signRequest.id,
    signerName: signRequest.signerName,
    signerEmail: signRequest.signerEmail,
    status: signRequest.status,
    document: signRequest.document,
    fields: signRequest.signFields,
  }
})
