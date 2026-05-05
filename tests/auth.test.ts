import { describe, it, expect } from 'vitest'
import { hasRole, type OrgRole } from '../server/utils/rbac'

describe('hasRole', () => {
  it('owner has all roles', () => {
    expect(hasRole('owner', 'owner')).toBe(true)
    expect(hasRole('owner', 'admin')).toBe(true)
    expect(hasRole('owner', 'member')).toBe(true)
    expect(hasRole('owner', 'viewer')).toBe(true)
  })

  it('admin has admin, member, viewer but not owner', () => {
    expect(hasRole('admin', 'owner')).toBe(false)
    expect(hasRole('admin', 'admin')).toBe(true)
    expect(hasRole('admin', 'member')).toBe(true)
    expect(hasRole('admin', 'viewer')).toBe(true)
  })

  it('member has member, viewer but not admin or owner', () => {
    expect(hasRole('member', 'owner')).toBe(false)
    expect(hasRole('member', 'admin')).toBe(false)
    expect(hasRole('member', 'member')).toBe(true)
    expect(hasRole('member', 'viewer')).toBe(true)
  })

  it('viewer only has viewer role', () => {
    expect(hasRole('viewer', 'owner')).toBe(false)
    expect(hasRole('viewer', 'admin')).toBe(false)
    expect(hasRole('viewer', 'member')).toBe(false)
    expect(hasRole('viewer', 'viewer')).toBe(true)
  })
})
