import { describe, it, expect } from 'vitest'
import { formatEventType, getActorName } from '../server/utils/notifications'

describe('formatEventType', () => {
  it('maps known event types to Korean labels', () => {
    expect(formatEventType('created')).toBe('문서 생성')
    expect(formatEventType('sent')).toBe('서명 요청 발송')
    expect(formatEventType('opened')).toBe('문서 열람')
    expect(formatEventType('signed')).toBe('서명 완료')
    expect(formatEventType('rejected')).toBe('서명 거절')
    expect(formatEventType('downloaded')).toBe('문서 다운로드')
    expect(formatEventType('printed')).toBe('문서 인쇄')
  })

  it('returns raw type for unknown event types', () => {
    expect(formatEventType('unknown_type')).toBe('unknown_type')
    expect(formatEventType('')).toBe('')
  })
})

describe('getActorName', () => {
  it('returns signerName from metadata', () => {
    const log = { metadata: { signerName: '홍길동' }, actorId: 'user-1' }
    expect(getActorName(log)).toBe('홍길동')
  })

  it('falls back to signerEmail from metadata', () => {
    const log = { metadata: { signerEmail: 'test@example.com' }, actorId: 'user-1' }
    expect(getActorName(log)).toBe('test@example.com')
  })

  it('falls back to actorId when no metadata names', () => {
    const log = { metadata: { someOther: 'data' }, actorId: 'user-1' }
    expect(getActorName(log)).toBe('user-1')
  })

  it('returns actorId when metadata is null', () => {
    const log = { metadata: null, actorId: 'user-1' }
    expect(getActorName(log)).toBe('user-1')
  })

  it('returns System when no actorId and no metadata', () => {
    const log = { metadata: null, actorId: null }
    expect(getActorName(log)).toBe('System')
  })
})
