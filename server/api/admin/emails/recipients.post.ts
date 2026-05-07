import { z } from 'zod'
import { prisma } from '~~/server/utils/db'

const schema = z.object({
  emails: z.array(z.object({
    email: z.string().email(),
    name: z.string().optional(),
  })).min(1).max(1000),
  source: z.string().default('manual'),
})

/** Add email recipients (bulk import) */
export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readValidatedBody(event, schema.parse)

  let added = 0
  let skipped = 0

  for (const item of body.emails) {
    try {
      await prisma.emailRecipient.create({
        data: {
          email: item.email.toLowerCase().trim(),
          name: item.name || null,
          source: body.source,
        },
      })
      added++
    } catch {
      // Duplicate email - skip
      skipped++
    }
  }

  return { added, skipped, total: body.emails.length }
})
