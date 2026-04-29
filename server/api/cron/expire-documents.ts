import { prisma } from '~~/server/utils/db'

/** Cron: expire documents past their expiresAt date */
export default defineEventHandler(async (event) => {
  // Authenticate via CRON_SECRET header
  const config = useRuntimeConfig()
  const secret = getHeader(event, 'x-cron-secret')

  if (!config.cronSecret || secret !== config.cronSecret) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  try {
    const now = new Date()

    // Find documents that should be expired
    const expiredDocs = await prisma.document.findMany({
      where: {
        expiresAt: { lt: now },
        status: { in: ['draft', 'pending'] },
      },
      select: { id: true, title: true, status: true },
    })

    if (expiredDocs.length === 0) {
      return { expired: 0, message: 'No documents to expire' }
    }

    // Update all expired documents
    await prisma.document.updateMany({
      where: {
        id: { in: expiredDocs.map((d) => d.id) },
      },
      data: { status: 'expired' },
    })

    // Create audit logs for each expired document
    const auditLogs = expiredDocs.map((doc) => ({
      documentId: doc.id,
      eventType: 'expired',
      actorType: 'system',
      ipAddress: '',
      userAgent: 'cron/expire-documents',
      metadata: { previousStatus: doc.status } as any,
    }))

    await prisma.auditLog.createMany({ data: auditLogs })

    console.log(`[CRON] Expired ${expiredDocs.length} documents`)

    return {
      expired: expiredDocs.length,
      documentIds: expiredDocs.map((d) => d.id),
    }
  } catch (error) {
    console.error('[CRON] expire-documents error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal error during expiration' })
  }
})
