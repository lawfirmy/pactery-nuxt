import { prisma } from '~~/server/utils/db'

/** Serve PDF file for authenticated org members */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const docId = getRouterParam(event, 'docId')!

  try {
    await requireOrgRole(event, orgId, 'viewer')

    const document = await prisma.document.findFirst({
      where: { id: docId, orgId },
    })

    if (!document) {
      throw createError({ statusCode: 404, statusMessage: 'Document not found' })
    }

    const fileKey = document.signedFileKey || document.originalFileKey
    if (!fileKey) {
      throw createError({ statusCode: 404, statusMessage: 'No PDF uploaded' })
    }

    console.log(`[PDF] Serving file: key=${fileKey}, docId=${docId}`)
    const buffer = await getFile(fileKey)
    console.log(`[PDF] File loaded: ${buffer.length} bytes`)

    setHeader(event, 'Content-Type', 'application/pdf')
    setHeader(event, 'Cache-Control', 'private, max-age=300')
    return buffer
  } catch (err: any) {
    console.error(`[PDF ERROR] docId=${docId}, orgId=${orgId}`, err?.message || err, err?.stack)
    throw err
  }
})
