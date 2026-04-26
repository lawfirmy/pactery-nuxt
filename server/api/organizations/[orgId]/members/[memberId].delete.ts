import { prisma } from '~~/server/utils/db'

/** Remove a member from the organization (admin+) */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const memberId = getRouterParam(event, 'memberId')!
  await requireOrgRole(event, orgId, 'admin')

  const member = await prisma.orgMember.findUnique({ where: { id: memberId } })
  if (!member || member.orgId !== orgId) {
    throw createError({ statusCode: 404, statusMessage: 'Member not found' })
  }

  if (member.role === 'owner') {
    throw createError({ statusCode: 403, statusMessage: 'Cannot remove the owner' })
  }

  await prisma.orgMember.delete({ where: { id: memberId } })

  return { success: true }
})
