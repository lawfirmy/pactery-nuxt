import { z } from 'zod'
import { prisma } from '~~/server/utils/db'

const schema = z.object({
  name: z.string().min(1).max(200).optional(),
  subject: z.string().min(1).max(500).optional(),
  bodyHtml: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
})

/** Update an email campaign */
export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const campaignId = getRouterParam(event, 'campaignId')!

  const body = await readValidatedBody(event, schema.parse)

  const campaign = await prisma.emailCampaign.update({
    where: { id: campaignId },
    data: body,
  })

  return campaign
})
