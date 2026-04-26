import { z } from 'zod'
import { prisma } from '~~/server/utils/db'

const fieldsSchema = z.object({
  fields: z.array(z.object({
    type: z.enum(['signature', 'date', 'text', 'checkbox', 'initial']),
    page: z.number().int().min(0),
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    required: z.boolean().default(true),
    label: z.string().optional(),
  })),
})

/** Save field layout for a template */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const templateId = getRouterParam(event, 'templateId')!
  await requireOrgRole(event, orgId, 'member')

  const body = await readValidatedBody(event, fieldsSchema.parse)

  await prisma.template.update({
    where: { id: templateId },
    data: { fieldsJson: body.fields as any },
  })

  return { success: true }
})
