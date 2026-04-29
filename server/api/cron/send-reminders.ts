import { prisma } from '~~/server/utils/db'
import { sendEmail, buildReminderEmail } from '~~/server/utils/email'

/** Cron: send reminder emails to pending signers (3+ days since request) */
export default defineEventHandler(async (event) => {
  // Authenticate via CRON_SECRET header
  const config = useRuntimeConfig()
  const secret = getHeader(event, 'x-cron-secret')

  if (!config.cronSecret || secret !== config.cronSecret) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  try {
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

    // Find pending sign requests older than 3 days
    const pendingRequests = await prisma.signRequest.findMany({
      where: {
        status: 'pending',
        createdAt: { lt: threeDaysAgo },
        document: {
          status: 'pending',
        },
      },
      include: {
        document: {
          include: {
            org: { select: { name: true, primaryColor: true, logoUrl: true } },
          },
        },
      },
    })

    if (pendingRequests.length === 0) {
      return { sent: 0, message: 'No reminders to send' }
    }

    // Filter out those already reminded (check audit logs)
    const alreadyReminded = await prisma.auditLog.findMany({
      where: {
        signRequestId: { in: pendingRequests.map((r) => r.id) },
        eventType: 'reminder_sent',
      },
      select: { signRequestId: true },
    })

    const remindedIds = new Set(alreadyReminded.map((a) => a.signRequestId))
    const toRemind = pendingRequests.filter((r) => !remindedIds.has(r.id))

    if (toRemind.length === 0) {
      return { sent: 0, message: 'All pending requests already reminded' }
    }

    const appUrl = config.public.appUrl || 'https://pactery.com'
    let sentCount = 0

    for (const request of toRemind) {
      try {
        const signUrl = `${appUrl}/sign/${request.token}`

        const html = buildReminderEmail({
          signerName: request.signerName,
          documentTitle: request.document.title,
          signUrl,
          orgName: request.document.org.name,
          orgColor: request.document.org.primaryColor || undefined,
        })

        await sendEmail({
          to: request.signerEmail,
          subject: `[리마인더] "${request.document.title}" 서명을 완료해주세요`,
          html,
        })

        // Create audit log
        await prisma.auditLog.create({
          data: {
            documentId: request.documentId,
            signRequestId: request.id,
            eventType: 'reminder_sent',
            actorType: 'system',
            ipAddress: '',
            userAgent: 'cron/send-reminders',
            metadata: { signerEmail: request.signerEmail } as any,
          },
        })

        sentCount++
      } catch (err) {
        console.error(`[CRON] Failed to send reminder to ${request.signerEmail}:`, err)
      }
    }

    console.log(`[CRON] Sent ${sentCount} reminders`)

    return { sent: sentCount, total: toRemind.length }
  } catch (error) {
    console.error('[CRON] send-reminders error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal error during reminder sending' })
  }
})
