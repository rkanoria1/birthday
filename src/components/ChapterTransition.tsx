'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export function ChapterTransition({ chapter, children }: { chapter: string; children: ReactNode }) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      key={chapter}
      className="relative"
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 30, scale: 0.99, filter: 'blur(7px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={reduced ? { duration: 0 } : { duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
    >
      {!reduced && (
        <motion.svg
          data-testid="mandala-transition"
          aria-hidden="true"
          viewBox="0 0 200 200"
          className="pointer-events-none fixed left-1/2 top-1/2 z-50 h-40 w-40 -translate-x-1/2 -translate-y-1/2 text-[#c8a46a] sm:h-52 sm:w-52"
          initial={{ opacity: 0, scale: 0.78, rotate: -12 }}
          animate={{ opacity: [0, 0.42, 0], scale: [0.78, 1, 1.08], rotate: [-12, 0, 5] }}
          transition={{ duration: 0.82, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.circle cx="100" cy="100" r="26" fill="none" stroke="currentColor" strokeWidth="1.3" pathLength="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.52 }} />
          <motion.path
            d="M100 18C113 43 133 42 156 34C148 57 157 75 182 88C157 101 156 121 166 144C142 136 124 145 112 182C99 157 79 156 56 166C64 142 55 124 18 112C43 99 42 79 34 56C57 64 75 55 88 18C92 27 96 32 100 38C104 32 108 27 112 18C125 55 143 64 166 56C158 79 159 99 182 112C145 124 136 142 144 166C121 156 101 157 88 182C76 145 58 136 34 144C44 121 43 101 18 88C55 75 64 57 56 34C79 42 99 43 100 18Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          />
        </motion.svg>
      )}
      {children}
    </motion.div>
  )
}
