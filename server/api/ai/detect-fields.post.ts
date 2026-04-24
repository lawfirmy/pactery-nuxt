import { z } from 'zod'

const detectSchema = z.object({
  documentId: z.string(),
  pageTexts: z.array(z.object({
    page: z.number(),
    text: z.string(),
    width: z.number(),
    height: z.number(),
  })),
})

interface DetectedField {
  type: 'signature' | 'date' | 'text' | 'initial'
  page: number
  x: number
  y: number
  width: number
  height: number
  label: string
  confidence: number
}

/** AI-powered field detection using Claude Haiku */
export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const body = await readValidatedBody(event, detectSchema.parse)
  const config = useRuntimeConfig()

  if (!config.claudeApiKey) {
    throw createError({ statusCode: 503, statusMessage: 'AI service not configured' })
  }

  // Combine page texts for analysis
  const pagesDescription = body.pageTexts.map((p) =>
    `--- Page ${p.page + 1} (${p.width}x${p.height}pt) ---\n${p.text}`,
  ).join('\n\n')

  const prompt = `You are analyzing a Korean legal/business document to detect where signature and form fields should be placed.

Document content:
${pagesDescription}

Identify fields that need to be filled in or signed. For each field, provide:
- type: "signature" (서명/날인), "date" (날짜), "text" (이름/주소/기타 입력), "initial" (이니셜)
- page: 0-indexed page number
- x, y: approximate position in PDF points (origin top-left)
- width, height: field size in points
- label: what this field is for (Korean)
- confidence: 0.0-1.0

Common patterns in Korean legal documents:
- "서명" or "인" or "(인)" → signature field
- "20__년 __월 __일" → date field
- "성명:", "이름:", "주소:" → text field
- "갑" or "을" → signature for party A/B
- "위임인", "수임인" → delegator/delegate signature
- Blank lines with parentheses → fill-in fields

Respond ONLY with a JSON array of detected fields. No explanation.`

  try {
    const response = await $fetch<any>('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': config.claudeApiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: {
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: prompt,
        }],
      },
    })

    const text = response.content?.[0]?.text || '[]'

    // Parse JSON from response (handle markdown code blocks)
    let jsonStr = text
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1]
    }

    const fields: DetectedField[] = JSON.parse(jsonStr.trim())

    // Validate and sanitize fields
    const validFields = fields
      .filter((f) => f.type && typeof f.page === 'number' && typeof f.x === 'number')
      .map((f) => ({
        type: f.type,
        page: f.page,
        x: Math.max(0, f.x),
        y: Math.max(0, f.y),
        width: Math.max(20, f.width || 150),
        height: Math.max(15, f.height || 50),
        label: f.label || '',
        confidence: Math.min(1, Math.max(0, f.confidence || 0.5)),
      }))

    return { fields: validFields }
  } catch (err: any) {
    console.error('AI field detection error:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'AI field detection failed',
    })
  }
})
