'use client'

import { StoryImage } from '@/components/StoryImage'
import type { SiteContent } from '@/content/types'
import { motion, useReducedMotion } from 'framer-motion'

export function BirthdayHeroChapter({ content }: { content: SiteContent['hero'] }) {
  const reduced = useReducedMotion()
  const reveal = (delay: number) => reduced ? { duration: 0 } : { delay, duration: 0.85, ease: [0.16, 1, 0.3, 1] as const }

  return (
    <section className="chapter-frame grid items-center gap-8 md:grid-cols-12">
      <div className="order-2 relative z-10 md:order-1 md:col-span-6">
        <motion.p initial={reduced ? false : { opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={reveal(0.12)} className="mb-4 text-sm text-[#a06e7b]">
          {content.kicker}
        </motion.p>
        <motion.h1 initial={reduced ? false : { opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={reveal(0.28)} className="font-display display-balance text-[clamp(4.2rem,9vw,8.8rem)] leading-[.78] font-semibold tracking-[-.055em] text-[#591c2d]">
          {content.title}
        </motion.h1>
        <motion.p initial={reduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={reveal(0.52)} className="mt-8 max-w-sm text-lg leading-8">
          Today is a little love letter to every beautiful version of you.
        </motion.p>
      </div>
      <motion.div initial={reduced ? false : { rotate: 4, scale: 0.9, opacity: 0 }} animate={{ rotate: -2, scale: 1, opacity: 1 }} transition={reveal(0.05)} className="order-1 md:order-2 md:col-span-6">
        <div className="photo-depth relative overflow-hidden rounded-[2rem_2rem_9rem_2rem] border-8 border-white bg-[#f7dde4]">
          <StoryImage image={content.image} priority className="h-[44svh] w-full md:h-[72svh]" sizes="(min-width:768px) 50vw, 100vw" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#260b18]/25 via-transparent to-white/10" />
        </div>
      </motion.div>
      <div aria-hidden="true" className="font-display pointer-events-none absolute bottom-16 left-1/2 hidden -translate-x-1/2 text-[18vw] leading-none text-[#d92f4c]/[.035] lg:block">SOMYA</div>
    </section>
  )
}
