import type { H3Event } from 'h3'
import { prisma } from './db'

export type OrgRole = 'owner' | 'admin' | 'member' | 'viewer'

const ROLE_HIERARCHY: Record<OrgRole, number> = {
  owner: 4,
  admin: 3,
  member: 2,
  viewer: 1,
}

/** Check if a role has at least the required level */
export function hasRole(userRole: OrgRole, requiredRole: OrgRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

/** Get user's membership in an organization */
export async function getOrgMember(userId: string, orgId: string) {
  return prisma.orgMember.findUnique({
    where: { orgId_userId: { orgId, userId } },
  })
}

/** Require organization membership with minimum role */
export async function requireOrgRole(
  event: H3Event,
  orgId: string,
  minRole: OrgRole = 'viewer',
) {
  const auth = requireAuth(event)

  const member = await getOrgMember(auth.userId, orgId)
  if (!member || !member.joinedAt) {
    throw createError({ statusCode: 403, statusMessage: 'Not a member of this organization' })
  }

  if (!hasRole(member.role as OrgRole, minRole)) {
    throw createError({ statusCode: 403, statusMessage: `Requires ${minRole} role or higher` })
  }

  return { auth, member }
}
