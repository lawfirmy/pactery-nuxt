import { prisma } from '~~/server/utils/db'

/** Get document details */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const docId = getRouterParam(event, 'docId')!
  await requireOrgRole(event, orgId, 'viewer')

  const document = await prisma.document.findFirst({
    where: { id: docId, orgId },
    include: {
      creator: { select: { id: true, name: true, email: true } },
      signRequests: {
        include: {
          signFields: true,
        },
        orderBy: { orderIndex: 'asc' },
      },
      signFields: true,
      tags: { select: { tag: true } },
      case: { select: { id: true, caseNumber: true, title: true } },
      auditLogs: { orderBy: { createdAt: 'asc' } },
    },
  })

  if (!document) {
    throw createError({ statusCode: 404, statusMessage: 'Document not found' })
  }

  return document
})
