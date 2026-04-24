import { z } from 'zod'
import { prisma } from '~/server/utils/db'

const querySchema = z.object({
  q: z.string().min(1),
  limit: z.coerce.number().min(1).max(20).default(10),
})

/** Autocomplete search for clients (used in signer input) */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  await requireOrgRole(event, orgId, 'viewer')

  const query = await getValidatedQuery(event, querySchema.parse)

  const clients = await prisma.client.findMany({
    where: {
      orgId,
      OR: [
        { name: { contains: query.q, mode: 'insensitive' } },
        { email: { contains: query.q, mode: 'insensitive' } },
        { phone: { contains: query.q } },
        { company: { contains: query.q, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      company: true,
    },
    take: query.limit,
    orderBy: { name: 'asc' },
  })

  return clients
})
