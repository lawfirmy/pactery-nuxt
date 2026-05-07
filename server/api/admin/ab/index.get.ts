import { prisma } from '~~/server/utils/db'

interface VariantStat {
  id: string
  headline: string
  subtext: string
  cta: string
  badge: string
  weight: number
  views: number
  clicks: number
  signups: number
  ctr: number
}

interface AbTestWithStats {
  id: string
  name: string
  isActive: boolean
  createdAt: Date
  variants: VariantStat[]
  totalImpressions: number
}

/**
 * GET /api/admin/ab
 * 전체 A/B 테스트 + 통계 (인증 필요)
 */
export default defineEventHandler(async (event): Promise<AbTestWithStats[]> => {
  requireAdmin(event)

  const tests = await prisma.abTest.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      impressions: {
        select: { variantId: true, action: true },
      },
    },
  })

  return tests.map((test) => {
    const variants = test.variants as Array<{
      id: string
      headline: string
      subtext: string
      cta: string
      badge: string
      weight: number
    }>

    const variantStats: VariantStat[] = variants.map((v) => {
      const variantImpressions = test.impressions.filter((i) => i.variantId === v.id)
      const views = variantImpressions.filter((i) => i.action === 'view').length
      const clicks = variantImpressions.filter((i) => i.action === 'click').length
      const signups = variantImpressions.filter((i) => i.action === 'signup').length
      const ctr = views > 0 ? Math.round((clicks / views) * 1000) / 10 : 0

      return {
        id: v.id,
        headline: v.headline,
        subtext: v.subtext,
        cta: v.cta,
        badge: v.badge,
        weight: v.weight,
        views,
        clicks,
        signups,
        ctr,
      }
    })

    return {
      id: test.id,
      name: test.name,
      isActive: test.isActive,
      createdAt: test.createdAt,
      variants: variantStats,
      totalImpressions: test.impressions.length,
    }
  })
})
