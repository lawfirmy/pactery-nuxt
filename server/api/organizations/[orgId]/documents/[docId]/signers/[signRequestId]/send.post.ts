import { prisma } from '~~/server/utils/db'

/** Send/resend sign request to an individual signer */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const docId = getRouterParam(event, 'docId')!
  const signRequestId = getRouterParam(event, 'signRequestId')!
  const { auth } = await requireOrgRole(event, orgId, 'member')

  const document = await prisma.document.findFirst({
    where: { id: docId, orgId, status: { in: ['pending', 'partially_signed'] } },
  })
  if (!document) {
    throw createError({ statusCode: 404, statusMessage: 'Document not found or not in signable status' })
  }

  const signRequest = await prisma.signRequest.findFirst({
    where: { id: signRequestId, documentId: docId, status: 'pending' },
  })
  if (!signRequest) {
    throw createError({ statusCode: 404, statusMessage: 'Sign request not found or already completed' })
  }

  // Audit log
  await createAuditLog(event, {
    documentId: docId,
    signRequestId,
    eventType: 'sent',
    actorType: 'user',
    actorId: auth.userId,
    metadata: { signerEmail: signRequest.signerEmail, type: 'individual' },
  })

  // Send email notification
  try {
    await sendIndividualSignRequest(signRequestId)
  } catch (err) {
    console.error(`Failed to send individual sign request email to ${signRequest.signerEmail}:`, err)
    throw createError({ statusCode: 502, statusMessage: '이메일 발송에 실패했습니다' })
  }

  return { success: true }
})
