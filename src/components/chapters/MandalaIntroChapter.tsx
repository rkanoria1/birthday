'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'

export function MandalaIntroChapter() {
  const reduced = useReducedMotion()

  return (
    <section className="chapter-frame relative isolate grid min-h-svh items-center overflow-hidden md:grid-cols-12">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-20 opacity-60"
        initial={reduced ? false : { opacity: 0, scale: 1.12, rotate: -3 }}
        animate={{ opacity: 0.6, scale: 1, rotate: 0 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image src="/art/somya-mandala-backdrop.webp" alt="" fill priority className="object-contain" sizes="100vw" />
      </motion.div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,249,246,.96)_0%,rgba(255,249,246,.76)_42%,rgba(255,249,246,.14)_72%),linear-gradient(0deg,rgba(255,249,246,.86)_0%,transparent_38%)] md:bg-[linear-gradient(90deg,rgba(255,249,246,.96)_0%,rgba(255,249,246,.72)_42%,rgba(255,249,246,.08)_75%)]" />
      <Image src="/art/somya-mandala-backdrop.webp" alt="Mandala artwork inspired by Somya’s creation" width={1} height={1} className="sr-only" />

      <motion.div
        className="relative z-10 self-start pt-12 text-center md:col-span-6 md:self-center md:pt-0 md:text-left"
        initial={reduced ? false : { opacity: 0, x: -36 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="mb-4 text-xs uppercase tracking-[0.34em] text-[#a06e7b]">Drawn from your world</p>
        <h1 className="font-display display-balance text-[clamp(3.8rem,8vw,7.8rem)] font-semibold leading-[0.82] tracking-[-0.05em] text-[#591c2d]">
          A little world, drawn from yours
        </h1>
        <p className="mx-auto mt-7 max-w-md text-base leading-7 text-[#5f4a52] md:mx-0 md:text-lg md:leading-8">
          A celebration shaped by your colours, your art, and every beautiful detail that makes you, you.
        </p>
      </motion.div>

      <motion.div
        className="relative z-0 col-span-1 -mb-24 mt-2 h-[52svh] min-h-[24rem] md:col-span-6 md:-mb-24 md:mt-0 md:h-[82svh]"
        initial={reduced ? false : { opacity: 0, y: 70, scale: 0.88 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.15, duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image src="/art/somya-caricature.webp" alt="Illustrated portrait of Somya" fill priority className="object-contain object-bottom drop-shadow-[0_32px_50px_rgba(89,28,45,.2)]" sizes="(min-width:768px) 50vw, 100vw" />
      </motion.div>
    </section>
  )
}
