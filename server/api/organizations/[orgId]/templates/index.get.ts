import { prisma } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  await requireOrgRole(event, orgId, 'viewer')

  const templates = await prisma.template.findMany({
    where: {
      OR: [
        { orgId },
        { isPreset: true },
      ],
    },
    include: {
      creator: { select: { id: true, name: true } },
      _count: { select: { documents: true } },
    },
    orderBy: [{ isPreset: 'desc' }, { createdAt: 'desc' }],
  })

  return templates
})
