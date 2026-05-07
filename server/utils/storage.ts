import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { v4 as uuidv4 } from 'uuid'

let s3Client: S3Client | null = null

function getS3Client(): S3Client {
  if (!s3Client) {
    const config = useRuntimeConfig()
    if (!config.s3Bucket) {
      throw createError({ statusCode: 500, statusMessage: 'S3_BUCKET is not configured' })
    }
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

function getBucket(): string {
  const config = useRuntimeConfig()
  if (!config.s3Bucket) {
    throw createError({ statusCode: 500, statusMessage: 'S3_BUCKET is not configured' })
  }
  return config.s3Bucket
}

export async function uploadFile(
  buffer: Buffer,
  contentType: string,
  folder: string = 'documents',
): Promise<string> {
  const key = `${folder}/${uuidv4()}`

  await getS3Client().send(new PutObjectCommand({
    Bucket: getBucket(),
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ServerSideEncryption: 'AES256',
  }))

  return key
}

export async function getFile(key: string): Promise<Buffer> {
  try {
    const response = await getS3Client().send(new GetObjectCommand({
      Bucket: getBucket(),
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
  } catch (err: any) {
    if (err.name === 'NoSuchKey' || err.Code === 'NoSuchKey') {
      throw createError({ statusCode: 404, statusMessage: `File not found: ${key}` })
    }
    if (err.name === 'NoSuchBucket' || err.Code === 'NoSuchBucket') {
      throw createError({ statusCode: 404, statusMessage: 'Storage bucket not found' })
    }
    throw err
  }
}

export async function getPresignedUrl(key: string, expiresIn = 3600): Promise<string> {
  return getSignedUrl(
    getS3Client(),
    new GetObjectCommand({ Bucket: getBucket(), Key: key }),
    { expiresIn },
  )
}

export async function deleteFile(key: string): Promise<void> {
  await getS3Client().send(new DeleteObjectCommand({
    Bucket: getBucket(),
    Key: key,
  }))
}
