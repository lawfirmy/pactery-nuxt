import { prisma } from '~~/server/utils/db'

/**
 * GET /api/ab/active
 * 활성 A/B 테스트 목록 반환 (공개 API, 인증 불필요)
 */
export default defineEventHandler(async () => {
  const tests = await prisma.abTest.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      variants: true,
    },
  })

  return tests
})
