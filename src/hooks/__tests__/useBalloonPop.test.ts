import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBalloonPop } from '@/hooks/useBalloonPop'

describe('useBalloonPop', () => {
  it('starts with all balloons unpopped', () => {
    const { result } = renderHook(() => useBalloonPop(4))
    expect(result.current.popped).toEqual([false, false, false, false])
    expect(result.current.allPopped).toBe(false)
  })

  it('pops a single balloon by index', () => {
    const { result } = renderHook(() => useBalloonPop(4))
    act(() => result.current.pop(1))
    expect(result.current.popped).toEqual([false, true, false, false])
  })

  it('reports allPopped once every balloon is popped', () => {
    const { result } = renderHook(() => useBalloonPop(2))
    act(() => result.current.pop(0))
    act(() => result.current.pop(1))
    expect(result.current.allPopped).toBe(true)
  })

  it('popping the same balloon twice has no extra effect', () => {
    const { result } = renderHook(() => useBalloonPop(2))
    act(() => result.current.pop(0))
    act(() => result.current.pop(0))
    expect(result.current.popped).toEqual([true, false])
  })
})
