import { z } from 'zod'
import { prisma } from '~~/server/utils/db'

const updateOrgSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  businessNumber: z.string().optional(),
  representative: z.string().optional(),
  primaryColor: z.string().optional(),
}).strict()

/** Update organization settings (admin+) */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  await requireOrgRole(event, orgId, 'admin')

  const body = await readValidatedBody(event, updateOrgSchema.parse)

  const org = await prisma.organization.update({
    where: { id: orgId },
    data: body,
  })

  return { id: org.id, name: org.name, businessNumber: org.businessNumber }
})
