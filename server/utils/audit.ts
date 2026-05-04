import type { H3Event } from 'h3'
import { prisma } from './db'

type EventType = 'created' | 'sent' | 'opened' | 'signed' | 'rejected' | 'downloaded' | 'printed' | 'expired' | 'reminder_sent' | 'signer_added' | 'signer_removed'
type ActorType = 'system' | 'user' | 'signer'

interface AuditParams {
  documentId: string
  signRequestId?: string
  eventType: EventType
  actorType: ActorType
  actorId?: string
  metadata?: Record<string, unknown>
}

/** Create an immutable audit log entry */
export async function createAuditLog(event: H3Event, params: AuditParams) {
  const ipAddress = getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || ''
  const userAgent = getHeader(event, 'user-agent') || ''

  return prisma.auditLog.create({
    data: {
      documentId: params.documentId,
      signRequestId: params.signRequestId,
      eventType: params.eventType,
      actorType: params.actorType,
      actorId: params.actorId,
      ipAddress,
      userAgent,
      metadata: params.metadata as any,
    },
  })
}
