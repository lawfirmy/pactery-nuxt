import { prisma } from '~/server/utils/db'

/** Reject a sign request */
export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')!

  const signRequest = await prisma.signRequest.findUnique({
    where: { token },
  })

  if (!signRequest) {
    throw createError({ statusCode: 404, statusMessage: 'Sign request not found' })
  }

  if (signRequest.status !== 'pending') {
    throw createError({ statusCode: 400, statusMessage: 'Sign request is not pending' })
  }

  await prisma.signRequest.update({
    where: { id: signRequest.id },
    data: { status: 'rejected' },
  })

  // Update document status
  await prisma.document.update({
    where: { id: signRequest.documentId },
    data: { status: 'rejected' },
  })

  await createAuditLog(event, {
    documentId: signRequest.documentId,
    signRequestId: signRequest.id,
    eventType: 'rejected',
    actorType: 'signer',
    metadata: { signerEmail: signRequest.signerEmail },
  })

  return { success: true }
})
