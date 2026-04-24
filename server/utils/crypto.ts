import { createHash, createCipheriv, createDecipheriv, randomBytes } from 'crypto'
import forge from 'node-forge'

/** SHA-256 hash of a buffer or string */
export function sha256(data: Buffer | string): string {
  return createHash('sha256').update(data).digest('hex')
}

/** AES-256-GCM encrypt */
export function encryptAES(data: Buffer, key: Buffer): { encrypted: Buffer; iv: Buffer; tag: Buffer } {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()])
  const tag = cipher.getAuthTag()
  return { encrypted, iv, tag }
}

/** AES-256-GCM decrypt */
export function decryptAES(encrypted: Buffer, key: Buffer, iv: Buffer, tag: Buffer): Buffer {
  const decipher = createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(encrypted), decipher.final()])
}

/** Generate a self-signed certificate + key pair for PKI digital signatures */
export function generateKeyPair() {
  const keys = forge.pki.rsa.generateKeyPair(2048)
  const cert = forge.pki.createCertificate()

  cert.publicKey = keys.publicKey
  cert.serialNumber = '01'
  cert.validity.notBefore = new Date()
  cert.validity.notAfter = new Date()
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 10)

  const attrs = [
    { name: 'commonName', value: 'Pactery E-Sign' },
    { name: 'organizationName', value: 'Pactery' },
    { name: 'countryName', value: 'KR' },
  ]
  cert.setSubject(attrs)
  cert.setIssuer(attrs)
  cert.sign(keys.privateKey, forge.md.sha256.create())

  return {
    privateKeyPem: forge.pki.privateKeyToPem(keys.privateKey),
    publicKeyPem: forge.pki.publicKeyToPem(keys.publicKey),
    certificatePem: forge.pki.certificateToPem(cert),
  }
}

/** Sign data with RSA private key (SHA-256) */
export function rsaSign(data: string | Buffer, privateKeyPem: string): string {
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem)
  const md = forge.md.sha256.create()
  md.update(typeof data === 'string' ? data : data.toString('binary'), 'raw')
  const signature = privateKey.sign(md)
  return forge.util.encode64(signature)
}

/** Verify RSA signature */
export function rsaVerify(data: string | Buffer, signature: string, publicKeyPem: string): boolean {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem)
  const md = forge.md.sha256.create()
  md.update(typeof data === 'string' ? data : data.toString('binary'), 'raw')
  return publicKey.verify(md.digest().bytes(), forge.util.decode64(signature))
}
