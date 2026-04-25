import { promises as fs } from 'node:fs'
import path from 'node:path'

/** Serve locally stored files (dev only, S3 replaces in prod) */
export default defineEventHandler(async (event) => {
  const filePath = getRouterParam(event, 'path')
  if (!filePath) {
    throw createError({ statusCode: 400, statusMessage: 'Path required' })
  }

  // Prevent directory traversal
  const safePath = path.normalize(filePath).replace(/^(\.\.[/\\])+/, '')
  const fullPath = path.join(process.cwd(), '.uploads', safePath)

  if (!fullPath.startsWith(path.join(process.cwd(), '.uploads'))) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  try {
    const buffer = await fs.readFile(fullPath)
    setHeader(event, 'Content-Type', 'application/pdf')
    setHeader(event, 'Cache-Control', 'private, max-age=3600')
    return buffer
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'File not found' })
  }
})
