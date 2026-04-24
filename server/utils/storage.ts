import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { v4 as uuidv4 } from 'uuid'

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

/** Upload a file to S3 */
export async function uploadFile(
  buffer: Buffer,
  contentType: string,
  folder: string = 'documents',
): Promise<string> {
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

/** Get a file from S3 */
export async function getFile(key: string): Promise<Buffer> {
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

/** Generate a presigned URL for download */
export async function getPresignedUrl(key: string, expiresIn = 3600): Promise<string> {
  const config = useRuntimeConfig()
  return getSignedUrl(
    getS3Client(),
    new GetObjectCommand({ Bucket: config.s3Bucket, Key: key }),
    { expiresIn },
  )
}

/** Delete a file from S3 */
export async function deleteFile(key: string): Promise<void> {
  const config = useRuntimeConfig()
  await getS3Client().send(new DeleteObjectCommand({
    Bucket: config.s3Bucket,
    Key: key,
  }))
}
