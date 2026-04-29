import { z } from 'zod'
import { prisma } from '~~/server/utils/db'

const updateDocSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  memo: z.string().optional(),
  expiresAt: z.string().nullable().optional(),
})

/** Update document metadata (member+) */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const docId = getRouterParam(event, 'docId')!
  const { auth } = await requireOrgRole(event, orgId, 'member')

  const body = await readValidatedBody(event, updateDocSchema.parse)

  const document = await prisma.document.findFirst({
    where: { id: docId, orgId },
  })

  if (!document) {
    throw createError({ statusCode: 404, statusMessage: 'Document not found' })
  }

  const data: any = {}
  if (body.title !== undefined) data.title = body.title
  if (body.memo !== undefined) data.memo = body.memo
  if (body.expiresAt !== undefined) {
    data.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null
  }

  const updated = await prisma.document.update({
    where: { id: docId },
    data,
  })

  return updated
})
