'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { StoryImageData } from '@/content/types'

const MotionImage = motion.create(Image)

export function StoryImage({ image, className = '', priority = false, sizes = '100vw', fit = 'cover' }: { image: StoryImageData; className?: string; priority?: boolean; sizes?: string; fit?: 'cover' | 'contain' }) {
  const [failed, setFailed] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!expanded) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpanded(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [expanded])

  if (failed) {
    return <div role="img" aria-label={`Photo unavailable: ${image.alt}`} className={`grid place-items-center bg-[#f7dde4] p-6 text-center text-sm text-[#591c2d] ${className}`}>Your photo will live here</div>
  }

  return (
    <>
      <motion.button
        type="button"
        aria-label={`Open ${image.alt}`}
        onClick={() => setExpanded(true)}
        whileTap={reduced ? {} : { scale: 0.985 }}
        className={`relative block overflow-hidden text-left ${className}`}
      >
        <MotionImage
          data-motion-photo="true"
          src={image.src}
          alt={image.alt}
          width={1200}
          height={1500}
          priority={priority}
          sizes={sizes}
          onError={() => setFailed(true)}
          style={{ objectPosition: image.focalPoint ?? '50% 50%' }}
          initial={reduced ? false : { opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, scale: [1, 1.018, 1], y: [0, -3, 0], filter: 'blur(0px)' }}
          whileHover={reduced ? {} : { scale: 1.035 }}
          transition={reduced ? { duration: 0 } : { opacity: { duration: 0.7 }, filter: { duration: 0.8 }, scale: { duration: 11, repeat: Infinity, ease: 'easeInOut' }, y: { duration: 9, repeat: Infinity, ease: 'easeInOut' } }}
          className={`${fit === 'contain' ? 'object-contain' : 'object-cover'} h-full w-full cursor-zoom-in`}
        />
      </motion.button>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {expanded && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={image.alt}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] grid place-items-center bg-[#260b18]/88 p-4 backdrop-blur-xl sm:p-10"
            onClick={() => setExpanded(false)}
          >
            <motion.div
              initial={reduced ? false : { opacity: 0, scale: 0.88, rotate: -1.5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={reduced ? { duration: 0 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-[86svh] w-full max-w-5xl"
              onClick={(event) => event.stopPropagation()}
            >
              <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-contain drop-shadow-[0_30px_80px_rgba(0,0,0,.45)]" />
              <button
                type="button"
                aria-label="Close portrait"
                onClick={() => setExpanded(false)}
                className="absolute right-0 top-0 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-2xl leading-none text-[#591c2d] shadow-xl sm:-right-4 sm:-top-4"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}
