import { prisma } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    include: {
      orgMembers: {
        include: { org: true },
        where: { joinedAt: { not: null } },
      },
    },
  })

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    lawyerBarNumber: user.lawyerBarNumber,
    organizations: user.orgMembers.map((m) => ({
      id: m.org.id,
      name: m.org.name,
      role: m.role,
      logoUrl: m.org.logoUrl,
      plan: m.org.plan,
    })),
  }
})
