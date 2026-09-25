import { describe, it, expect } from 'vitest'
import { isPasscodeCorrect } from '@/lib/passcode'

describe('isPasscodeCorrect', () => {
  it('returns true for a matching code', () => {
    expect(isPasscodeCorrect('0610', '0610')).toBe(true)
  })

  it('returns false for a non-matching code of the same length', () => {
    expect(isPasscodeCorrect('1234', '0610')).toBe(false)
  })

  it('returns false for a shorter input', () => {
    expect(isPasscodeCorrect('061', '0610')).toBe(false)
  })

  it('returns false for a longer input', () => {
    expect(isPasscodeCorrect('06100', '0610')).toBe(false)
  })
})
