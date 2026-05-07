import { z } from 'zod'
import { prisma } from '~~/server/utils/db'

const schema = z.object({
  name: z.string().min(1).max(200),
  subject: z.string().min(1).max(500),
  bodyHtml: z.string().min(1),
})

/** Create a new email campaign */
export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readValidatedBody(event, schema.parse)

  const campaign = await prisma.emailCampaign.create({
    data: {
      name: body.name,
      subject: body.subject,
      bodyHtml: body.bodyHtml,
    },
  })

  return campaign
})
