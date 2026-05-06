import { z } from 'zod'
import { prisma } from '~~/server/utils/db'
import { signToken } from '~~/server/utils/jwt'

const callbackSchema = z.object({
  code: z.string(),
  redirectUri: z.string(),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, callbackSchema.parse)
  const config = useRuntimeConfig()

  // Exchange authorization code for access token
  const tokenResponse = await $fetch<any>('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: config.kakaoClientId,
      client_secret: config.kakaoClientSecret,
      redirect_uri: body.redirectUri,
      code: body.code,
    }).toString(),
  })

  if (!tokenResponse.access_token) {
    throw createError({ statusCode: 401, statusMessage: 'Failed to get Kakao access token' })
  }

  // Get user info with access token
  const kakaoUser = await $fetch<any>('https://kapi.kakao.com/v2/user/me', {
    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
  })

  if (!kakaoUser.id) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid Kakao token' })
  }

  const email = kakaoUser.kakao_account?.email
  const name = kakaoUser.kakao_account?.profile?.nickname || `User${kakaoUser.id}`
  const avatarUrl = kakaoUser.kakao_account?.profile?.profile_image_url

  if (!email) {
    throw createError({ statusCode: 400, statusMessage: '카카오 계정에 이메일 동의가 필요합니다' })
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
