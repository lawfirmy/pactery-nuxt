import { z } from 'zod'
import { prisma } from '~~/server/utils/db'

const updateSignerSchema = z.object({
  signerName: z.string().min(1).max(100).optional(),
  signerEmail: z.string().email().optional(),
  signerPhone: z.string().optional(),
})

/** Update signer info (draft status only) */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const docId = getRouterParam(event, 'docId')!
  const signRequestId = getRouterParam(event, 'signRequestId')!
  await requireOrgRole(event, orgId, 'member')

  const body = await readValidatedBody(event, updateSignerSchema.parse)

  const document = await prisma.document.findFirst({
    where: { id: docId, orgId, status: 'draft' },
  })
  if (!document) {
    throw createError({ statusCode: 404, statusMessage: 'Document not found or not in draft status' })
  }

  const signRequest = await prisma.signRequest.findFirst({
    where: { id: signRequestId, documentId: docId },
  })
  if (!signRequest) {
    throw createError({ statusCode: 404, statusMessage: 'Sign request not found' })
  }

  const updated = await prisma.signRequest.update({
    where: { id: signRequestId },
    data: {
      ...(body.signerName && { signerName: body.signerName }),
      ...(body.signerEmail && { signerEmail: body.signerEmail }),
      ...(body.signerPhone !== undefined && { signerPhone: body.signerPhone || null }),
    },
  })

  return updated
})
