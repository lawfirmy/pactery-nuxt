import { describe, it, expect } from 'vitest'
import { generateKeyPair, rsaSign, rsaVerify } from '../server/utils/crypto'

describe('generateKeyPair', () => {
  it('returns PEM-formatted keys and certificate', () => {
    const { privateKeyPem, publicKeyPem, certificatePem } = generateKeyPair()
    expect(privateKeyPem).toContain('-----BEGIN RSA PRIVATE KEY-----')
    expect(publicKeyPem).toContain('-----BEGIN PUBLIC KEY-----')
    expect(certificatePem).toContain('-----BEGIN CERTIFICATE-----')
  })
})

describe('rsaSign / rsaVerify', () => {
  const { privateKeyPem, publicKeyPem } = generateKeyPair()

  it('signs and verifies string data', () => {
    const data = 'document content hash'
    const signature = rsaSign(data, privateKeyPem)
    expect(typeof signature).toBe('string')
    expect(rsaVerify(data, signature, publicKeyPem)).toBe(true)
  })

  it('signs and verifies Buffer data', () => {
    const data = Buffer.from('binary document content')
    const signature = rsaSign(data, privateKeyPem)
    expect(rsaVerify(data, signature, publicKeyPem)).toBe(true)
  })

  it('fails verification with tampered data', () => {
    const signature = rsaSign('original', privateKeyPem)
    expect(rsaVerify('tampered', signature, publicKeyPem)).toBe(false)
  })

  it('fails verification with wrong key', () => {
    const otherKeys = generateKeyPair()
    const signature = rsaSign('data', privateKeyPem)
    expect(() => rsaVerify('data', signature, otherKeys.publicKeyPem)).toThrow()
  })
})
