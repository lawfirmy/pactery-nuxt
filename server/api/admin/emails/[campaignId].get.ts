import { prisma } from '~~/server/utils/db'

/** Get a single campaign with full details */
export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const campaignId = getRouterParam(event, 'campaignId')!

  const campaign = await prisma.emailCampaign.findUnique({
    where: { id: campaignId },
    include: {
      _count: { select: { sends: true } },
    },
  })

  if (!campaign) {
    throw createError({ statusCode: 404, statusMessage: 'Campaign not found' })
  }

  return campaign
})
