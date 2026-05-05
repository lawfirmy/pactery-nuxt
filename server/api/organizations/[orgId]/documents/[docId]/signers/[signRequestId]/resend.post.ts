import { z } from 'zod'
import { prisma } from '~~/server/utils/db'

const resendSchema = z.object({
  method: z.enum(['email', 'sms', 'kakao', 'phone']),
  email: z.string().email().optional(),
  phone: z.string().min(10).max(15).optional(),
})

/** Resend sign request via specified channel */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const docId = getRouterParam(event, 'docId')!
  const signRequestId = getRouterParam(event, 'signRequestId')!
  const { auth } = await requireOrgRole(event, orgId, 'member')

  const body = await readValidatedBody(event, resendSchema.parse)

  const document = await prisma.document.findFirst({
    where: { id: docId, orgId, status: { in: ['pending', 'partially_signed'] } },
  })
  if (!document) {
    throw createError({ statusCode: 404, statusMessage: 'Document not found or not in signable status' })
  }

  const signRequest = await prisma.signRequest.findFirst({
    where: { id: signRequestId, documentId: docId, status: 'pending' },
  })
  if (!signRequest) {
    throw createError({ statusCode: 404, statusMessage: 'Sign request not found or already completed' })
  }

  // Update contact info if provided
  if (body.email && body.email !== signRequest.signerEmail) {
    await prisma.signRequest.update({
      where: { id: signRequestId },
      data: { signerEmail: body.email },
    })
  }
  if (body.phone && body.phone !== signRequest.signerPhone) {
    await prisma.signRequest.update({
      where: { id: signRequestId },
      data: { signerPhone: body.phone },
    })
  }

  const config = useRuntimeConfig()
  const signUrl = `${config.public.appUrl}/sign/${signRequest.token}`

  if (body.method === 'email') {
    const targetEmail = body.email || signRequest.signerEmail
    if (!targetEmail) {
      throw createError({ statusCode: 400, statusMessage: '이메일 주소가 필요합니다' })
    }

    await createAuditLog(event, {
      documentId: docId,
      signRequestId,
      eventType: 'sent',
      actorType: 'user',
      actorId: auth.userId,
      metadata: { signerEmail: targetEmail, type: 'resend_email' },
    })

    sendIndividualSignRequest(signRequestId).catch((err) => {
      console.error(`Failed to resend email to ${targetEmail}:`, err)
    })
  } else if (body.method === 'sms') {
    const targetPhone = body.phone || signRequest.signerPhone
    if (!targetPhone) {
      throw createError({ statusCode: 400, statusMessage: '전화번호가 필요합니다' })
    }

    await createAuditLog(event, {
      documentId: docId,
      signRequestId,
      eventType: 'sent',
      actorType: 'user',
      actorId: auth.userId,
      metadata: { signerPhone: targetPhone, type: 'resend_sms' },
    })

    const orgName = (await prisma.organization.findUnique({ where: { id: orgId }, select: { name: true } }))?.name || 'Pactery'
    const smsContent = `[${orgName}] ${document.title} 서명을 요청합니다.\n${signUrl}`

    sendSms({ to: targetPhone, content: smsContent }).catch((err) => {
      console.error(`Failed to send SMS to ${targetPhone}:`, err)
    })
  } else if (body.method === 'kakao' || body.method === 'phone') {
    // Placeholder - not yet implemented
    await createAuditLog(event, {
      documentId: docId,
      signRequestId,
      eventType: 'sent',
      actorType: 'user',
      actorId: auth.userId,
      metadata: { type: `resend_${body.method}`, note: 'not_yet_implemented' },
    })
    throw createError({ statusCode: 501, statusMessage: `${body.method === 'kakao' ? '카카오톡' : '전화'} 발송은 준비 중입니다` })
  }

  return { success: true }
})
