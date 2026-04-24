import { prisma } from '~/server/utils/db'

/** Get sign request detail for signer portal */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!

  const signRequest = await prisma.signRequest.findUnique({
    where: { id },
    include: {
      document: {
        select: {
          id: true,
          title: true,
          status: true,
          completedAt: true,
          createdAt: true,
          originalFileKey: true,
          signedFileKey: true,
          org: { select: { name: true, logoUrl: true } },
        },
      },
    },
  })

  if (!signRequest) {
    throw createError({ statusCode: 404, statusMessage: 'Sign request not found' })
  }

  return signRequest
})
