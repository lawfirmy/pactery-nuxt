import { z } from 'zod'
import { prisma } from '~/server/utils/db'

const querySchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  caseId: z.string().optional(),
  createdBy: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sort: z.enum(['createdAt', 'title', 'status', 'completedAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

/** List documents in organization with search/filter */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const { auth } = await requireOrgRole(event, orgId, 'viewer')

  const query = await getValidatedQuery(event, querySchema.parse)

  const where: any = { orgId }

  // Visibility check: viewers/members see only their own or org_all
  const member = await prisma.orgMember.findUnique({
    where: { orgId_userId: { orgId, userId: auth.userId } },
  })
  if (member && (member.role === 'viewer' || member.role === 'member')) {
    where.OR = [
      { visibility: 'org_all' },
      { createdBy: auth.userId },
    ]
  }

  if (query.status) where.status = query.status
  if (query.caseId) where.caseId = query.caseId
  if (query.createdBy) where.createdBy = query.createdBy

  if (query.dateFrom || query.dateTo) {
    where.createdAt = {}
    if (query.dateFrom) where.createdAt.gte = new Date(query.dateFrom)
    if (query.dateTo) where.createdAt.lte = new Date(query.dateTo + 'T23:59:59.999Z')
  }

  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: 'insensitive' } },
      { signRequests: { some: { signerName: { contains: query.search, mode: 'insensitive' } } } },
      { signRequests: { some: { signerEmail: { contains: query.search, mode: 'insensitive' } } } },
      { tags: { some: { tag: { contains: query.search, mode: 'insensitive' } } } },
    ]
  }

  const [documents, total] = await Promise.all([
    prisma.document.findMany({
      where,
      include: {
        creator: { select: { id: true, name: true, email: true } },
        signRequests: { select: { id: true, signerName: true, signerEmail: true, status: true } },
        tags: { select: { tag: true } },
        case: { select: { id: true, caseNumber: true, title: true } },
      },
      orderBy: { [query.sort]: query.order },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.document.count({ where }),
  ])

  return {
    documents,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  }
})
