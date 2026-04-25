import { z } from 'zod'
import { prisma } from '~/server/utils/db'

const addSignerSchema = z.object({
  signerName: z.string().min(1).max(100),
  signerEmail: z.string().email(),
  signerPhone: z.string().optional(),
  orderIndex: z.number().int().min(0).optional(),
})

/** Add a signer to a document (creates SignRequest) */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const docId = getRouterParam(event, 'docId')!
  await requireOrgRole(event, orgId, 'member')

  const body = await readValidatedBody(event, addSignerSchema.parse)

  const document = await prisma.document.findFirst({
    where: { id: docId, orgId, status: 'draft' },
  })
  if (!document) {
    throw createError({ statusCode: 404, statusMessage: 'Document not found or not in draft status' })
  }

  // Auto-determine order index if not provided
  let orderIndex = body.orderIndex
  if (orderIndex === undefined) {
    const maxOrder = await prisma.signRequest.aggregate({
      where: { documentId: docId },
      _max: { orderIndex: true },
    })
    orderIndex = (maxOrder._max.orderIndex ?? -1) + 1
  }

  const signRequest = await prisma.signRequest.create({
    data: {
      documentId: docId,
      signerName: body.signerName,
      signerEmail: body.signerEmail,
      signerPhone: body.signerPhone,
      orderIndex,
    },
  })

  return signRequest
})
