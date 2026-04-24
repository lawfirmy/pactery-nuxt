import { z } from 'zod'
import { prisma } from '~/server/utils/db'

const querySchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
})

export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  await requireOrgRole(event, orgId, 'viewer')

  const query = await getValidatedQuery(event, querySchema.parse)
  const where: any = { orgId }

  if (query.status) where.status = query.status
  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: 'insensitive' } },
      { caseNumber: { contains: query.search, mode: 'insensitive' } },
    ]
  }

  const [cases, total] = await Promise.all([
    prisma.case.findMany({
      where,
      include: {
        client: { select: { id: true, name: true } },
        _count: { select: { documents: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.case.count({ where }),
  ])

  return { cases, pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) } }
})
