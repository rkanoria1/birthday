import { useState } from 'react'

export function useBalloonPop(total: number) {
  const [popped, setPopped] = useState<boolean[]>(() => Array(total).fill(false))

  function pop(index: number) {
    setPopped((prev) => {
      if (prev[index]) return prev
      const next = [...prev]
      next[index] = true
      return next
    })
  }

  const allPopped = popped.every(Boolean)

  return { popped, pop, allPopped }
}
