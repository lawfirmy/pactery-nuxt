import { prisma } from '~~/server/utils/db'

/** Get client detail with signature history */
export default defineEventHandler(async (event) => {
  const orgId = getRouterParam(event, 'orgId')!
  const clientId = getRouterParam(event, 'clientId')!
  await requireOrgRole(event, orgId, 'viewer')

  const client = await prisma.client.findFirst({
    where: { id: clientId, orgId },
    include: {
      cases: {
        include: {
          _count: { select: { documents: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!client) {
    throw createError({ statusCode: 404, statusMessage: 'Client not found' })
  }

  // Find documents where this client's email was a signer
  const signHistory = client.email
    ? await prisma.signRequest.findMany({
        where: {
          signerEmail: client.email,
          document: { orgId },
        },
        include: {
          document: { select: { id: true, title: true, status: true, createdAt: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      })
    : []

  return { ...client, signHistory }
})
