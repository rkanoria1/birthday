import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCandle } from '@/hooks/useCandle'

describe('useCandle', () => {
  it('starts lit', () => {
    const { result } = renderHook(() => useCandle())
    expect(result.current.blownOut).toBe(false)
  })

  it('blows out the candle', () => {
    const { result } = renderHook(() => useCandle())
    act(() => result.current.blow())
    expect(result.current.blownOut).toBe(true)
  })

  it('relights the candle', () => {
    const { result } = renderHook(() => useCandle())
    act(() => result.current.blow())
    act(() => result.current.relight())
    expect(result.current.blownOut).toBe(false)
  })
})
