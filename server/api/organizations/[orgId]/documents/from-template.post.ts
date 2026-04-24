import { z } from 'zod'
import { prisma } from '~/server/utils/db'

const fromTemplateSchema = z.object({
  templateId: z.string(),
  title: z.string().min(1).max(200),
  memo: z.string().optional(),
  caseId: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

/** Create a document from a template (copies PDF + field layout) */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const { auth } = await requireOrgRole(event, orgId, 'member')
  const body = await readValidatedBody(event, fromTemplateSchema.parse)

  const template = await prisma.template.findFirst({
    where: {
      id: body.templateId,
      OR: [{ orgId }, { isPreset: true }],
    },
  })

  if (!template) {
    throw createError({ statusCode: 404, statusMessage: 'Template not found' })
  }

  // Check quota
  const org = await prisma.organization.findUnique({ where: { id: orgId } })
  if (org && org.usedQuota >= org.monthlyQuota) {
    throw createError({ statusCode: 429, statusMessage: 'Monthly quota exceeded' })
  }

  // Create document with template's PDF
  const document = await prisma.document.create({
    data: {
      orgId,
      createdBy: auth.userId,
      title: body.title,
      memo: body.memo,
      templateId: template.id,
      caseId: body.caseId,
      originalFileKey: template.fileKey,
      tags: body.tags ? { create: body.tags.map((tag) => ({ tag })) } : undefined,
    },
  })

  // Copy template fields to document
  if (template.fieldsJson && Array.isArray(template.fieldsJson)) {
    const fields = template.fieldsJson as any[]
    if (fields.length > 0) {
      await prisma.signField.createMany({
        data: fields.map((f) => ({
          documentId: document.id,
          type: f.type,
          page: f.page,
          x: f.x,
          y: f.y,
          width: f.width,
          height: f.height,
          required: f.required ?? true,
        })),
      })
    }
  }

  await createAuditLog(event, {
    documentId: document.id,
    eventType: 'created',
    actorType: 'user',
    actorId: auth.userId,
    metadata: { fromTemplate: template.title },
  })

  return document
})
