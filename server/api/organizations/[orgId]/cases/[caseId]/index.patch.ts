import { z } from 'zod'
import { prisma } from '~~/server/utils/db'

const updateCaseSchema = z.object({
  caseNumber: z.string().optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  clientId: z.string().nullable().optional(),
  status: z.enum(['active', 'closed', 'archived']).optional(),
}).strict()

export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const caseId = getRouterParam(event, 'caseId')!
  await requireOrgRole(event, orgId, 'member')

  const body = await readValidatedBody(event, updateCaseSchema.parse)

  const caseItem = await prisma.case.update({
    where: { id: caseId },
    data: body,
  })

  return caseItem
})
