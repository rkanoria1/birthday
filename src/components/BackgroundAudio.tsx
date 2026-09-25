'use client'

import { useEffect, useRef, useState } from 'react'

const UNLOCK_EVENT = 'somya-story:unlock'

export function BackgroundAudio({ src, title = 'background music', showControl = true }: { src: string; title?: string; showControl?: boolean }) {
  const ref = useRef<HTMLAudioElement>(null)
  const fadeTimer = useRef<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [available, setAvailable] = useState(true)

  function stopFade() {
    if (fadeTimer.current !== null) {
      window.clearInterval(fadeTimer.current)
      fadeTimer.current = null
    }
  }

  async function startWithFade() {
    const audio = ref.current
    if (!audio) return
    stopFade()
    audio.volume = 0.08
    try {
      await audio.play()
      setPlaying(true)
      sessionStorage.setItem('somya-story-audio', 'playing')
      fadeTimer.current = window.setInterval(() => {
        const nextVolume = Math.min(0.72, audio.volume + 0.08)
        audio.volume = nextVolume
        if (nextVolume >= 0.72) stopFade()
      }, 120)
    } catch {
      setPlaying(false)
    }
  }

  useEffect(() => {
    const begin = () => void startWithFade()
    window.addEventListener(UNLOCK_EVENT, begin)
    return () => {
      window.removeEventListener(UNLOCK_EVENT, begin)
      stopFade()
    }
  })

  if (!available) return null

  async function toggle() {
    const audio = ref.current
    if (!audio) return
    if (playing) {
      stopFade()
      audio.pause()
      setPlaying(false)
      sessionStorage.setItem('somya-story-audio', 'paused')
      return
    }
    await startWithFade()
  }

  return (
    <>
      <audio ref={ref} src={src} loop onError={() => setAvailable(false)} />
      {showControl && (
        <div className="fixed right-4 top-20 z-50 sm:top-4">
          <button
            className="grid h-12 w-12 place-items-center rounded-full border border-white/75 bg-white/70 text-lg text-[#591c2d] shadow-[0_12px_35px_rgba(89,28,45,.14)] backdrop-blur-xl transition-transform hover:scale-105"
            onClick={toggle}
            aria-label={`${playing ? 'Pause' : 'Play'} ${title}`}
          >
            <span aria-hidden="true">{playing ? 'Ⅱ' : '♪'}</span>
          </button>
        </div>
      )}
    </>
  )
}
