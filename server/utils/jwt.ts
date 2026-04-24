import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'

export interface JwtPayload {
  userId: string
  email: string
}

/** Sign a JWT token */
export function signToken(payload: JwtPayload): string {
  const config = useRuntimeConfig()
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as string,
  } as jwt.SignOptions)
}

/** Verify and decode a JWT token */
export function verifyToken(token: string): JwtPayload {
  const config = useRuntimeConfig()
  return jwt.verify(token, config.jwtSecret) as JwtPayload
}

/** Extract JWT payload from request (returns null if not authenticated) */
export function getAuthFromEvent(event: H3Event): JwtPayload | null {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  try {
    return verifyToken(authHeader.slice(7))
  } catch {
    return null
  }
}

/** Require authentication - throws 401 if not authenticated */
export function requireAuth(event: H3Event): JwtPayload {
  const auth = getAuthFromEvent(event)
  if (!auth) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  return auth
}
