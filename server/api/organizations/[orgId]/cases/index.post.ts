import { z } from 'zod'
import { prisma } from '~~/server/utils/db'

const createCaseSchema = z.object({
  caseNumber: z.string().optional(),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  clientId: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  await requireOrgRole(event, orgId, 'member')

  const body = await readValidatedBody(event, createCaseSchema.parse)

  const caseItem = await prisma.case.create({
    data: { orgId, ...body },
    include: { client: { select: { id: true, name: true } } },
  })

  return caseItem
})
