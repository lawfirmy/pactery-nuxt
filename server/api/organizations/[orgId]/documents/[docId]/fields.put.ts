import { z } from 'zod'
import { prisma } from '~~/server/utils/db'

const fieldsSchema = z.object({
  fields: z.array(z.object({
    signRequestId: z.string().optional(),
    type: z.enum(['signature', 'date', 'text', 'checkbox', 'initial']),
    page: z.number().int().min(0),
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    required: z.boolean().default(true),
  })),
})

/** Replace all sign fields for a document (member+) */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const docId = getRouterParam(event, 'docId')!
  await requireOrgRole(event, orgId, 'member')

  const body = await readValidatedBody(event, fieldsSchema.parse)

  // Delete existing fields and create new ones
  await prisma.$transaction([
    prisma.signField.deleteMany({ where: { documentId: docId } }),
    ...body.fields.map((field) =>
      prisma.signField.create({
        data: {
          documentId: docId,
          signRequestId: field.signRequestId,
          type: field.type,
          page: field.page,
          x: field.x,
          y: field.y,
          width: field.width,
          height: field.height,
          required: field.required,
        },
      }),
    ),
  ])

  const fields = await prisma.signField.findMany({
    where: { documentId: docId },
    orderBy: [{ page: 'asc' }, { y: 'desc' }],
  })

  return { fields }
})
