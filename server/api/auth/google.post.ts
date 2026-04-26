import { z } from 'zod'
import { prisma } from '~~/server/utils/db'
import { signToken } from '~~/server/utils/jwt'

const googleSchema = z.object({
  credential: z.string(), // Google ID token
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, googleSchema.parse)
  const config = useRuntimeConfig()

  // Verify Google ID token
  const googleResponse = await $fetch<any>(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${body.credential}`,
  )

  if (!googleResponse.email || googleResponse.aud !== config.googleClientId) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid Google token' })
  }

  // Find or create user
  let user = await prisma.user.findUnique({ where: { email: googleResponse.email } })

  if (!user) {
    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: googleResponse.email,
          name: googleResponse.name || googleResponse.email.split('@')[0],
          avatarUrl: googleResponse.picture,
          provider: 'google',
          providerId: googleResponse.sub,
        },
      })

      await tx.organization.create({
        data: {
          name: `${newUser.name}의 워크스페이스`,
          members: {
            create: {
              userId: newUser.id,
              role: 'owner',
              joinedAt: new Date(),
            },
          },
        },
      })

      return newUser
    })
    user = result
  }

  const token = signToken({ userId: user.id, email: user.email })

  return { token, user: { id: user.id, email: user.email, name: user.name } }
})
