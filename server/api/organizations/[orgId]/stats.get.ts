import { prisma } from '~/server/utils/db'

/** Get organization dashboard stats */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  await requireOrgRole(event, orgId, 'viewer')

  const [totalDocs, statusCounts, monthlyDocs, org] = await Promise.all([
    prisma.document.count({ where: { orgId } }),

    prisma.document.groupBy({
      by: ['status'],
      where: { orgId },
      _count: true,
    }),

    prisma.document.count({
      where: {
        orgId,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),

    prisma.organization.findUnique({
      where: { id: orgId },
      select: { monthlyQuota: true, usedQuota: true, plan: true },
    }),
  ])

  const statusMap: Record<string, number> = {}
  for (const s of statusCounts) {
    statusMap[s.status] = s._count
  }

  return {
    totalDocuments: totalDocs,
    monthlyDocuments: monthlyDocs,
    statusBreakdown: statusMap,
    quota: {
      plan: org?.plan,
      used: org?.usedQuota ?? 0,
      total: org?.monthlyQuota ?? 5,
    },
  }
})
