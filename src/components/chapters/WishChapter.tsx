'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCandle } from '@/hooks/useCandle'

const heartFlow = [-82, -60, -38, -18, 0, 22, 42, 64, 84]

export function WishChapter({ title, message }: { title: string; message: string }) {
  const { blownOut, blow, relight } = useCandle()
  const reduced = useReducedMotion()

  return (
    <section className={`chapter-frame grid place-items-center text-center transition-colors duration-1000 ${blownOut ? '' : 'bg-[radial-gradient(circle_at_50%_54%,rgba(255,201,141,.36),transparent_27%)]'}`}>
      <div>
        <h1 className="font-display text-7xl font-semibold leading-none text-[#591c2d] sm:text-9xl">{title}</h1>
        <p className="mt-4">Close your eyes, make your wish, then tap the flame.</p>

        <motion.button
          type="button"
          aria-label={blownOut ? 'Relight the birthday candle' : 'Blow out the birthday candle'}
          onClick={blownOut ? relight : blow}
          animate={blownOut || reduced ? {} : { y: [0, -5, 0] }}
          whileHover={reduced ? {} : { scale: 1.025 }}
          whileTap={reduced ? {} : { scale: 0.97 }}
          transition={{ duration: 3, repeat: Infinity }}
          className="relative mx-auto mt-8 block h-64 w-72 cursor-pointer rounded-[4rem] focus-visible:outline-offset-8"
        >
          <span className="absolute bottom-0 left-0 h-36 w-full rounded-[3rem_3rem_1.5rem_1.5rem] bg-gradient-to-b from-[#ffd9e2] to-[#e89bb0] shadow-[0_30px_80px_rgba(89,28,45,.18)]">
            <span className="mt-12 block h-4 bg-white/55" />
            <span className="mx-auto mt-7 flex justify-center gap-8" aria-hidden="true">
              <span>♥</span><span>♥</span><span>♥</span>
            </span>
          </span>
          <span aria-hidden="true" className="absolute bottom-36 left-1/2 h-20 w-3 -translate-x-1/2 rounded bg-[#c8a46a]" />

          {!blownOut && (
            <motion.span
              data-testid="candle-flame"
              aria-hidden="true"
              animate={reduced ? {} : { scale: [1, 0.86, 1.08, 1], rotate: [0, -4, 4, 0] }}
              transition={{ duration: 0.7, repeat: Infinity }}
              className="absolute bottom-56 left-1/2 h-10 w-7 -translate-x-1/2 rounded-[55%_45%_50%_50%] bg-gradient-to-t from-[#d92f4c] to-[#ffd36b] shadow-[0_0_40px_12px_rgba(255,201,141,.55)]"
            />
          )}

          {blownOut && (
            <motion.span
              data-testid="candle-heart"
              aria-hidden="true"
              initial={reduced ? false : { opacity: 0, scale: 0.35, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: reduced ? 0 : [0, -4, 0] }}
              transition={reduced ? { duration: 0 } : { opacity: { duration: 0.3 }, scale: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }, y: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } }}
              className="absolute bottom-56 left-1/2 z-10 -translate-x-1/2 font-display text-4xl leading-none text-[#c72c49]"
            >
              ♥
            </motion.span>
          )}

          <AnimatePresence>
            {blownOut && heartFlow.map((x, index) => (
              <motion.span
                key={x}
                data-testid="wish-heart-particle"
                aria-hidden="true"
                initial={reduced ? false : { opacity: 0, x: 0, y: 0, scale: 0.35 }}
                animate={reduced ? { opacity: 0.35, x, y: -50 - (index % 3) * 18, scale: 0.8 } : { opacity: [0, 0.65, 0], x, y: -92 - (index % 3) * 28, scale: [0.35, 0.9, 0.68], rotate: x * 0.35 }}
                transition={reduced ? { duration: 0 } : { duration: 2.4 + (index % 3) * 0.35, delay: index * 0.06, ease: 'easeOut' }}
                className="absolute bottom-56 left-1/2 -translate-x-1/2 font-display text-xl text-[#d92f4c]"
              >
                ♥
              </motion.span>
            ))}
          </AnimatePresence>
        </motion.button>

        <p className="mt-3 text-sm text-[#a06e7b]">{blownOut ? 'Tap the candle to light it again' : 'Tap the candle when you are ready'}</p>
        <div aria-live="polite">
          <AnimatePresence>
            {blownOut && (
              <motion.p
                initial={reduced ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-hand mx-auto mt-6 max-w-xl text-3xl leading-snug text-[#591c2d]"
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
