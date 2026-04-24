import { z } from 'zod'
import { prisma } from '~/server/utils/db'
import { signToken } from '~/server/utils/jwt'

const kakaoSchema = z.object({
  accessToken: z.string(),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, kakaoSchema.parse)

  // Verify Kakao access token
  const kakaoUser = await $fetch<any>('https://kapi.kakao.com/v2/user/me', {
    headers: { Authorization: `Bearer ${body.accessToken}` },
  })

  if (!kakaoUser.id) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid Kakao token' })
  }

  const email = kakaoUser.kakao_account?.email
  const name = kakaoUser.kakao_account?.profile?.nickname || `User${kakaoUser.id}`
  const avatarUrl = kakaoUser.kakao_account?.profile?.profile_image_url

  if (!email) {
    throw createError({ statusCode: 400, statusMessage: 'Email permission required' })
  }

  let user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          name,
          avatarUrl,
          provider: 'kakao',
          providerId: String(kakaoUser.id),
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
