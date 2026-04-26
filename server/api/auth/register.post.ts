import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '~~/server/utils/db'
import { signToken } from '~~/server/utils/jwt'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(50),
  phone: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, registerSchema.parse)

  const existing = await prisma.user.findUnique({ where: { email: body.email } })
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Email already registered' })
  }

  const passwordHash = await bcrypt.hash(body.password, 12)

  // Create user + personal organization in a transaction
  const { user, org } = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: body.email,
        passwordHash,
        name: body.name,
        phone: body.phone,
        provider: 'local',
      },
    })

    // Auto-create personal organization
    const org = await tx.organization.create({
      data: {
        name: `${body.name}의 워크스페이스`,
        members: {
          create: {
            userId: user.id,
            role: 'owner',
            joinedAt: new Date(),
          },
        },
      },
    })

    return { user, org }
  })

  const token = signToken({ userId: user.id, email: user.email })

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
    },
    organization: {
      id: org.id,
      name: org.name,
    },
  }
})
