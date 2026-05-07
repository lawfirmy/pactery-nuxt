import { prisma } from '~~/server/utils/db'

/**
 * DELETE /api/admin/ab/:id
 * A/B 테스트 삭제 (cascade로 impressions도 삭제됨) (인증 필요)
 */
export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing test id' })
  }

  const existing = await prisma.abTest.findUnique({ where: { id } })
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Test not found' })
  }

  await prisma.abTest.delete({ where: { id } })

  return { ok: true }
})
