import { z } from 'zod'
import { prisma } from '~~/server/utils/db'

const updateMemberSchema = z.object({
  role: z.enum(['admin', 'member', 'viewer']),
})

/** Update a member's role (admin+) */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const memberId = getRouterParam(event, 'memberId')!
  const { auth } = await requireOrgRole(event, orgId, 'admin')

  const body = await readValidatedBody(event, updateMemberSchema.parse)

  const member = await prisma.orgMember.findUnique({ where: { id: memberId } })
  if (!member || member.orgId !== orgId) {
    throw createError({ statusCode: 404, statusMessage: 'Member not found' })
  }

  // Cannot change owner role
  if (member.role === 'owner') {
    throw createError({ statusCode: 403, statusMessage: 'Cannot change owner role' })
  }

  // Cannot promote to owner
  if (body.role === 'owner' as any) {
    throw createError({ statusCode: 403, statusMessage: 'Cannot promote to owner' })
  }

  const updated = await prisma.orgMember.update({
    where: { id: memberId },
    data: { role: body.role },
  })

  return { id: updated.id, role: updated.role }
})
