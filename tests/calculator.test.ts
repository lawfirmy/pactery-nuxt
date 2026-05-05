import { describe, it, expect } from 'vitest'
import { sha256, encryptAES, decryptAES } from '../server/utils/crypto'

describe('sha256', () => {
  it('produces consistent hash for the same input', () => {
    const hash1 = sha256('hello')
    const hash2 = sha256('hello')
    expect(hash1).toBe(hash2)
  })

  it('produces different hashes for different inputs', () => {
    expect(sha256('hello')).not.toBe(sha256('world'))
  })

  it('returns a 64-character hex string', () => {
    const hash = sha256('test')
    expect(hash).toMatch(/^[0-9a-f]{64}$/)
  })

  it('handles Buffer input', () => {
    const hash = sha256(Buffer.from('hello'))
    expect(hash).toBe(sha256('hello'))
  })
})

describe('AES-256-GCM encrypt/decrypt', () => {
  const key = Buffer.alloc(32, 'test-key')

  it('round-trips data correctly', () => {
    const data = Buffer.from('secret message')
    const { encrypted, iv, tag } = encryptAES(data, key)
    const decrypted = decryptAES(encrypted, key, iv, tag)
    expect(decrypted.toString()).toBe('secret message')
  })

  it('produces different ciphertexts for same plaintext (random IV)', () => {
    const data = Buffer.from('same data')
    const result1 = encryptAES(data, key)
    const result2 = encryptAES(data, key)
    expect(result1.encrypted.equals(result2.encrypted)).toBe(false)
  })

  it('fails to decrypt with wrong key', () => {
    const data = Buffer.from('secret')
    const { encrypted, iv, tag } = encryptAES(data, key)
    const wrongKey = Buffer.alloc(32, 'wrong-key')
    expect(() => decryptAES(encrypted, wrongKey, iv, tag)).toThrow()
  })
})
