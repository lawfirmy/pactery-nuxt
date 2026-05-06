interface EmailParams {
  to: string
  subject: string
  html: string
  attachments?: Array<{
    filename: string
    content: Buffer
    contentType: string
  }>
}

/** Send email via Resend API (or fallback to console in dev) */
export async function sendEmail(params: EmailParams) {
  const config = useRuntimeConfig()

  console.log(`[EMAIL] Sending to: ${params.to} | Subject: ${params.subject} | From: ${config.resendFromEmail}`)

  if (!config.resendApiKey || process.env.NODE_ENV === 'development') {
    console.log(`[EMAIL] DEV MODE - not actually sending. API key present: ${!!config.resendApiKey}`)
    console.log(`[EMAIL] Body preview: ${params.html.substring(0, 200)}...`)
    return { messageId: 'dev-' + Date.now() }
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(config.resendApiKey)

    console.log(`[EMAIL] Calling Resend API...`)
    const result = await resend.emails.send({
      from: config.resendFromEmail,
      to: [params.to],
      subject: params.subject,
      html: params.html,
      attachments: params.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
        content_type: a.contentType,
      })),
    })

    if (result.error) {
      console.error(`[EMAIL] Resend API error:`, result.error)
      throw new Error(`Resend error: ${result.error.message}`)
    }

    console.log(`[EMAIL] Sent successfully. messageId: ${result.data?.id}`)
    return { messageId: result.data?.id }
  } catch (err) {
    console.error(`[EMAIL] Failed to send email to ${params.to}:`, err)
    throw err
  }
}

/** Generate sign request email HTML */
export function buildSignRequestEmail(params: {
  signerName: string
  documentTitle: string
  senderName: string
  orgName: string
  signUrl: string
  orgColor?: string
  orgLogoUrl?: string
}): string {
  const color = params.orgColor || '#2563eb'

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <div style="background:${color};padding:24px 32px;text-align:center;">
      ${params.orgLogoUrl ? `<img src="${params.orgLogoUrl}" alt="" style="height:40px;margin-bottom:8px;" />` : ''}
      <h1 style="color:#fff;margin:0;font-size:20px;">${params.orgName}</h1>
    </div>
    <div style="padding:32px;">
      <p style="font-size:16px;color:#333;margin-top:0;">
        안녕하세요, <strong>${params.signerName}</strong>님.
      </p>
      <p style="font-size:14px;color:#666;line-height:1.6;">
        <strong>${params.senderName}</strong>님이 전자서명을 요청했습니다.
      </p>
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:24px 0;">
        <p style="margin:0;font-size:14px;color:#6b7280;">문서명</p>
        <p style="margin:4px 0 0;font-size:16px;font-weight:600;color:#111827;">${params.documentTitle}</p>
      </div>
      <div style="text-align:center;margin:32px 0;">
        <a href="${params.signUrl}" style="display:inline-block;padding:14px 40px;background:${color};color:#fff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:500;">
          문서 확인 및 서명
        </a>
      </div>
      <p style="font-size:12px;color:#9ca3af;text-align:center;margin-top:32px;">
        이 링크는 본인만 사용할 수 있으며, 서명 완료 후 만료됩니다.
      </p>
    </div>
    <div style="border-top:1px solid #f3f4f6;padding:16px 32px;text-align:center;">
      <p style="margin:0;font-size:11px;color:#9ca3af;">
        Pactery 전자서명 서비스 | pactery.com
      </p>
    </div>
  </div>
</body>
</html>`
}

/** Generate reminder email HTML for pending signers */
export function buildReminderEmail(params: {
  signerName: string
  documentTitle: string
  signUrl: string
  orgName: string
  orgColor?: string
}): string {
  const color = params.orgColor || '#2563eb'

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <div style="background:${color};padding:24px 32px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:20px;">${params.orgName}</h1>
    </div>
    <div style="padding:32px;">
      <p style="font-size:16px;color:#333;margin-top:0;">
        안녕하세요, <strong>${params.signerName}</strong>님.
      </p>
      <p style="font-size:14px;color:#666;line-height:1.6;">
        아직 서명이 완료되지 않은 문서가 있습니다. 확인 후 서명을 완료해주세요.
      </p>
      <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:16px;margin:24px 0;">
        <p style="margin:0;font-size:14px;color:#92400e;">리마인더</p>
        <p style="margin:4px 0 0;font-size:16px;font-weight:600;color:#111827;">${params.documentTitle}</p>
      </div>
      <div style="text-align:center;margin:32px 0;">
        <a href="${params.signUrl}" style="display:inline-block;padding:14px 40px;background:${color};color:#fff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:500;">
          서명하러 가기
        </a>
      </div>
      <p style="font-size:12px;color:#9ca3af;text-align:center;margin-top:32px;">
        이 링크는 본인만 사용할 수 있으며, 서명 완료 후 만료됩니다.
      </p>
    </div>
    <div style="border-top:1px solid #f3f4f6;padding:16px 32px;text-align:center;">
      <p style="margin:0;font-size:11px;color:#9ca3af;">
        Pactery 전자서명 서비스 | pactery.com
      </p>
    </div>
  </div>
</body>
</html>`
}

/** Generate CC notification email HTML (document completed, CC recipient) */
export function buildCcNotificationEmail(params: {
  recipientName: string
  documentTitle: string
  orgName: string
  downloadUrl: string
}): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <div style="background:#6366f1;padding:24px 32px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:20px;">서명 완료 알림 (참조)</h1>
    </div>
    <div style="padding:32px;">
      <p style="font-size:16px;color:#333;margin-top:0;">
        안녕하세요, <strong>${params.recipientName}</strong>님.
      </p>
      <p style="font-size:14px;color:#666;line-height:1.6;">
        참조로 포함된 아래 문서의 모든 서명이 완료되었습니다.
      </p>
      <div style="background:#eef2ff;border:1px solid #c7d2fe;border-radius:8px;padding:16px;margin:24px 0;">
        <p style="margin:0;font-size:14px;color:#6b7280;">문서명</p>
        <p style="margin:4px 0 0;font-size:16px;font-weight:600;color:#111827;">${params.documentTitle}</p>
        <p style="margin:8px 0 0;font-size:12px;color:#6366f1;">참조(CC)로 수신된 알림입니다</p>
      </div>
      <div style="text-align:center;margin:32px 0;">
        <a href="${params.downloadUrl}" style="display:inline-block;padding:14px 40px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:500;">
          문서 다운로드
        </a>
      </div>
      <p style="font-size:12px;color:#9ca3af;text-align:center;">
        서명된 PDF와 감사추적인증서가 포함되어 있습니다.
      </p>
    </div>
    <div style="border-top:1px solid #f3f4f6;padding:16px 32px;text-align:center;">
      <p style="margin:0;font-size:11px;color:#9ca3af;">Pactery 전자서명 서비스 | pactery.com</p>
    </div>
  </div>
</body>
</html>`
}

/** Generate completed document notification email HTML */
export function buildCompletedEmail(params: {
  recipientName: string
  documentTitle: string
  orgName: string
  downloadUrl: string
}): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <div style="background:#059669;padding:24px 32px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:20px;">서명 완료</h1>
    </div>
    <div style="padding:32px;">
      <p style="font-size:16px;color:#333;margin-top:0;">
        안녕하세요, <strong>${params.recipientName}</strong>님.
      </p>
      <p style="font-size:14px;color:#666;line-height:1.6;">
        아래 문서의 모든 서명이 완료되었습니다.
      </p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:24px 0;">
        <p style="margin:0;font-size:14px;color:#6b7280;">문서명</p>
        <p style="margin:4px 0 0;font-size:16px;font-weight:600;color:#111827;">${params.documentTitle}</p>
        <p style="margin:8px 0 0;font-size:12px;color:#059669;">&#x2705; 모든 서명 완료</p>
      </div>
      <div style="text-align:center;margin:32px 0;">
        <a href="${params.downloadUrl}" style="display:inline-block;padding:14px 40px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:500;">
          문서 다운로드
        </a>
      </div>
      <p style="font-size:12px;color:#9ca3af;text-align:center;">
        서명된 PDF와 감사추적인증서가 포함되어 있습니다.
      </p>
    </div>
    <div style="border-top:1px solid #f3f4f6;padding:16px 32px;text-align:center;">
      <p style="margin:0;font-size:11px;color:#9ca3af;">Pactery 전자서명 서비스 | pactery.com</p>
    </div>
  </div>
</body>
</html>`
}
