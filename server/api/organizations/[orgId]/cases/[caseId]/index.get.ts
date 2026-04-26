import { prisma } from '~~/server/utils/db'

/** Get case detail with documents */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const caseId = getRouterParam(event, 'caseId')!
  await requireOrgRole(event, orgId, 'viewer')

  const caseItem = await prisma.case.findFirst({
    where: { id: caseId, orgId },
    include: {
      client: true,
      documents: {
        include: {
          creator: { select: { id: true, name: true } },
          signRequests: { select: { id: true, signerName: true, status: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!caseItem) {
    throw createError({ statusCode: 404, statusMessage: 'Case not found' })
  }

  return caseItem
})
