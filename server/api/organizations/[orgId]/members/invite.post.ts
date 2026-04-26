import { z } from 'zod'
import { prisma } from '~~/server/utils/db'

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'member', 'viewer']).default('member'),
})

/** Invite a member to the organization (admin+) */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  await requireOrgRole(event, orgId, 'admin')

  const body = await readValidatedBody(event, inviteSchema.parse)

  // Find or note the user
  let user = await prisma.user.findUnique({ where: { email: body.email } })

  if (user) {
    // Check if already a member
    const existing = await prisma.orgMember.findUnique({
      where: { orgId_userId: { orgId, userId: user.id } },
    })
    if (existing) {
      throw createError({ statusCode: 409, statusMessage: 'User is already a member or invited' })
    }

    await prisma.orgMember.create({
      data: {
        orgId,
        userId: user.id,
        role: body.role,
        joinedAt: new Date(), // auto-join if user exists
      },
    })
  } else {
    // Create a placeholder user for the invite
    user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.email.split('@')[0],
      },
    })

    await prisma.orgMember.create({
      data: {
        orgId,
        userId: user.id,
        role: body.role,
        // joinedAt is null = pending invite
      },
    })
  }

  // TODO: Send invitation email via SES

  return { success: true, email: body.email, role: body.role }
})
