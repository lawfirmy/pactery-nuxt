import { prisma } from '~~/server/utils/db'

/** Send document for signing (draft → pending) */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const docId = getRouterParam(event, 'docId')!
  const { auth } = await requireOrgRole(event, orgId, 'member')

  const document = await prisma.document.findFirst({
    where: { id: docId, orgId },
    include: {
      signRequests: true,
      signFields: true,
    },
  })

  if (!document) {
    throw createError({ statusCode: 404, statusMessage: 'Document not found' })
  }
  if (document.status !== 'draft') {
    throw createError({ statusCode: 400, statusMessage: 'Document is not in draft status' })
  }
  if (!document.originalFileKey) {
    throw createError({ statusCode: 400, statusMessage: 'PDF file not uploaded' })
  }
  if (document.signRequests.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'At least one signer is required' })
  }

  // Update document status and increment quota
  const updated = await prisma.$transaction(async (tx) => {
    const doc = await tx.document.update({
      where: { id: docId },
      data: { status: 'pending' },
    })

    await tx.organization.update({
      where: { id: orgId },
      data: { usedQuota: { increment: 1 } },
    })

    return doc
  })

  // Audit log
  await createAuditLog(event, {
    documentId: docId,
    eventType: 'sent',
    actorType: 'user',
    actorId: auth.userId,
    metadata: {
      signerCount: document.signRequests.length,
      fieldCount: document.signFields.length,
    },
  })

  // TODO: Send email notifications to signers
  // await sendSignRequestNotifications(docId)

  return updated
})
