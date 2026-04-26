import { z } from 'zod'
import { prisma } from '~~/server/utils/db'

const createDocSchema = z.object({
  title: z.string().min(1).max(200),
  memo: z.string().optional(),
  templateId: z.string().optional(),
  caseId: z.string().optional(),
  visibility: z.enum(['org_all', 'creator_only', 'specific_members']).default('org_all'),
  expiresAt: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
})

/** Create a new document (member+) */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const { auth } = await requireOrgRole(event, orgId, 'member')

  const body = await readValidatedBody(event, createDocSchema.parse)

  // Check quota
  const org = await prisma.organization.findUnique({ where: { id: orgId } })
  if (org && org.usedQuota >= org.monthlyQuota) {
    throw createError({ statusCode: 429, statusMessage: 'Monthly quota exceeded' })
  }

  const document = await prisma.document.create({
    data: {
      orgId,
      createdBy: auth.userId,
      title: body.title,
      memo: body.memo,
      templateId: body.templateId,
      caseId: body.caseId,
      visibility: body.visibility,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
      tags: body.tags
        ? { create: body.tags.map((tag) => ({ tag })) }
        : undefined,
    },
    include: {
      tags: { select: { tag: true } },
    },
  })

  // Create audit log
  await createAuditLog(event, {
    documentId: document.id,
    eventType: 'created',
    actorType: 'user',
    actorId: auth.userId,
  })

  return document
})
