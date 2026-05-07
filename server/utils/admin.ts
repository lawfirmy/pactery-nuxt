import type { H3Event } from 'h3'

const ADMIN_EMAILS = ['sangemi@daum.net', 'ksaksk2112@gmail.com']

/** Check if an email has admin privileges */
export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

/** Require admin access - throws 403 if not an admin */
export function requireAdmin(event: H3Event) {
  const auth = requireAuth(event)
  if (!isAdminEmail(auth.email)) {
    throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
  }
  return auth
}
