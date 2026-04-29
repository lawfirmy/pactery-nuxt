import { z } from 'zod'
import { prisma } from '~~/server/utils/db'

const addCcSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
})

/** Add a CC recipient to a document */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const docId = getRouterParam(event, 'docId')!
  await requireOrgRole(event, orgId, 'member')

  const body = await readValidatedBody(event, addCcSchema.parse)

  const document = await prisma.document.findFirst({
    where: { id: docId, orgId, status: 'draft' },
  })
  if (!document) {
    throw createError({ statusCode: 404, statusMessage: 'Document not found or not in draft status' })
  }

  const ccRecipient = await prisma.ccRecipient.create({
    data: {
      documentId: docId,
      name: body.name,
      email: body.email,
    },
  })

  return ccRecipient
})
