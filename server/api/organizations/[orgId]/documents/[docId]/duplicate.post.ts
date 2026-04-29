import { prisma } from '~~/server/utils/db'

/** Duplicate a document (member+) */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const docId = getRouterParam(event, 'docId')!
  const { auth } = await requireOrgRole(event, orgId, 'member')

  const original = await prisma.document.findFirst({
    where: { id: docId, orgId },
    include: {
      signFields: true,
      tags: { select: { tag: true } },
    },
  })

  if (!original) {
    throw createError({ statusCode: 404, statusMessage: 'Document not found' })
  }

  // Create duplicated document
  const duplicated = await prisma.document.create({
    data: {
      orgId,
      createdBy: auth.userId,
      title: `사본 - ${original.title}`,
      status: 'draft',
      memo: original.memo,
      originalFileKey: original.originalFileKey,
      originalHash: original.originalHash,
      caseId: original.caseId,
      visibility: original.visibility,
      expiresAt: original.expiresAt,
      // Copy sign fields (without values, without signRequestId)
      signFields: original.signFields.length > 0
        ? {
            create: original.signFields.map((f) => ({
              type: f.type,
              page: f.page,
              x: f.x,
              y: f.y,
              width: f.width,
              height: f.height,
              required: f.required,
              // signRequestId and value are NOT copied
            })),
          }
        : undefined,
      // Copy tags
      tags: original.tags.length > 0
        ? { create: original.tags.map((t) => ({ tag: t.tag })) }
        : undefined,
    },
    include: {
      signFields: true,
      tags: { select: { tag: true } },
    },
  })

  // Audit log
  await createAuditLog(event, {
    documentId: duplicated.id,
    eventType: 'created',
    actorType: 'user',
    actorId: auth.userId,
    metadata: {
      duplicatedFrom: original.id,
      originalTitle: original.title,
    },
  })

  return duplicated
})
