import { prisma } from '~~/server/utils/db'

/** Upload PDF for a template */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const templateId = getRouterParam(event, 'templateId')!
  await requireOrgRole(event, orgId, 'member')

  const formData = await readMultipartFormData(event)
  const file = formData?.find((f) => f.name === 'file')

  if (!file?.data || file.type !== 'application/pdf') {
    throw createError({ statusCode: 400, statusMessage: 'PDF file required' })
  }

  const fileKey = await uploadFile(file.data, 'application/pdf', `templates/${orgId}`)

  await prisma.template.update({
    where: { id: templateId },
    data: { fileKey },
  })

  return { fileKey }
})
