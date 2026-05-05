import crypto from 'crypto'

interface SendSmsOptions {
  to: string
  content: string
}

/** Send SMS via NCloud SENS API */
export async function sendSms({ to, content }: SendSmsOptions) {
  const config = useRuntimeConfig()
  const { ncloudAccessKey, ncloudSecretKey, ncloudSmsServiceId, ncloudSmsFrom } = config

  if (!ncloudAccessKey || !ncloudSecretKey || !ncloudSmsServiceId || !ncloudSmsFrom) {
    throw new Error('NCloud SMS configuration is missing')
  }

  const timestamp = Date.now().toString()
  const url = `/sms/v2/services/${ncloudSmsServiceId}/messages`
  const method = 'POST'

  // Generate signature
  const message = `${method} ${url}\n${timestamp}\n${ncloudAccessKey}`
  const signature = crypto
    .createHmac('sha256', ncloudSecretKey)
    .update(message)
    .digest('base64')

  const body = {
    type: 'SMS',
    from: ncloudSmsFrom,
    content,
    messages: [{ to: to.replace(/[^0-9]/g, '') }],
  }

  const response = await $fetch(`https://sens.apigw.ntruss.com${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'x-ncp-apigw-timestamp': timestamp,
      'x-ncp-iam-access-key': ncloudAccessKey,
      'x-ncp-apigw-signature-v2': signature,
    },
    body,
  })

  return response
}
