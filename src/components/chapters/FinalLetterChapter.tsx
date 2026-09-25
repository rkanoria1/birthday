'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import type { SiteContent } from '@/content/types'

function splitIntoLines(body: string) {
  return (body.match(/[^.!?,:]+[.!?,:]+|[^.!?,:]+$/g) ?? [body]).map((line) => line.trim()).filter(Boolean)
}

export function FinalLetterChapter({ content, onReplay }: { content: SiteContent['finalLetter']; onReplay: () => void }) {
  const reduced = useReducedMotion()
  const lines = splitIntoLines(content.body)
  const [heartTaps, setHeartTaps] = useState(0)
  const secretRevealed = heartTaps >= 3

  return (
    <section className="chapter-frame flex flex-col items-center justify-center overflow-hidden">
      <motion.div
        aria-hidden="true"
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={reduced ? { duration: 0 } : { duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute h-[75vmin] w-[75vmin] rounded-full bg-[radial-gradient(circle,rgba(217,47,76,.2),transparent_66%)]"
      />
      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.9, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: -0.5 }}
        transition={reduced ? { duration: 0 } : { duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel relative max-w-3xl rounded-[2.5rem] p-8 sm:p-12"
      >
        <motion.button
          type="button"
          aria-label="Reveal a secret for Somya"
          onClick={() => setHeartTaps((taps) => Math.min(3, taps + 1))}
          whileTap={reduced ? {} : { scale: 0.82, rotate: -6 }}
          className="absolute -right-3 -top-7 grid h-20 w-20 place-items-center rounded-full font-display text-7xl leading-none text-[#d92f4c]/20 transition-colors hover:text-[#d92f4c]/40 sm:-right-5 sm:-top-9 sm:h-24 sm:w-24 sm:text-8xl"
        >
          <span aria-hidden="true">♥</span>
        </motion.button>
        <div className="space-y-2" aria-label={content.body}>
          {lines.map((line, index) => (
            <motion.p
              data-testid="letter-line"
              key={`${index}-${line}`}
              initial={reduced ? false : { opacity: 0, y: 16, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={reduced ? { duration: 0 } : { delay: 0.42 + index * 0.36, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="font-hand text-3xl leading-[1.2] text-[#33272b] sm:text-4xl"
            >
              {line}
            </motion.p>
          ))}
        </div>
        <motion.div
          aria-hidden="true"
          initial={reduced ? false : { scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.45 }}
          transition={reduced ? { duration: 0 } : { delay: 0.5 + lines.length * 0.36, duration: 0.8 }}
          className="mt-7 h-px origin-left bg-gradient-to-r from-[#d92f4c] to-transparent"
        />
        <AnimatePresence>
          {secretRevealed && (
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 12, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              className="font-hand mt-6 text-2xl leading-snug text-[#8f2943] sm:text-3xl"
            >
              {content.secret}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
      <button
        type="button"
        onClick={onReplay}
        className="mt-6 rounded-full border border-[#591c2d]/12 bg-white/72 px-4 py-2 text-sm text-[#591c2d] shadow-[0_8px_24px_rgba(89,28,45,.1)] backdrop-blur-xl transition-transform hover:-translate-y-0.5 active:scale-95"
      >
        Experience it again
      </button>
    </section>
  )
}
