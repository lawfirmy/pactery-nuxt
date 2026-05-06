import { z } from 'zod'
import { prisma } from '~~/server/utils/db'

const clientSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().optional().or(z.literal('')).transform(v => v || undefined),
  phone: z.string().optional().or(z.literal('')).transform(v => v || undefined),
  company: z.string().optional().or(z.literal('')).transform(v => v || undefined),
  memo: z.string().optional().or(z.literal('')).transform(v => v || undefined),
})

const bulkSchema = z.object({
  clients: z.array(clientSchema).min(1).max(500),
})

export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  await requireOrgRole(event, orgId, 'member')

  const { clients } = await readValidatedBody(event, bulkSchema.parse)

  const created = await prisma.client.createMany({
    data: clients.map(c => ({
      orgId,
      name: c.name,
      email: c.email,
      phone: c.phone,
      company: c.company,
      memo: c.memo,
    })),
  })

  return { count: created.count }
})
