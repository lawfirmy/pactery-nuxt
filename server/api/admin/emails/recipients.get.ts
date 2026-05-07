import { z } from 'zod'
import { prisma } from '~~/server/utils/db'

/** List email recipients with pagination */
export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 50))
  const skip = (page - 1) * limit
  const search = String(query.q || '').trim()

  const where = {
    ...(search ? {
      OR: [
        { email: { contains: search, mode: 'insensitive' as const } },
        { name: { contains: search, mode: 'insensitive' as const } },
      ],
    } : {}),
    unsubscribedAt: null,
  }

  const [recipients, total] = await Promise.all([
    prisma.emailRecipient.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.emailRecipient.count({ where }),
  ])

  return { recipients, total, page, limit }
})
