import { z } from 'zod'
import { prisma } from '~~/server/utils/db'

const bodySchema = z.object({
  testId: z.string().uuid(),
  variantId: z.string().min(1).max(10),
  action: z.enum(['view', 'click', 'signup']).default('view'),
})

/**
 * POST /api/ab/impress
 * impression 기록 (공개 API, 인증 불필요)
 * body: { testId, variantId, action }
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = bodySchema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request body' })
  }

  const { testId, variantId, action } = parsed.data

  // 테스트 존재 여부 확인 (활성 테스트만 허용)
  const test = await prisma.abTest.findFirst({
    where: { id: testId, isActive: true },
    select: { id: true },
  })

  if (!test) {
    throw createError({ statusCode: 404, statusMessage: 'Test not found or inactive' })
  }

  const ip = getRequestHeader(event, 'x-forwarded-for')
    ?? getRequestHeader(event, 'x-real-ip')
    ?? event.node.req.socket?.remoteAddress
    ?? null

  const userAgent = getRequestHeader(event, 'user-agent') ?? null

  await prisma.abImpression.create({
    data: {
      testId,
      variantId,
      action,
      ip,
      userAgent,
    },
  })

  return { ok: true }
})
