import { z } from 'zod'
import archiver from 'archiver'
import { PassThrough } from 'stream'
import { prisma } from '~~/server/utils/db'
import { generateAuditTrailPdf } from '~~/server/utils/pdf'

const bulkSchema = z.object({
  documentIds: z.array(z.string()).min(1).max(50),
  includeAuditTrail: z.boolean().default(true),
})

/** Bulk download selected documents as ZIP */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const { auth } = await requireOrgRole(event, orgId, 'viewer')
  const body = await readValidatedBody(event, bulkSchema.parse)

  const documents = await prisma.document.findMany({
    where: { id: { in: body.documentIds }, orgId },
    include: {
      signRequests: true,
      auditLogs: { orderBy: { createdAt: 'asc' } },
    },
  })

  if (documents.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'No documents found' })
  }

  setHeader(event, 'Content-Type', 'application/zip')
  setHeader(event, 'Content-Disposition', `attachment; filename="pactery-documents-${Date.now()}.zip"`)

  const archive = archiver('zip', { zlib: { level: 5 } })
  const passthrough = new PassThrough()
  archive.pipe(passthrough)

  for (const doc of documents) {
    const fileKey = (doc.status === 'completed' && doc.signedFileKey) ? doc.signedFileKey : doc.originalFileKey
    if (!fileKey) continue

    const safeTitle = doc.title.replace(/[^a-zA-Z0-9가-힣\s\-_]/g, '').trim() || doc.id.slice(0, 8)

    try {
      const fileBuffer = await getFile(fileKey)
      archive.append(fileBuffer, { name: `${safeTitle}.pdf` })

      if (body.includeAuditTrail) {
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
              eventType: formatEvent(log.eventType),
              actorName: meta?.signerName || meta?.signerEmail || (log.signRequestId ? signerMap.get(log.signRequestId) : null) || 'System',
              timestamp: log.createdAt.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
              ipAddress: log.ipAddress || undefined,
            }
          }),
        })
        archive.append(auditPdf, { name: `${safeTitle}_감사추적인증서.pdf` })
      }
    } catch (err) {
      console.error(`Failed to add document ${doc.id} to ZIP:`, err)
    }
  }

  archive.finalize()

  return sendStream(event, passthrough)
})

function formatEvent(type: string): string {
  return { created: '문서 생성', sent: '서명 요청', opened: '열람', signed: '서명 완료', rejected: '거절', downloaded: '다운로드' }[type] || type
}
