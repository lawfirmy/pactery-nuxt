import { z } from 'zod'
import { prisma } from '~~/server/utils/db'
import { sendEmail } from '~~/server/utils/email'

const schema = z.object({
  testEmail: z.string().email().optional(),
  batchSize: z.number().min(1).max(100).default(10),
})

/** Send campaign emails: test mode (single email) or batch mode */
export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const campaignId = getRouterParam(event, 'campaignId')!
  const body = await readValidatedBody(event, schema.parse)

  const campaign = await prisma.emailCampaign.findUnique({
    where: { id: campaignId },
  })

  if (!campaign) {
    throw createError({ statusCode: 404, statusMessage: 'Campaign not found' })
  }

  // Test mode: send to a single email without creating send records
  if (body.testEmail) {
    const html = renderCampaignHtml(campaign.bodyHtml, { email: body.testEmail })
    await sendEmail({
      to: body.testEmail,
      subject: `[TEST] ${campaign.subject}`,
      html,
    })
    return { mode: 'test', sentTo: body.testEmail }
  }

  // Batch mode: queue and send to recipients who haven't received this campaign yet
  const eligibleRecipients = await prisma.emailRecipient.findMany({
    where: {
      unsubscribedAt: null,
      bounceCount: { lt: 3 },
      sends: {
        none: { campaignId },
      },
    },
    take: body.batchSize,
    orderBy: { createdAt: 'asc' },
  })

  if (eligibleRecipients.length === 0) {
    return { mode: 'batch', sent: 0, failed: 0, remaining: 0, message: 'No eligible recipients' }
  }

  let sent = 0
  let failed = 0

  for (const recipient of eligibleRecipients) {
    const html = renderCampaignHtml(campaign.bodyHtml, { email: recipient.email, name: recipient.name })

    try {
      await sendEmail({
        to: recipient.email,
        subject: campaign.subject,
        html,
      })

      await prisma.emailSend.create({
        data: {
          campaignId,
          recipientId: recipient.id,
          status: 'sent',
          sentAt: new Date(),
        },
      })

      await prisma.emailRecipient.update({
        where: { id: recipient.id },
        data: { lastSentAt: new Date() },
      })

      sent++
    } catch (err: any) {
      await prisma.emailSend.create({
        data: {
          campaignId,
          recipientId: recipient.id,
          status: 'failed',
          error: err?.message || 'Unknown error',
        },
      })
      failed++
    }
  }

  // Count remaining
  const remaining = await prisma.emailRecipient.count({
    where: {
      unsubscribedAt: null,
      bounceCount: { lt: 3 },
      sends: {
        none: { campaignId },
      },
    },
  })

  return { mode: 'batch', sent, failed, remaining }
})

function renderCampaignHtml(html: string, vars: { email: string; name?: string | null }): string {
  const config = useRuntimeConfig()
  const unsubscribeUrl = `${config.public.appUrl}/unsubscribe?email=${encodeURIComponent(vars.email)}`

  let rendered = html
    .replace(/\{\{name\}\}/g, vars.name || '')
    .replace(/\{\{email\}\}/g, vars.email)
    .replace(/\{\{siteUrl\}\}/g, config.public.appUrl)
    .replace(/\{\{unsubscribeUrl\}\}/g, unsubscribeUrl)

  // Append unsubscribe footer
  rendered += `
<div style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;text-align:center;">
  <p style="font-size:11px;color:#9ca3af;line-height:1.6;">
    Pactery 전자서명 서비스 | pactery.com<br/>
    <a href="${unsubscribeUrl}" style="color:#9ca3af;text-decoration:underline;">수신거부</a>
  </p>
</div>`

  return rendered
}
