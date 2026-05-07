import { prisma } from '~~/server/utils/db'

/** List all email campaigns with send stats */
export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const campaigns = await prisma.emailCampaign.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { sends: true },
      },
    },
  })

  // Get send stats per campaign
  const result = await Promise.all(
    campaigns.map(async (c) => {
      const stats = await prisma.emailSend.groupBy({
        by: ['status'],
        where: { campaignId: c.id },
        _count: true,
      })

      const statusMap: Record<string, number> = {}
      for (const s of stats) {
        statusMap[s.status] = s._count
      }

      return {
        id: c.id,
        name: c.name,
        subject: c.subject,
        isActive: c.isActive,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        totalSends: c._count.sends,
        pending: statusMap['pending'] || 0,
        sent: statusMap['sent'] || 0,
        failed: statusMap['failed'] || 0,
        bounced: statusMap['bounced'] || 0,
      }
    }),
  )

  return result
})
