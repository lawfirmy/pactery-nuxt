import { prisma } from '~~/server/utils/db'

/** Get template detail */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const templateId = getRouterParam(event, 'templateId')!
  await requireOrgRole(event, orgId, 'viewer')

  const template = await prisma.template.findFirst({
    where: {
      id: templateId,
      OR: [{ orgId }, { isPreset: true }],
    },
    include: {
      creator: { select: { id: true, name: true } },
      _count: { select: { documents: true } },
    },
  })

  if (!template) {
    throw createError({ statusCode: 404, statusMessage: 'Template not found' })
  }

  return template
})
