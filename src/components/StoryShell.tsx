import type { ReactNode } from 'react'

export function StoryShell({ onBack, onNext, showBack, showNext, continueLabel = 'Continue', children }: { onBack: () => void; onNext: () => void; showBack: boolean; showNext: boolean; continueLabel?: string; children: ReactNode }) {
  return (
    <main className="relative min-h-svh">
      {children}
      <nav
        data-compact-navigation="true"
        data-navigation-dock="true"
        aria-label="Story navigation"
        className="fixed bottom-[max(0.8rem,env(safe-area-inset-bottom))] left-1/2 z-40 flex w-fit -translate-x-1/2 items-center gap-1 rounded-full border border-white/80 bg-white/78 p-1 shadow-[0_12px_38px_rgba(89,28,45,.14)] backdrop-blur-2xl"
      >
        {showBack && (
          <button
            type="button"
            aria-label="Back"
            onClick={onBack}
            className="grid h-11 w-11 place-items-center rounded-full text-xl text-[#591c2d] transition-[background,transform] duration-200 hover:bg-[#f7dde4]/70 active:scale-95"
          >
            <span aria-hidden="true">←</span>
          </button>
        )}
        {showNext && (
          <button
            type="button"
            aria-label={continueLabel === 'Begin' ? 'Begin' : 'Next'}
            onClick={onNext}
            className="grid h-11 w-11 place-items-center rounded-full bg-[#d92f4c] text-xl text-white shadow-[0_7px_20px_rgba(217,47,76,.24)] transition-[background,transform] duration-200 hover:bg-[#c52744] active:scale-95"
          >
            <span aria-hidden="true">→</span>
          </button>
        )}
      </nav>
    </main>
  )
}
