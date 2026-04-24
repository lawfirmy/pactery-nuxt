import { z } from 'zod'
import { prisma } from '~/server/utils/db'

const createClientSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  memo: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  await requireOrgRole(event, orgId, 'member')

  const body = await readValidatedBody(event, createClientSchema.parse)

  const client = await prisma.client.create({
    data: { orgId, ...body },
  })

  return client
})
