'use client'

import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { StoryImage } from '@/components/StoryImage'
import type { SiteContent } from '@/content/types'

export function PhotoMosaicChapter({ content }: { content: SiteContent['mosaic'] }) {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)
  const [showSwipeHint, setShowSwipeHint] = useState(true)
  const touchStart = useRef<number | null>(null)
  const reduced = useReducedMotion()
  const current = content.images[active]
  const next = content.images[(active + 1) % content.images.length]
  const move = (step: number) => {
    setDirection(step)
    setActive((index) => (index + step + content.images.length) % content.images.length)
    setShowSwipeHint(false)
  }
  const finishSwipe = (clientX: number) => {
    if (touchStart.current === null) return
    const distance = clientX - touchStart.current
    touchStart.current = null
    if (Math.abs(distance) >= 48) move(distance < 0 ? 1 : -1)
  }

  return (
    <section className="chapter-frame flex flex-col justify-center">
      <link rel="preload" href={next.src} as="image" />
      <div className="mb-6 grid items-end gap-3 md:grid-cols-[1fr_auto] md:gap-8">
        <h1 className="font-display display-balance text-5xl font-semibold leading-[.88] tracking-[-.04em] text-[#591c2d] sm:text-7xl">
          {content.title}
        </h1>
        <p className="max-w-md text-sm leading-6 text-[#591c2d]/70 md:text-right">{content.caption}</p>
      </div>

      <motion.div
        data-testid="lookbook-stage"
        animate={{ backgroundColor: current.palette.wash }}
        transition={reduced ? { duration: 0 } : { duration: 0.65, ease: 'easeOut' }}
        className="lookbook-stage relative grid min-h-[36rem] overflow-hidden rounded-[2rem] border border-white/80 shadow-[0_32px_90px_rgba(58,24,39,.18)] md:grid-cols-[minmax(0,1.55fr)_minmax(18rem,.75fr)]"
        style={{ backgroundColor: current.palette.wash }}
      >
        <div
          data-testid="lookbook-swipe-area"
          onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null }}
          onTouchEnd={(event) => finishSwipe(event.changedTouches[0]?.clientX ?? 0)}
          className="relative min-h-[31rem] touch-pan-y overflow-hidden md:min-h-[42rem] [perspective:1200px]"
        >
          <motion.div
            key={current.src}
            initial={reduced ? false : { opacity: 0, scale: 1.035, rotateY: direction * 7, clipPath: direction > 0 ? 'polygon(12% 0, 100% 0, 88% 100%, 0 100%)' : 'polygon(0 0, 88% 0, 100% 100%, 12% 100%)' }}
            animate={{ opacity: 1, scale: 1, rotateY: 0, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
            transition={reduced ? { duration: 0 } : { duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 [transform-origin:center]"
          >
              <StoryImage image={current} fit="cover" priority={active === 0} className="h-full w-full" sizes="(min-width: 768px) 65vw, 100vw" />
              {!reduced && (
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 flex justify-evenly overflow-hidden">
                  {Array.from({ length: 11 }).map((_, index) => (
                    <motion.span
                      key={index}
                      initial={{ scaleY: 1, opacity: 0.5 }}
                      animate={{ scaleY: 0, opacity: 0 }}
                      transition={{ delay: index * 0.018, duration: 0.58, ease: [0.76, 0, 0.24, 1] }}
                      className="h-full w-px origin-top bg-white/80 shadow-[0_0_12px_rgba(255,255,255,.9)]"
                    />
                  ))}
                </div>
              )}
          </motion.div>
          {showSwipeHint && (
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-none absolute bottom-20 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#260b18]/60 px-4 py-2 text-xs text-white shadow-lg backdrop-blur-md md:hidden"
            >
              Swipe through her colours
            </motion.p>
          )}
        </div>

        <motion.div
          animate={{ color: current.palette.ink }}
          className="relative flex flex-col justify-between overflow-hidden border-t border-white/70 p-6 md:border-l md:border-t-0 md:p-8"
        >
          <div aria-hidden="true" className="absolute -right-16 -top-14 h-56 w-56 rounded-full border border-current opacity-[.08]" />
          <div className="relative">
            <p className="text-xs font-medium tabular-nums tracking-[.18em]">{active + 1} / {content.images.length}</p>
            <motion.p
              key={current.editorialCaption}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.4 }}
              className="font-display mt-5 text-4xl leading-[.95] tracking-[-.03em] sm:text-5xl"
            >
              {current.editorialCaption}
            </motion.p>
          </div>

          <div className="relative mt-8">
            <div className="mb-5 flex gap-2" aria-label="Choose a look">
              {content.images.map((photo, index) => (
                <button
                  type="button"
                  key={photo.src}
                  aria-label={`Show look ${index + 1}`}
                  aria-current={index === active ? 'true' : undefined}
                  onClick={() => { setDirection(index >= active ? 1 : -1); setActive(index); setShowSwipeHint(false) }}
                  className="h-1.5 flex-1 rounded-full bg-current transition-opacity"
                  style={{ opacity: index === active ? 0.9 : 0.2 }}
                />
              ))}
            </div>
            <div className="flex gap-3">
              <button type="button" aria-label="Previous look" onClick={() => move(-1)} className="grid h-11 w-11 place-items-center rounded-full border border-current/20 bg-white/35 text-xl backdrop-blur-md transition-transform hover:-translate-x-0.5 active:scale-95">←</button>
              <button type="button" aria-label="Next look" onClick={() => move(1)} className="grid h-11 w-11 place-items-center rounded-full text-xl text-white shadow-lg transition-transform hover:translate-x-0.5 active:scale-95" style={{ backgroundColor: current.palette.accent }}>→</button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
