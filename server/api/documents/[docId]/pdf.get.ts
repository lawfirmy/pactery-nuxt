import { prisma } from '~/server/utils/db'

/** Serve PDF for viewing (sign page or authenticated users) */
export default defineEventHandler(async (event) => {
  const docId = getRouterParam(event, 'docId')!

  // Allow access via sign token or auth header
  const query = getQuery(event)
  const signToken = query.token as string | undefined

  if (signToken) {
    const signRequest = await prisma.signRequest.findUnique({
      where: { token: signToken },
      select: { documentId: true },
    })
    if (!signRequest || signRequest.documentId !== docId) {
      throw createError({ statusCode: 403, statusMessage: 'Invalid token' })
    }
  } else {
    // Require auth
    requireAuth(event)
  }

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

  const buffer = await getFile(fileKey)
  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Cache-Control', 'private, max-age=300')
  return buffer
})
