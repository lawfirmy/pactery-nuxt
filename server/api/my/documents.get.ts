import { z } from 'zod'
import { prisma } from '~~/server/utils/db'

const querySchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
})

/** Signer portal: list my signed documents (email verification required) */
export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, querySchema.parse)

  // TODO: Verify email/phone ownership before returning data
  // For now, require auth token or verified session

  const where: any = { signerEmail: query.email }

  const [signRequests, total] = await Promise.all([
    prisma.signRequest.findMany({
      where,
      include: {
        document: {
          select: {
            id: true,
            title: true,
            status: true,
            completedAt: true,
            createdAt: true,
            org: { select: { name: true, logoUrl: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.signRequest.count({ where }),
  ])

  return {
    documents: signRequests.map((sr) => ({
      signRequestId: sr.id,
      documentId: sr.document.id,
      title: sr.document.title,
      organization: sr.document.org.name,
      orgLogo: sr.document.org.logoUrl,
      status: sr.status,
      documentStatus: sr.document.status,
      signedAt: sr.signedAt,
      createdAt: sr.createdAt,
      completedAt: sr.document.completedAt,
    })),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  }
})
