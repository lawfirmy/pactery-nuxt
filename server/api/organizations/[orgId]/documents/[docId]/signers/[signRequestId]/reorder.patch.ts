import { z } from 'zod'
import { prisma } from '~~/server/utils/db'

const reorderSchema = z.object({
  orderIndex: z.number().int().min(0),
})

/** Reorder a signer (swap with adjacent, draft only) */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const docId = getRouterParam(event, 'docId')!
  const signRequestId = getRouterParam(event, 'signRequestId')!
  await requireOrgRole(event, orgId, 'member')

  const body = await readValidatedBody(event, reorderSchema.parse)

  const document = await prisma.document.findFirst({
    where: { id: docId, orgId, status: 'draft' },
  })
  if (!document) {
    throw createError({ statusCode: 404, statusMessage: 'Document not found or not in draft status' })
  }

  const allSigners = await prisma.signRequest.findMany({
    where: { documentId: docId },
    orderBy: { orderIndex: 'asc' },
  })

  const currentIdx = allSigners.findIndex(s => s.id === signRequestId)
  if (currentIdx === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Sign request not found' })
  }

  const targetIdx = Math.min(body.orderIndex, allSigners.length - 1)
  if (targetIdx === currentIdx) return { success: true }

  // Swap order indices
  const current = allSigners[currentIdx]
  const target = allSigners[targetIdx]

  await prisma.$transaction([
    prisma.signRequest.update({
      where: { id: current.id },
      data: { orderIndex: target.orderIndex },
    }),
    prisma.signRequest.update({
      where: { id: target.id },
      data: { orderIndex: current.orderIndex },
    }),
  ])

  return { success: true }
})
