import { prisma } from '~/server/utils/db'

/** Serve PDF file for authenticated org members */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const docId = getRouterParam(event, 'docId')!
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

  const buffer = await getFile(fileKey)
  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Cache-Control', 'private, max-age=300')
  return buffer
})
