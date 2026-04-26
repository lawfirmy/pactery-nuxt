import { prisma } from '~~/server/utils/db'

/** Get organization details */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  await requireOrgRole(event, orgId, 'viewer')

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    include: {
      _count: { select: { members: true, documents: true, cases: true, clients: true, templates: true } },
    },
  })

  if (!org) {
    throw createError({ statusCode: 404, statusMessage: 'Organization not found' })
  }

  return {
    id: org.id,
    name: org.name,
    businessNumber: org.businessNumber,
    representative: org.representative,
    logoUrl: org.logoUrl,
    primaryColor: org.primaryColor,
    plan: org.plan,
    monthlyQuota: org.monthlyQuota,
    usedQuota: org.usedQuota,
    counts: org._count,
  }
})
