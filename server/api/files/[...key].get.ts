import { getFile } from '~~/server/utils/storage'

/** Local-mode file serving endpoint (replaces S3 presigned URLs in dev) */
export default defineEventHandler(async (event) => {
  const key = decodeURIComponent(getRouterParam(event, 'key')!)

  const buffer = await getFile(key)

  const ext = key.split('.').pop()?.toLowerCase()
  const contentTypes: Record<string, string> = {
    pdf: 'application/pdf',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
  }

  setHeader(event, 'Content-Type', contentTypes[ext || ''] || 'application/octet-stream')
  setHeader(event, 'Cache-Control', 'private, max-age=300')
  return buffer
})
