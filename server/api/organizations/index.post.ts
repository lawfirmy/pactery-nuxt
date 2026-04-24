import { z } from 'zod'
import { prisma } from '~/server/utils/db'

const createOrgSchema = z.object({
  name: z.string().min(1).max(100),
  businessNumber: z.string().optional(),
  representative: z.string().optional(),
})

/** Create a new organization */
export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const body = await readValidatedBody(event, createOrgSchema.parse)

  const org = await prisma.organization.create({
    data: {
      name: body.name,
      businessNumber: body.businessNumber,
      representative: body.representative,
      members: {
        create: {
          userId: auth.userId,
          role: 'owner',
          joinedAt: new Date(),
        },
      },
    },
  })

  return {
    id: org.id,
    name: org.name,
    businessNumber: org.businessNumber,
    plan: org.plan,
  }
})
