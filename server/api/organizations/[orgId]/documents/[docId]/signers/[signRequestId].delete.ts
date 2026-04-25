import { prisma } from '~/server/utils/db'

/** Remove a signer from a document */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const docId = getRouterParam(event, 'docId')!
  const signRequestId = getRouterParam(event, 'signRequestId')!
  await requireOrgRole(event, orgId, 'member')

  const document = await prisma.document.findFirst({
    where: { id: docId, orgId, status: 'draft' },
  })
  if (!document) {
    throw createError({ statusCode: 404, statusMessage: 'Document not found or not in draft status' })
  }

  // Delete associated sign fields first, then sign request
  await prisma.$transaction([
    prisma.signField.deleteMany({ where: { signRequestId } }),
    prisma.signRequest.delete({ where: { id: signRequestId } }),
  ])

  return { success: true }
})
