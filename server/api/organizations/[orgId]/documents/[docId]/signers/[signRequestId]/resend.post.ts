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

  console.log(`[RESEND] === 서명 재요청 시작 === orgId=${orgId}, docId=${docId}, signRequestId=${signRequestId}`)

  const { auth } = await requireOrgRole(event, orgId, 'member')

  const body = await readValidatedBody(event, resendSchema.parse)
  console.log(`[RESEND] method=${body.method}, email=${body.email || '(none)'}, phone=${body.phone || '(none)'}, userId=${auth.userId}`)

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

    console.log(`[RESEND] 이메일 발송 시작 → targetEmail=${targetEmail}, signRequestId=${signRequestId}`)
    try {
      const result = await sendIndividualSignRequest(signRequestId)
      console.log(`[RESEND] 이메일 발송 완료 → ${targetEmail}, messageId=${result?.messageId}`)
    } catch (err: any) {
      console.error(`[RESEND] 이메일 발송 실패 → ${targetEmail}:`, err)
      throw createError({ statusCode: 502, statusMessage: err?.message || '이메일 발송에 실패했습니다' })
    }
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

    console.log(`[RESEND] SMS 발송 시작 → targetPhone=${targetPhone}, signRequestId=${signRequestId}`)
    try {
      await sendSms({ to: targetPhone, content: smsContent })
      console.log(`[RESEND] SMS 발송 완료 → ${targetPhone}`)
    } catch (err: any) {
      console.error(`[RESEND] SMS 발송 실패 → ${targetPhone}:`, err)
      throw createError({ statusCode: 502, statusMessage: err?.message || 'SMS 발송에 실패했습니다' })
    }
  } else if (body.method === 'phone') {
    // Phone calls are handled client-side via tel: link
    // Server only saves the updated phone number (already done above)
    await createAuditLog(event, {
      documentId: docId,
      signRequestId,
      eventType: 'sent',
      actorType: 'user',
      actorId: auth.userId,
      metadata: { type: 'resend_phone', signerPhone: body.phone || signRequest.signerPhone },
    })
  } else if (body.method === 'kakao') {
    throw createError({ statusCode: 501, statusMessage: '카카오톡 발송은 준비 중입니다' })
  }

  console.log(`[RESEND] === 서명 재요청 응답 반환 (method=${body.method}) ===`)
  return { success: true }
})
