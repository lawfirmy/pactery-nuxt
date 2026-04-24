import { z } from 'zod'
import { prisma } from '~/server/utils/db'

const createTemplateSchema = z.object({
  title: z.string().min(1).max(200),
  category: z.string().optional(),
  description: z.string().optional(),
  fieldsJson: z.any().optional(),
})

export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const { auth } = await requireOrgRole(event, orgId, 'member')

  const body = await readValidatedBody(event, createTemplateSchema.parse)

  const template = await prisma.template.create({
    data: {
      orgId,
      createdBy: auth.userId,
      title: body.title,
      category: body.category,
      description: body.description,
      fieldsJson: body.fieldsJson,
    },
  })

  return template
})
