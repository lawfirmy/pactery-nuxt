import { prisma } from '~~/server/utils/db'
import { sha256 } from '~~/server/utils/crypto'

/** Upload PDF file for a document (member+) */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const docId = getRouterParam(event, 'docId')!
  const { auth } = await requireOrgRole(event, orgId, 'member')

  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })
  }

  const file = formData.find((f) => f.name === 'file')
  if (!file || !file.data) {
    throw createError({ statusCode: 400, statusMessage: 'File field required' })
  }

  if (file.type !== 'application/pdf') {
    throw createError({ statusCode: 400, statusMessage: 'Only PDF files are allowed' })
  }

  // Upload to S3
  const fileKey = await uploadFile(file.data, 'application/pdf', `documents/${orgId}`)
  const fileHash = sha256(file.data)

  // Update document
  const document = await prisma.document.update({
    where: { id: docId },
    data: {
      originalFileKey: fileKey,
      originalHash: fileHash,
    },
  })

  return { fileKey, hash: fileHash }
})
