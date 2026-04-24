import { z } from 'zod'
import { prisma } from '~/server/utils/db'

const updateSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  phone: z.string().optional(),
  lawyerBarNumber: z.string().optional(),
}).strict()

export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const body = await readValidatedBody(event, updateSchema.parse)

  const user = await prisma.user.update({
    where: { id: auth.userId },
    data: body,
  })

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    lawyerBarNumber: user.lawyerBarNumber,
  }
})
