import { z } from 'zod'
import { prisma } from '~~/server/utils/db'

const bodySchema = z.object({
  isActive: z.boolean().optional(),
  variants: z.array(
    z.object({
      id: z.string(),
      headline: z.string(),
      subtext: z.string(),
      cta: z.string(),
      badge: z.string(),
      weight: z.number().int().min(0).max(100),
    })
  ).optional(),
})

/**
 * PATCH /api/admin/ab/:id
 * A/B 테스트 수정 (variants, isActive) (인증 필요)
 */
export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing test id' })
  }

  const body = await readBody(event)
  const parsed = bodySchema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request body' })
  }

  const existing = await prisma.abTest.findUnique({ where: { id } })
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Test not found' })
  }

  const updated = await prisma.abTest.update({
    where: { id },
    data: {
      ...(parsed.data.isActive !== undefined && { isActive: parsed.data.isActive }),
      ...(parsed.data.variants !== undefined && { variants: parsed.data.variants as any }),
    },
  })

  return updated
})
