import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '~~/server/utils/db'
import { signToken } from '~~/server/utils/jwt'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, loginSchema.parse)

  const user = await prisma.user.findUnique({
    where: { email: body.email },
    include: {
      orgMembers: {
        include: { org: true },
        where: { joinedAt: { not: null } },
      },
    },
  })

  if (!user || !user.passwordHash) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }

  const valid = await bcrypt.compare(body.password, user.passwordHash)
  if (!valid) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }

  const token = signToken({ userId: user.id, email: user.email })

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      lawyerBarNumber: user.lawyerBarNumber,
    },
    organizations: user.orgMembers.map((m) => ({
      id: m.org.id,
      name: m.org.name,
      role: m.role,
      logoUrl: m.org.logoUrl,
    })),
  }
})
