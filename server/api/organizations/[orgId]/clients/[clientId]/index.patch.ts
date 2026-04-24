import { z } from 'zod'
import { prisma } from '~/server/utils/db'

const updateClientSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  memo: z.string().optional(),
}).strict()

export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const clientId = getRouterParam(event, 'clientId')!
  await requireOrgRole(event, orgId, 'member')

  const body = await readValidatedBody(event, updateClientSchema.parse)

  return prisma.client.update({
    where: { id: clientId },
    data: body,
  })
})
