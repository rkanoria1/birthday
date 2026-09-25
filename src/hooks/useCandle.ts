import { useState } from 'react'

export function useCandle() {
  const [blownOut, setBlownOut] = useState(false)

  function blow() {
    setBlownOut(true)
  }

  function relight() {
    setBlownOut(false)
  }

  return { blownOut, blow, relight }
}
