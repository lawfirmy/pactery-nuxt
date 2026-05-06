import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { v4 as uuidv4 } from 'uuid'
import { promises as fs } from 'node:fs'
import path from 'node:path'

const UPLOADS_DIR = path.join(process.cwd(), '.uploads')

function useLocalStorage(): boolean {
  const config = useRuntimeConfig()
  return !config.s3Bucket
}

// ─── Local Storage ──────────────────────────────────

async function localUpload(buffer: Buffer, _contentType: string, folder: string): Promise<string> {
  const key = `${folder}/${uuidv4()}.pdf`
  const filePath = path.join(UPLOADS_DIR, key)
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, buffer)
  return key
}

async function localGetFile(key: string): Promise<Buffer> {
  const filePath = path.join(UPLOADS_DIR, key)
  try {
    return await fs.readFile(filePath)
  } catch (err: any) {
    console.error(`[storage] File not found: ${filePath}`, err.message)
    throw createError({ statusCode: 404, statusMessage: `File not found: ${key}` })
  }
}

async function localDelete(key: string): Promise<void> {
  const filePath = path.join(UPLOADS_DIR, key)
  await fs.unlink(filePath).catch(() => {})
}

// ─── S3 Storage ─────────────────────────────────────

let s3Client: S3Client | null = null

function getS3Client(): S3Client {
  if (!s3Client) {
    const config = useRuntimeConfig()
    s3Client = new S3Client({
      region: config.s3Region,
      credentials: {
        accessKeyId: config.s3AccessKey,
        secretAccessKey: config.s3SecretKey,
      },
    })
  }
  return s3Client
}

// ─── Public API ─────────────────────────────────────

export async function uploadFile(
  buffer: Buffer,
  contentType: string,
  folder: string = 'documents',
): Promise<string> {
  if (useLocalStorage()) return localUpload(buffer, contentType, folder)

  const config = useRuntimeConfig()
  const key = `${folder}/${uuidv4()}`

  await getS3Client().send(new PutObjectCommand({
    Bucket: config.s3Bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ServerSideEncryption: 'AES256',
  }))

  return key
}

export async function getFile(key: string): Promise<Buffer> {
  const isLocal = useLocalStorage()
  console.log(`[storage] getFile key=${key}, useLocal=${isLocal}, s3Bucket=${useRuntimeConfig().s3Bucket || '(empty)'}`)
  if (isLocal) return localGetFile(key)

  const config = useRuntimeConfig()
  const response = await getS3Client().send(new GetObjectCommand({
    Bucket: config.s3Bucket,
    Key: key,
  }))

  const stream = response.Body as ReadableStream
  const chunks: Uint8Array[] = []
  const reader = stream.getReader()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
  }
  return Buffer.concat(chunks)
}

export async function getPresignedUrl(key: string, expiresIn = 3600): Promise<string> {
  if (useLocalStorage()) return `/api/files/${key}`

  const config = useRuntimeConfig()
  return getSignedUrl(
    getS3Client(),
    new GetObjectCommand({ Bucket: config.s3Bucket, Key: key }),
    { expiresIn },
  )
}

export async function deleteFile(key: string): Promise<void> {
  if (useLocalStorage()) return localDelete(key)

  const config = useRuntimeConfig()
  await getS3Client().send(new DeleteObjectCommand({
    Bucket: config.s3Bucket,
    Key: key,
  }))
}
