import { prisma } from '~/server/utils/db'
import { generateAuditTrailPdf } from '~/server/utils/pdf'

/** Download audit trail certificate PDF */
export default defineEventHandler(async (event) => {
  const docId = getRouterParam(event, 'docId')!

  const doc = await prisma.document.findUnique({
    where: { id: docId },
    include: {
      signRequests: true,
      auditLogs: { orderBy: { createdAt: 'asc' } },
    },
  })

  if (!doc) {
    throw createError({ statusCode: 404, statusMessage: 'Document not found' })
  }

  // Build signer name map
  const signerMap = new Map<string, string>()
  for (const sr of doc.signRequests) {
    signerMap.set(sr.id, sr.signerName)
  }

  const auditPdf = await generateAuditTrailPdf({
    documentTitle: doc.title,
    documentHash: doc.signedHash || doc.originalHash || 'N/A',
    events: doc.auditLogs.map((log) => {
      const meta = log.metadata as any
      return {
        eventType: formatEventType(log.eventType),
        actorName: meta?.signerName || meta?.signerEmail || (log.signRequestId ? signerMap.get(log.signRequestId) : null) || log.actorId || 'System',
        timestamp: log.createdAt.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
        ipAddress: log.ipAddress || undefined,
      }
    }),
  })

  // Audit: log download
  await createAuditLog(event, {
    documentId: docId,
    eventType: 'downloaded',
    actorType: 'user',
    metadata: { type: 'audit_trail' },
  })

  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Content-Disposition', `attachment; filename="audit-trail-${docId.slice(0, 8)}.pdf"`)
  return auditPdf
})

function formatEventType(type: string): string {
  const map: Record<string, string> = {
    created: '문서 생성', sent: '서명 요청 발송', opened: '문서 열람',
    signed: '서명 완료', rejected: '서명 거절', downloaded: '다운로드', printed: '인쇄',
  }
  return map[type] || type
}
