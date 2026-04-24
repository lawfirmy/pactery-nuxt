import { prisma } from '~/server/utils/db'

/** Serve PDF for viewing (via presigned URL or direct) */
export default defineEventHandler(async (event) => {
  const docId = getRouterParam(event, 'docId')!

  const doc = await prisma.document.findUnique({
    where: { id: docId },
    select: { originalFileKey: true, signedFileKey: true, status: true },
  })

  if (!doc) {
    throw createError({ statusCode: 404, statusMessage: 'Document not found' })
  }

  const fileKey = doc.status === 'completed' && doc.signedFileKey
    ? doc.signedFileKey
    : doc.originalFileKey

  if (!fileKey) {
    throw createError({ statusCode: 404, statusMessage: 'No PDF file available' })
  }

  try {
    const url = await getPresignedUrl(fileKey, 600) // 10 min
    return sendRedirect(event, url)
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Failed to generate download URL' })
  }
})
