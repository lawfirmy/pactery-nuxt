import { prisma } from '~~/server/utils/db'

/** Download signed or original PDF */
export default defineEventHandler(async (event) => {
  const docId = getRouterParam(event, 'docId')!

  const doc = await prisma.document.findUnique({
    where: { id: docId },
    select: { title: true, originalFileKey: true, signedFileKey: true, status: true },
  })

  if (!doc) {
    throw createError({ statusCode: 404, statusMessage: 'Document not found' })
  }

  const fileKey = (doc.status === 'completed' && doc.signedFileKey) ? doc.signedFileKey : doc.originalFileKey

  if (!fileKey) {
    throw createError({ statusCode: 404, statusMessage: 'No PDF available' })
  }

  // Audit: log download
  await createAuditLog(event, {
    documentId: docId,
    eventType: 'downloaded',
    actorType: 'user',
    metadata: { type: 'document' },
  })

  const url = await getPresignedUrl(fileKey, 600)
  return sendRedirect(event, url)
})
