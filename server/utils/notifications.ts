import { prisma } from './db'
import { sendEmail, buildSignRequestEmail, buildCompletedEmail, buildCcNotificationEmail } from './email'
import { generateAuditTrailPdf } from './pdf'

/** Send sign request emails to all pending signers */
export async function sendSignRequestNotifications(documentId: string) {
  const config = useRuntimeConfig()

  const doc = await prisma.document.findUnique({
    where: { id: documentId },
    include: {
      creator: { select: { name: true } },
      org: { select: { name: true, logoUrl: true, primaryColor: true } },
      signRequests: { where: { status: 'pending' } },
    },
  })

  if (!doc) return

  for (const sr of doc.signRequests) {
    const signUrl = `${config.public.appUrl}/sign/${sr.token}`

    const html = buildSignRequestEmail({
      signerName: sr.signerName,
      documentTitle: doc.title,
      senderName: doc.creator.name,
      orgName: doc.org.name,
      signUrl,
      orgColor: doc.org.primaryColor || undefined,
      orgLogoUrl: doc.org.logoUrl || undefined,
    })

    try {
      await sendEmail({
        to: sr.signerEmail,
        subject: `[서명 요청] ${doc.title} - ${doc.org.name}`,
        html,
      })
    } catch (err) {
      console.error(`Failed to send sign request email to ${sr.signerEmail}:`, err)
    }
  }
}

/** Send completed document to all participants */
export async function sendCompletedNotifications(documentId: string) {
  const config = useRuntimeConfig()

  const doc = await prisma.document.findUnique({
    where: { id: documentId },
    include: {
      creator: { select: { name: true, email: true } },
      org: { select: { name: true } },
      signRequests: { where: { status: 'signed' } },
      ccRecipients: true,
      auditLogs: { orderBy: { createdAt: 'asc' } },
    },
  })

  if (!doc) return

  // Generate audit trail PDF
  const auditPdf = await generateAuditTrailPdf({
    documentTitle: doc.title,
    documentHash: doc.signedHash || doc.originalHash || '',
    events: doc.auditLogs.map((log) => ({
      eventType: formatEventType(log.eventType),
      actorName: getActorName(log),
      timestamp: log.createdAt.toISOString(),
      ipAddress: log.ipAddress || undefined,
      details: log.metadata ? JSON.stringify(log.metadata) : undefined,
    })),
  })

  const downloadUrl = `${config.public.appUrl}/api/documents/${documentId}/pdf`

  // Collect all recipients (creator + signers)
  const recipients = new Map<string, string>()
  recipients.set(doc.creator.email, doc.creator.name)
  for (const sr of doc.signRequests) {
    recipients.set(sr.signerEmail, sr.signerName)
  }

  for (const [email, name] of recipients) {
    const html = buildCompletedEmail({
      recipientName: name,
      documentTitle: doc.title,
      orgName: doc.org.name,
      downloadUrl,
    })

    try {
      await sendEmail({
        to: email,
        subject: `[서명 완료] ${doc.title}`,
        html,
      })
    } catch (err) {
      console.error(`Failed to send completed email to ${email}:`, err)
    }
  }

  // Send to CC recipients
  for (const cc of doc.ccRecipients) {
    const html = buildCcNotificationEmail({
      recipientName: cc.name,
      documentTitle: doc.title,
      orgName: doc.org.name,
      downloadUrl,
    })

    try {
      await sendEmail({
        to: cc.email,
        subject: `[서명 완료 - 참조] ${doc.title}`,
        html,
      })
    } catch (err) {
      console.error(`Failed to send CC notification email to ${cc.email}:`, err)
    }
  }
}

function formatEventType(type: string): string {
  const map: Record<string, string> = {
    created: '문서 생성',
    sent: '서명 요청 발송',
    opened: '문서 열람',
    signed: '서명 완료',
    rejected: '서명 거절',
    downloaded: '문서 다운로드',
    printed: '문서 인쇄',
  }
  return map[type] || type
}

function getActorName(log: any): string {
  if (log.metadata && typeof log.metadata === 'object') {
    return (log.metadata as any).signerName || (log.metadata as any).signerEmail || log.actorId || 'System'
  }
  return log.actorId || 'System'
}
