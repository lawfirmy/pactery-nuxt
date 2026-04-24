import { prisma } from '~/server/utils/db'

/** List organization members */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  await requireOrgRole(event, orgId, 'viewer')

  const members = await prisma.orgMember.findMany({
    where: { orgId },
    include: {
      user: {
        select: { id: true, email: true, name: true, avatarUrl: true },
      },
    },
    orderBy: { invitedAt: 'asc' },
  })

  return members.map((m) => ({
    id: m.id,
    userId: m.user.id,
    email: m.user.email,
    name: m.user.name,
    avatarUrl: m.user.avatarUrl,
    role: m.role,
    joinedAt: m.joinedAt,
    invitedAt: m.invitedAt,
    pending: !m.joinedAt,
  }))
})
