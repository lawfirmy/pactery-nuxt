import { prisma } from '~/server/utils/db'

/** List organizations the current user belongs to */
export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)

  const memberships = await prisma.orgMember.findMany({
    where: { userId: auth.userId, joinedAt: { not: null } },
    include: {
      org: {
        include: {
          _count: { select: { members: true, documents: true } },
        },
      },
    },
    orderBy: { joinedAt: 'desc' },
  })

  return memberships.map((m) => ({
    id: m.org.id,
    name: m.org.name,
    role: m.role,
    logoUrl: m.org.logoUrl,
    plan: m.org.plan,
    memberCount: m.org._count.members,
    documentCount: m.org._count.documents,
  }))
})
