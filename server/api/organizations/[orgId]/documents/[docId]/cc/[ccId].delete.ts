import { prisma } from '~~/server/utils/db'

/** Remove a CC recipient from a document */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const docId = getRouterParam(event, 'docId')!
  const ccId = getRouterParam(event, 'ccId')!
  await requireOrgRole(event, orgId, 'member')

  const document = await prisma.document.findFirst({
    where: { id: docId, orgId, status: 'draft' },
  })
  if (!document) {
    throw createError({ statusCode: 404, statusMessage: 'Document not found or not in draft status' })
  }

  const ccRecipient = await prisma.ccRecipient.findFirst({
    where: { id: ccId, documentId: docId },
  })
  if (!ccRecipient) {
    throw createError({ statusCode: 404, statusMessage: 'CC recipient not found' })
  }

  await prisma.ccRecipient.delete({ where: { id: ccId } })

  return { success: true }
})
