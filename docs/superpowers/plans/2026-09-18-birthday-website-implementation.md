# Birthday Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the passcode-gated, 9-step interactive birthday scrapbook website described in `docs/superpowers/specs/2026-09-18-birthday-website-design.md`, ready for content to be filled in before October 6, 2026.

**Architecture:** A single Next.js page holds a `currentStep` state machine over a fixed, ordered list of step IDs. Each step is a small presentational component driven by a pure, independently-testable hook (balloon-pop state, gift-choice state, candle state, love-toggle state) or pure function (step navigation, passcode check). Content (text/photo paths/passcode) lives in one typed data file so step components never hardcode copy.

**Tech Stack:** Next.js (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion, Vitest + React Testing Library for tests, no backend/database.

---

## File Structure

```
birthday/
  src/
    app/
      layout.tsx          # fonts, global <html>/<body>
      page.tsx             # step state machine, renders current step
      globals.css          # Tailwind import + gingham background utility
    content/
      types.ts             # SiteContent and per-step content interfaces
      site.ts               # actual content data (placeholder copy/photos)
    lib/
      stepFlow.ts           # STEP_ORDER, nextStep/prevStep/canGoBack/canGoNext/stepIndex
      passcode.ts            # isPasscodeCorrect
    hooks/
      useBalloonPop.ts
      useGiftChoice.ts
      useCandle.ts
      useLoveToggle.ts
    components/
      PhotoFrame.tsx         # <img> with graceful fallback when photo missing
      BackgroundAudio.tsx     # looping bg music + mute toggle, tolerant of missing file
      StepShell.tsx            # progress dots + Next/Back nav wrapper
      steps/
        PasscodeStep.tsx
        LetterStep.tsx          # shared by letter1 and finalLetter (variant prop)
        PhotoCollageStep.tsx
        FavoritePersonStep.tsx
        BalloonPopStep.tsx
        GiftChoiceStep.tsx
        MakeAWishStep.tsx
        LoveYouMoreStep.tsx
  vitest.config.ts
  vitest.setup.ts
  .nvmrc
```

---

### Task 1: Scaffold the Next.js project

**Files:**
- Create: entire Next.js project skeleton in `/Users/rahulkanoria/Documents/repos/birthday`

- [ ] **Step 1: Temporarily move the existing docs folder aside**

```bash
cd /Users/rahulkanoria/Documents/repos/birthday
mv docs /tmp/birthday-docs-backup
```

- [ ] **Step 2: Set the Node version for this project**

```bash
echo "22.22.1" > /Users/rahulkanoria/Documents/repos/birthday/.nvmrc
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use 22.22.1
node --version
```

Expected: `v22.22.1`

- [ ] **Step 3: Scaffold Next.js with TypeScript, Tailwind, App Router**

```bash
cd /Users/rahulkanoria/Documents/repos/birthday
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Answer "No" to Turbopack-related prompts if asked (not required for this project); accept defaults otherwise.

- [ ] **Step 4: Restore the docs folder**

```bash
mv /tmp/birthday-docs-backup /Users/rahulkanoria/Documents/repos/birthday/docs
```

- [ ] **Step 5: Verify the dev server runs**

```bash
cd /Users/rahulkanoria/Documents/repos/birthday
npm run dev
```

Expected: server starts on `http://localhost:3000` and the default Next.js starter page loads. Stop the server (Ctrl+C) once confirmed.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Scaffold Next.js project"
```

---

### Task 2: Add Vitest + React Testing Library

**Files:**
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Modify: `package.json` (scripts + devDependencies)
- Test: `src/lib/__tests__/sanity.test.ts`

- [ ] **Step 1: Install test dependencies**

```bash
cd /Users/rahulkanoria/Documents/repos/birthday
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use 22.22.1
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitejs/plugin-react
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

- [ ] **Step 3: Create `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 4: Add test scripts to `package.json`**

Add these two entries inside the existing `"scripts"` object:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Write a sanity test**

`src/lib/__tests__/sanity.test.ts`:

```ts
import { describe, it, expect } from 'vitest'

describe('test setup', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 6: Run the test**

```bash
npm test
```

Expected: 1 passed test.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Add Vitest and React Testing Library"
```

---

### Task 3: Content types and content data

**Files:**
- Create: `src/content/types.ts`
- Create: `src/content/site.ts`
- Test: `src/content/__tests__/site.test.ts`

- [ ] **Step 1: Write the failing test**

`src/content/__tests__/site.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { siteContent } from '@/content/site'

describe('siteContent', () => {
  it('has a 4-digit passcode', () => {
    expect(siteContent.passcode).toHaveLength(4)
    expect(siteContent.passcode).toMatch(/^\d{4}$/)
  })

  it('has exactly 4 balloon reveal phrases', () => {
    expect(siteContent.balloonPop.revealPhrases).toHaveLength(4)
  })

  it('has at least one collage photo', () => {
    expect(siteContent.photoCollage.photos.length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/content/__tests__/site.test.ts
```

Expected: FAIL — cannot find module `@/content/site`.

- [ ] **Step 3: Create `src/content/types.ts`**

```ts
export interface LetterContent {
  title: string
  body: string
  photo: string
}

export interface FinalLetterContent {
  body: string
  cta: string
}

export interface PhotoCollageContent {
  caption: string
  photos: string[]
}

export interface FavoritePersonContent {
  photo: string
  caption: string
}

export interface BalloonPopContent {
  revealPhrases: [string, string, string, string]
}

export interface GiftChoiceContent {
  yesRevealText: string
}

export interface MakeAWishContent {
  cakeMessage: string
}

export interface SiteContent {
  recipientName: string
  passcode: string
  songSrc: string
  letter1: LetterContent
  photoCollage: PhotoCollageContent
  favoritePerson: FavoritePersonContent
  balloonPop: BalloonPopContent
  giftChoice: GiftChoiceContent
  makeAWish: MakeAWishContent
  finalLetter: FinalLetterContent
}
```

- [ ] **Step 4: Create `src/content/site.ts`**

```ts
import type { SiteContent } from './types'

export const siteContent: SiteContent = {
  recipientName: 'HER_NAME',
  passcode: '0610',
  songSrc: '/audio/song.mp3',
  letter1: {
    title: 'For you',
    body: "Before anything else today, I wanted to write this down: having you in my life makes every ordinary moment feel a little more special. Thank you for being exactly who you are.",
    photo: '/images/letter1.jpg',
  },
  photoCollage: {
    caption: 'to the person who made my days',
    photos: ['/images/collage-1.jpg', '/images/collage-2.jpg', '/images/collage-3.jpg'],
  },
  favoritePerson: {
    photo: '/images/favorite-person.jpg',
    caption: 'Favorite person',
  },
  balloonPop: {
    revealPhrases: ['every', 'day', 'with you', 'feels lucky'],
  },
  giftChoice: {
    yesRevealText: "Good. Because there's something waiting for you tonight.",
  },
  makeAWish: {
    cakeMessage: 'Make a wish. I hope it comes true — and if it does not, I will help you make it happen anyway.',
  },
  finalLetter: {
    body: "Happy birthday, love. Today is about celebrating you — your kindness, your strength, the warmth you bring into this home we're building together. I'm grateful every single day that this is our story.",
    cta: "Come find me. I'm right outside.",
  },
}
```

- [ ] **Step 5: Run test to verify it passes**

```bash
npx vitest run src/content/__tests__/site.test.ts
```

Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Add site content types and data"
```

---

### Task 4: Step navigation logic

**Files:**
- Create: `src/lib/stepFlow.ts`
- Test: `src/lib/__tests__/stepFlow.test.ts`

- [ ] **Step 1: Write the failing test**

`src/lib/__tests__/stepFlow.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { STEP_ORDER, nextStep, prevStep, canGoBack, canGoNext, stepIndex } from '@/lib/stepFlow'

describe('stepFlow', () => {
  it('starts navigation from the first step', () => {
    expect(STEP_ORDER[0]).toBe('passcode')
  })

  it('advances to the next step', () => {
    expect(nextStep('passcode')).toBe('letter1')
  })

  it('does not advance past the last step', () => {
    const last = STEP_ORDER[STEP_ORDER.length - 1]
    expect(nextStep(last)).toBe(last)
  })

  it('goes back to the previous step', () => {
    expect(prevStep('letter1')).toBe('passcode')
  })

  it('does not go back before the first step', () => {
    expect(prevStep('passcode')).toBe('passcode')
  })

  it('reports canGoBack correctly', () => {
    expect(canGoBack('passcode')).toBe(false)
    expect(canGoBack('letter1')).toBe(true)
  })

  it('reports canGoNext correctly', () => {
    const last = STEP_ORDER[STEP_ORDER.length - 1]
    expect(canGoNext(last)).toBe(false)
    expect(canGoNext('passcode')).toBe(true)
  })

  it('reports the numeric index of a step', () => {
    expect(stepIndex('passcode')).toBe(0)
    expect(stepIndex('letter1')).toBe(1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/lib/__tests__/stepFlow.test.ts
```

Expected: FAIL — cannot find module `@/lib/stepFlow`.

- [ ] **Step 3: Create `src/lib/stepFlow.ts`**

```ts
export const STEP_ORDER = [
  'passcode',
  'letter1',
  'photoCollage',
  'favoritePerson',
  'balloonPop',
  'giftChoice',
  'makeAWish',
  'loveYouMore',
  'finalLetter',
] as const

export type StepId = (typeof STEP_ORDER)[number]

export function stepIndex(current: StepId): number {
  return STEP_ORDER.indexOf(current)
}

export function nextStep(current: StepId): StepId {
  const idx = stepIndex(current)
  if (idx === STEP_ORDER.length - 1) return current
  return STEP_ORDER[idx + 1]
}

export function prevStep(current: StepId): StepId {
  const idx = stepIndex(current)
  if (idx === 0) return current
  return STEP_ORDER[idx - 1]
}

export function canGoBack(current: StepId): boolean {
  return stepIndex(current) > 0
}

export function canGoNext(current: StepId): boolean {
  return stepIndex(current) < STEP_ORDER.length - 1
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/lib/__tests__/stepFlow.test.ts
```

Expected: PASS (8 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add step navigation logic"
```

---

### Task 5: Passcode check logic

**Files:**
- Create: `src/lib/passcode.ts`
- Test: `src/lib/__tests__/passcode.test.ts`

- [ ] **Step 1: Write the failing test**

`src/lib/__tests__/passcode.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { isPasscodeCorrect } from '@/lib/passcode'

describe('isPasscodeCorrect', () => {
  it('returns true for a matching code', () => {
    expect(isPasscodeCorrect('0610', '0610')).toBe(true)
  })

  it('returns false for a non-matching code of the same length', () => {
    expect(isPasscodeCorrect('1234', '0610')).toBe(false)
  })

  it('returns false for a shorter input', () => {
    expect(isPasscodeCorrect('061', '0610')).toBe(false)
  })

  it('returns false for a longer input', () => {
    expect(isPasscodeCorrect('06100', '0610')).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/lib/__tests__/passcode.test.ts
```

Expected: FAIL — cannot find module `@/lib/passcode`.

- [ ] **Step 3: Create `src/lib/passcode.ts`**

```ts
export function isPasscodeCorrect(input: string, expected: string): boolean {
  return input.length === expected.length && input === expected
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/lib/__tests__/passcode.test.ts
```

Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add passcode check logic"
```

---

### Task 6: PhotoFrame component (graceful missing-photo fallback)

**Files:**
- Create: `src/components/PhotoFrame.tsx`
- Test: `src/components/__tests__/PhotoFrame.test.tsx`

- [ ] **Step 1: Write the failing test**

`src/components/__tests__/PhotoFrame.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PhotoFrame } from '@/components/PhotoFrame'

describe('PhotoFrame', () => {
  it('renders the image by default', () => {
    render(<PhotoFrame src="/images/test.jpg" alt="test photo" />)
    expect(screen.getByRole('img', { name: 'test photo' })).toBeInTheDocument()
  })

  it('shows a fallback when the image fails to load', () => {
    render(<PhotoFrame src="/images/missing.jpg" alt="test photo" />)
    fireEvent.error(screen.getByRole('img', { name: 'test photo' }))
    expect(screen.getByTestId('photo-fallback')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/components/__tests__/PhotoFrame.test.tsx
```

Expected: FAIL — cannot find module `@/components/PhotoFrame`.

- [ ] **Step 3: Create `src/components/PhotoFrame.tsx`**

```tsx
'use client'

import { useState } from 'react'

interface PhotoFrameProps {
  src: string
  alt: string
  className?: string
}

export function PhotoFrame({ src, alt, className = '' }: PhotoFrameProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-pink-100 text-pink-400 text-sm ${className}`}
        data-testid="photo-fallback"
      >
        📷 add photo
      </div>
    )
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/components/__tests__/PhotoFrame.test.tsx
```

Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add PhotoFrame component with missing-photo fallback"
```

---

### Task 7: BackgroundAudio component

**Files:**
- Create: `src/components/BackgroundAudio.tsx`
- Test: `src/components/__tests__/BackgroundAudio.test.tsx`

- [ ] **Step 1: Write the failing test**

`src/components/__tests__/BackgroundAudio.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BackgroundAudio } from '@/components/BackgroundAudio'

describe('BackgroundAudio', () => {
  it('starts muted with a "tap for sound" button', () => {
    render(<BackgroundAudio src="/audio/song.mp3" />)
    expect(screen.getByRole('button', { name: /unmute background music/i })).toBeInTheDocument()
  })

  it('unmutes the audio element when the button is clicked', () => {
    render(<BackgroundAudio src="/audio/song.mp3" />)
    const button = screen.getByRole('button', { name: /unmute background music/i })
    fireEvent.click(button)
    const audio = document.querySelector('audio') as HTMLAudioElement
    expect(audio.muted).toBe(false)
    expect(screen.getByRole('button', { name: /mute background music/i })).toBeInTheDocument()
  })

  it('hides itself if the audio file fails to load', () => {
    render(<BackgroundAudio src="/audio/missing.mp3" />)
    const audio = document.querySelector('audio') as HTMLAudioElement
    fireEvent.error(audio)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/components/__tests__/BackgroundAudio.test.tsx
```

Expected: FAIL — cannot find module `@/components/BackgroundAudio`.

- [ ] **Step 3: Create `src/components/BackgroundAudio.tsx`**

```tsx
'use client'

import { useRef, useState } from 'react'

interface BackgroundAudioProps {
  src: string
}

export function BackgroundAudio({ src }: BackgroundAudioProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [muted, setMuted] = useState(true)
  const [available, setAvailable] = useState(true)

  function toggleMute() {
    const audio = audioRef.current
    if (!audio) return

    if (muted) {
      audio.muted = false
      const playResult = audio.play()
      if (playResult && typeof playResult.catch === 'function') {
        playResult.catch(() => {})
      }
    } else {
      audio.muted = true
    }
    setMuted(!muted)
  }

  if (!available) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <audio ref={audioRef} src={src} loop muted autoPlay onError={() => setAvailable(false)} />
      <button
        onClick={toggleMute}
        className="rounded-full bg-white/80 px-3 py-2 text-sm shadow"
        aria-label={muted ? 'Unmute background music' : 'Mute background music'}
      >
        {muted ? '🔈 tap for sound' : '🔊'}
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/components/__tests__/BackgroundAudio.test.tsx
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add BackgroundAudio component"
```

---

### Task 8: Balloon-pop hook and step

**Files:**
- Create: `src/hooks/useBalloonPop.ts`
- Create: `src/components/steps/BalloonPopStep.tsx`
- Test: `src/hooks/__tests__/useBalloonPop.test.ts`
- Test: `src/components/steps/__tests__/BalloonPopStep.test.tsx`

- [ ] **Step 1: Write the failing hook test**

`src/hooks/__tests__/useBalloonPop.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBalloonPop } from '@/hooks/useBalloonPop'

describe('useBalloonPop', () => {
  it('starts with all balloons unpopped', () => {
    const { result } = renderHook(() => useBalloonPop(4))
    expect(result.current.popped).toEqual([false, false, false, false])
    expect(result.current.allPopped).toBe(false)
  })

  it('pops a single balloon by index', () => {
    const { result } = renderHook(() => useBalloonPop(4))
    act(() => result.current.pop(1))
    expect(result.current.popped).toEqual([false, true, false, false])
  })

  it('reports allPopped once every balloon is popped', () => {
    const { result } = renderHook(() => useBalloonPop(2))
    act(() => result.current.pop(0))
    act(() => result.current.pop(1))
    expect(result.current.allPopped).toBe(true)
  })

  it('popping the same balloon twice has no extra effect', () => {
    const { result } = renderHook(() => useBalloonPop(2))
    act(() => result.current.pop(0))
    act(() => result.current.pop(0))
    expect(result.current.popped).toEqual([true, false])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/hooks/__tests__/useBalloonPop.test.ts
```

Expected: FAIL — cannot find module `@/hooks/useBalloonPop`.

- [ ] **Step 3: Create `src/hooks/useBalloonPop.ts`**

```ts
import { useState } from 'react'

export function useBalloonPop(total: number) {
  const [popped, setPopped] = useState<boolean[]>(() => Array(total).fill(false))

  function pop(index: number) {
    setPopped((prev) => {
      if (prev[index]) return prev
      const next = [...prev]
      next[index] = true
      return next
    })
  }

  const allPopped = popped.every(Boolean)

  return { popped, pop, allPopped }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/hooks/__tests__/useBalloonPop.test.ts
```

Expected: PASS (4 tests).

- [ ] **Step 5: Write the failing component test**

`src/components/steps/__tests__/BalloonPopStep.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BalloonPopStep } from '@/components/steps/BalloonPopStep'

const phrases: [string, string, string, string] = ['every', 'day', 'with you', 'feels lucky']

describe('BalloonPopStep', () => {
  it('renders 4 balloon buttons and no revealed phrases yet', () => {
    render(<BalloonPopStep revealPhrases={phrases} onAllPopped={() => {}} />)
    expect(screen.getAllByRole('button', { name: /balloon/i })).toHaveLength(4)
    expect(screen.queryByText('every')).not.toBeInTheDocument()
  })

  it('reveals a phrase when its balloon is popped', () => {
    render(<BalloonPopStep revealPhrases={phrases} onAllPopped={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: 'Balloon 1' }))
    expect(screen.getByText('every')).toBeInTheDocument()
  })

  it('calls onAllPopped once the last balloon is popped', () => {
    let called = false
    render(<BalloonPopStep revealPhrases={phrases} onAllPopped={() => (called = true)} />)
    fireEvent.click(screen.getByRole('button', { name: 'Balloon 1' }))
    fireEvent.click(screen.getByRole('button', { name: 'Balloon 2' }))
    fireEvent.click(screen.getByRole('button', { name: 'Balloon 3' }))
    expect(called).toBe(false)
    fireEvent.click(screen.getByRole('button', { name: 'Balloon 4' }))
    expect(called).toBe(true)
  })
})
```

- [ ] **Step 6: Run test to verify it fails**

```bash
npx vitest run src/components/steps/__tests__/BalloonPopStep.test.tsx
```

Expected: FAIL — cannot find module `@/components/steps/BalloonPopStep`.

- [ ] **Step 7: Create `src/components/steps/BalloonPopStep.tsx`**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { useBalloonPop } from '@/hooks/useBalloonPop'

interface BalloonPopStepProps {
  revealPhrases: [string, string, string, string]
  onAllPopped: () => void
}

export function BalloonPopStep({ revealPhrases, onAllPopped }: BalloonPopStepProps) {
  const { popped, pop, allPopped } = useBalloonPop(4)
  const hasFired = useRef(false)

  useEffect(() => {
    if (allPopped && !hasFired.current) {
      hasFired.current = true
      onAllPopped()
    }
  }, [allPopped, onAllPopped])

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h2 className="font-script text-3xl text-pink-600">Pop all 4 balloons</h2>
      <div className="flex gap-4">
        {revealPhrases.map((_, index) => (
          <button
            key={index}
            aria-label={`Balloon ${index + 1}`}
            onClick={() => pop(index)}
            className="h-16 w-16 rounded-full bg-pink-300 text-2xl disabled:opacity-30"
            disabled={popped[index]}
          >
            {popped[index] ? '💥' : '🎈'}
          </button>
        ))}
      </div>
      <p className="text-lg text-pink-700">
        {revealPhrases
          .filter((_, index) => popped[index])
          .join(' ')}
      </p>
    </div>
  )
}
```

- [ ] **Step 8: Run test to verify it passes**

```bash
npx vitest run src/components/steps/__tests__/BalloonPopStep.test.tsx
```

Expected: PASS (3 tests).

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Add balloon-pop hook and step"
```

---

### Task 9: Gift-choice hook and step

**Files:**
- Create: `src/hooks/useGiftChoice.ts`
- Create: `src/components/steps/GiftChoiceStep.tsx`
- Test: `src/hooks/__tests__/useGiftChoice.test.ts`
- Test: `src/components/steps/__tests__/GiftChoiceStep.test.tsx`

- [ ] **Step 1: Write the failing hook test**

`src/hooks/__tests__/useGiftChoice.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGiftChoice } from '@/hooks/useGiftChoice'

describe('useGiftChoice', () => {
  it('starts unrevealed with the default No label', () => {
    const { result } = renderHook(() => useGiftChoice())
    expect(result.current.revealed).toBe(false)
    expect(result.current.noLabel).toBe('No')
  })

  it('reveals the message when Yes is pressed', () => {
    const { result } = renderHook(() => useGiftChoice())
    act(() => result.current.pressYes())
    expect(result.current.revealed).toBe(true)
  })

  it('cycles the No label each time it is pressed, capped at the last label', () => {
    const { result } = renderHook(() => useGiftChoice())
    act(() => result.current.pressNo())
    expect(result.current.noLabel).toBe('Are you sure?')
    act(() => result.current.pressNo())
    expect(result.current.noLabel).toBe('Really?')
    act(() => result.current.pressNo())
    expect(result.current.noLabel).toBe('Okay fine... Yes it is 😏')
    act(() => result.current.pressNo())
    expect(result.current.noLabel).toBe('Okay fine... Yes it is 😏')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/hooks/__tests__/useGiftChoice.test.ts
```

Expected: FAIL — cannot find module `@/hooks/useGiftChoice`.

- [ ] **Step 3: Create `src/hooks/useGiftChoice.ts`**

```ts
import { useState } from 'react'

const NO_LABELS = ['No', 'Are you sure?', 'Really?', 'Okay fine... Yes it is 😏']

export function useGiftChoice() {
  const [revealed, setRevealed] = useState(false)
  const [noPresses, setNoPresses] = useState(0)

  function pressYes() {
    setRevealed(true)
  }

  function pressNo() {
    setNoPresses((count) => Math.min(count + 1, NO_LABELS.length - 1))
  }

  return { revealed, noLabel: NO_LABELS[noPresses], pressYes, pressNo }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/hooks/__tests__/useGiftChoice.test.ts
```

Expected: PASS (3 tests).

- [ ] **Step 5: Write the failing component test**

`src/components/steps/__tests__/GiftChoiceStep.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GiftChoiceStep } from '@/components/steps/GiftChoiceStep'

describe('GiftChoiceStep', () => {
  it('asks the question and hides the reveal text initially', () => {
    render(<GiftChoiceStep yesRevealText="Surprise!" />)
    expect(screen.getByText('Do you want to open your gift?')).toBeInTheDocument()
    expect(screen.queryByText('Surprise!')).not.toBeInTheDocument()
  })

  it('shows the reveal text after clicking Yes', () => {
    render(<GiftChoiceStep yesRevealText="Surprise!" />)
    fireEvent.click(screen.getByRole('button', { name: 'No' }))
    fireEvent.click(screen.getByRole('button', { name: 'Are you sure?' }))
    expect(screen.queryByText('Surprise!')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run test to verify it fails**

```bash
npx vitest run src/components/steps/__tests__/GiftChoiceStep.test.tsx
```

Expected: FAIL — cannot find module `@/components/steps/GiftChoiceStep`.

- [ ] **Step 7: Create `src/components/steps/GiftChoiceStep.tsx`**

```tsx
'use client'

import { useGiftChoice } from '@/hooks/useGiftChoice'

interface GiftChoiceStepProps {
  yesRevealText: string
}

export function GiftChoiceStep({ yesRevealText }: GiftChoiceStepProps) {
  const { revealed, noLabel, pressYes, pressNo } = useGiftChoice()

  return (
    <div className="flex flex-col items-center gap-6 p-6 text-center">
      <h2 className="font-script text-3xl text-pink-600">Do you want to open your gift?</h2>
      <div className="text-5xl">🎁</div>
      {!revealed && (
        <div className="flex gap-4">
          <button onClick={pressYes} className="rounded-full bg-pink-500 px-6 py-2 text-white">
            Yes
          </button>
          <button onClick={pressNo} className="rounded-full bg-white px-6 py-2 text-pink-600 shadow">
            {noLabel}
          </button>
        </div>
      )}
      {revealed && <p className="text-lg text-pink-700">{yesRevealText}</p>}
    </div>
  )
}
```

- [ ] **Step 8: Run test to verify it passes**

```bash
npx vitest run src/components/steps/__tests__/GiftChoiceStep.test.tsx
```

Expected: PASS (2 tests).

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Add gift-choice hook and step"
```

---

### Task 10: Candle (make-a-wish) hook and step

**Files:**
- Create: `src/hooks/useCandle.ts`
- Create: `src/components/steps/MakeAWishStep.tsx`
- Test: `src/hooks/__tests__/useCandle.test.ts`
- Test: `src/components/steps/__tests__/MakeAWishStep.test.tsx`

- [ ] **Step 1: Write the failing hook test**

`src/hooks/__tests__/useCandle.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCandle } from '@/hooks/useCandle'

describe('useCandle', () => {
  it('starts lit', () => {
    const { result } = renderHook(() => useCandle())
    expect(result.current.blownOut).toBe(false)
  })

  it('blows out the candle', () => {
    const { result } = renderHook(() => useCandle())
    act(() => result.current.blow())
    expect(result.current.blownOut).toBe(true)
  })

  it('relights the candle', () => {
    const { result } = renderHook(() => useCandle())
    act(() => result.current.blow())
    act(() => result.current.relight())
    expect(result.current.blownOut).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/hooks/__tests__/useCandle.test.ts
```

Expected: FAIL — cannot find module `@/hooks/useCandle`.

- [ ] **Step 3: Create `src/hooks/useCandle.ts`**

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/hooks/__tests__/useCandle.test.ts
```

Expected: PASS (3 tests).

- [ ] **Step 5: Write the failing component test**

`src/components/steps/__tests__/MakeAWishStep.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MakeAWishStep } from '@/components/steps/MakeAWishStep'

describe('MakeAWishStep', () => {
  it('shows a lit candle and hides the wish message initially', () => {
    render(<MakeAWishStep cakeMessage="Wish granted." />)
    expect(screen.getByText('🕯️')).toBeInTheDocument()
    expect(screen.queryByText('Wish granted.')).not.toBeInTheDocument()
  })

  it('reveals the wish message after blowing out the candle', () => {
    render(<MakeAWishStep cakeMessage="Wish granted." />)
    fireEvent.click(screen.getByRole('button', { name: /blow out the candle/i }))
    expect(screen.getByText('Wish granted.')).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run test to verify it fails**

```bash
npx vitest run src/components/steps/__tests__/MakeAWishStep.test.tsx
```

Expected: FAIL — cannot find module `@/components/steps/MakeAWishStep`.

- [ ] **Step 7: Create `src/components/steps/MakeAWishStep.tsx`**

```tsx
'use client'

import { useCandle } from '@/hooks/useCandle'

interface MakeAWishStepProps {
  cakeMessage: string
}

export function MakeAWishStep({ cakeMessage }: MakeAWishStepProps) {
  const { blownOut, blow } = useCandle()

  return (
    <div className="flex flex-col items-center gap-6 p-6 text-center">
      <h2 className="font-script text-3xl text-pink-600">Make a wish...</h2>
      <div className="text-6xl">🎂</div>
      <button
        onClick={blow}
        aria-label="Blow out the candle"
        className="text-4xl"
        disabled={blownOut}
      >
        {blownOut ? '🌫️' : '🕯️'}
      </button>
      {blownOut && <p className="text-lg text-pink-700">{cakeMessage}</p>}
    </div>
  )
}
```

- [ ] **Step 8: Run test to verify it passes**

```bash
npx vitest run src/components/steps/__tests__/MakeAWishStep.test.tsx
```

Expected: PASS (2 tests).

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Add candle hook and make-a-wish step"
```

---

### Task 11: Love-toggle hook and step

**Files:**
- Create: `src/hooks/useLoveToggle.ts`
- Create: `src/components/steps/LoveYouMoreStep.tsx`
- Test: `src/hooks/__tests__/useLoveToggle.test.ts`
- Test: `src/components/steps/__tests__/LoveYouMoreStep.test.tsx`

- [ ] **Step 1: Write the failing hook test**

`src/hooks/__tests__/useLoveToggle.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLoveToggle } from '@/hooks/useLoveToggle'

describe('useLoveToggle', () => {
  it('starts on the first phrase', () => {
    const { result } = renderHook(() => useLoveToggle())
    expect(result.current.phrase).toBe('Love you')
    expect(result.current.isMaxed).toBe(false)
  })

  it('bumps to the next phrase', () => {
    const { result } = renderHook(() => useLoveToggle())
    act(() => result.current.bump())
    expect(result.current.phrase).toBe('Love you more')
  })

  it('caps at the last phrase', () => {
    const { result } = renderHook(() => useLoveToggle())
    act(() => result.current.bump())
    act(() => result.current.bump())
    act(() => result.current.bump())
    act(() => result.current.bump())
    expect(result.current.phrase).toBe('Not possible, I win')
    expect(result.current.isMaxed).toBe(true)
  })

  it('restarts back to the first phrase', () => {
    const { result } = renderHook(() => useLoveToggle())
    act(() => result.current.bump())
    act(() => result.current.restart())
    expect(result.current.phrase).toBe('Love you')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/hooks/__tests__/useLoveToggle.test.ts
```

Expected: FAIL — cannot find module `@/hooks/useLoveToggle`.

- [ ] **Step 3: Create `src/hooks/useLoveToggle.ts`**

```ts
import { useState } from 'react'

const PHRASES = ['Love you', 'Love you more', 'No, I love YOU more', 'Not possible, I win']

export function useLoveToggle() {
  const [index, setIndex] = useState(0)

  function bump() {
    setIndex((i) => Math.min(i + 1, PHRASES.length - 1))
  }

  function restart() {
    setIndex(0)
  }

  return { phrase: PHRASES[index], isMaxed: index === PHRASES.length - 1, bump, restart }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/hooks/__tests__/useLoveToggle.test.ts
```

Expected: PASS (4 tests).

- [ ] **Step 5: Write the failing component test**

`src/components/steps/__tests__/LoveYouMoreStep.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LoveYouMoreStep } from '@/components/steps/LoveYouMoreStep'

describe('LoveYouMoreStep', () => {
  it('shows the starting phrase and a restart button', () => {
    render(<LoveYouMoreStep />)
    expect(screen.getByText('Love you')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '< Restart >' })).toBeInTheDocument()
  })

  it('advances the phrase when tapped', () => {
    render(<LoveYouMoreStep />)
    fireEvent.click(screen.getByText('Love you'))
    expect(screen.getByText('Love you more')).toBeInTheDocument()
  })

  it('restarts back to the first phrase', () => {
    render(<LoveYouMoreStep />)
    fireEvent.click(screen.getByText('Love you'))
    fireEvent.click(screen.getByRole('button', { name: '< Restart >' }))
    expect(screen.getByText('Love you')).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run test to verify it fails**

```bash
npx vitest run src/components/steps/__tests__/LoveYouMoreStep.test.tsx
```

Expected: FAIL — cannot find module `@/components/steps/LoveYouMoreStep`.

- [ ] **Step 7: Create `src/components/steps/LoveYouMoreStep.tsx`**

```tsx
'use client'

import { useLoveToggle } from '@/hooks/useLoveToggle'

export function LoveYouMoreStep() {
  const { phrase, bump, restart } = useLoveToggle()

  return (
    <div className="flex flex-col items-center gap-6 p-6 text-center">
      <button
        onClick={bump}
        className="rounded-2xl border-4 border-white bg-pink-400 px-8 py-6 text-2xl font-bold text-white shadow-lg"
      >
        {phrase} 💕
      </button>
      <button onClick={restart} className="text-sm text-pink-600 underline">
        &lt; Restart &gt;
      </button>
    </div>
  )
}
```

- [ ] **Step 8: Run test to verify it passes**

```bash
npx vitest run src/components/steps/__tests__/LoveYouMoreStep.test.tsx
```

Expected: PASS (3 tests).

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Add love-toggle hook and step"
```

---

### Task 12: Passcode step

**Files:**
- Create: `src/components/steps/PasscodeStep.tsx`
- Test: `src/components/steps/__tests__/PasscodeStep.test.tsx`

- [ ] **Step 1: Write the failing test**

`src/components/steps/__tests__/PasscodeStep.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PasscodeStep } from '@/components/steps/PasscodeStep'

describe('PasscodeStep', () => {
  it('renders a heart-shaped keypad and an empty code display', () => {
    render(<PasscodeStep expected="0610" onSuccess={() => {}} />)
    expect(screen.getByText('Enter a passcode')).toBeInTheDocument()
    for (const digit of ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']) {
      expect(screen.getByRole('button', { name: digit })).toBeInTheDocument()
    }
  })

  it('calls onSuccess when the correct 4-digit code is entered', () => {
    let succeeded = false
    render(<PasscodeStep expected="0610" onSuccess={() => (succeeded = true)} />)
    for (const digit of ['0', '6', '1', '0']) {
      fireEvent.click(screen.getByRole('button', { name: digit }))
    }
    expect(succeeded).toBe(true)
  })

  it('shows an error and clears the input for a wrong code', () => {
    let succeeded = false
    render(<PasscodeStep expected="0610" onSuccess={() => (succeeded = true)} />)
    for (const digit of ['1', '1', '1', '1']) {
      fireEvent.click(screen.getByRole('button', { name: digit }))
    }
    expect(succeeded).toBe(false)
    expect(screen.getByText('Not quite — try again')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/components/steps/__tests__/PasscodeStep.test.tsx
```

Expected: FAIL — cannot find module `@/components/steps/PasscodeStep`.

- [ ] **Step 3: Create `src/components/steps/PasscodeStep.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { isPasscodeCorrect } from '@/lib/passcode'

interface PasscodeStepProps {
  expected: string
  onSuccess: () => void
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#']

export function PasscodeStep({ expected, onSuccess }: PasscodeStepProps) {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  function pressKey(key: string) {
    if (key === '*' || key === '#') return
    if (input.length >= expected.length) return

    const next = input + key
    setInput(next)
    setError(false)

    if (next.length === expected.length) {
      if (isPasscodeCorrect(next, expected)) {
        onSuccess()
      } else {
        setError(true)
        setInput('')
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 text-center">
      <p className="font-script text-2xl text-pink-600">Enter a passcode</p>
      <div className="flex gap-2">
        {Array.from({ length: expected.length }).map((_, i) => (
          <div key={i} className="h-10 w-10 rounded border-2 border-pink-400">
            {input[i] ? '•' : ''}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {KEYS.map((key) => (
          <button
            key={key}
            aria-label={key}
            onClick={() => pressKey(key)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-200 text-lg text-pink-700"
          >
            {key}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-500">Not quite — try again</p>}
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/components/steps/__tests__/PasscodeStep.test.tsx
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add passcode step"
```

---

### Task 13: Letter step (shared by letter1 and finalLetter)

**Files:**
- Create: `src/components/steps/LetterStep.tsx`
- Test: `src/components/steps/__tests__/LetterStep.test.tsx`

- [ ] **Step 1: Write the failing test**

`src/components/steps/__tests__/LetterStep.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LetterStep } from '@/components/steps/LetterStep'

describe('LetterStep', () => {
  it('renders a title, body, and photo when given', () => {
    render(<LetterStep title="For you" body="Some heartfelt text." photo="/images/letter1.jpg" />)
    expect(screen.getByText('For you')).toBeInTheDocument()
    expect(screen.getByText('Some heartfelt text.')).toBeInTheDocument()
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('renders without a title or photo for the final letter', () => {
    render(<LetterStep body="Closing message." cta="Come find me." />)
    expect(screen.getByText('Closing message.')).toBeInTheDocument()
    expect(screen.getByText('Come find me.')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/components/steps/__tests__/LetterStep.test.tsx
```

Expected: FAIL — cannot find module `@/components/steps/LetterStep`.

- [ ] **Step 3: Create `src/components/steps/LetterStep.tsx`**

```tsx
import { PhotoFrame } from '@/components/PhotoFrame'

interface LetterStepProps {
  title?: string
  body: string
  photo?: string
  cta?: string
}

export function LetterStep({ title, body, photo, cta }: LetterStepProps) {
  return (
    <div className="flex flex-col items-center gap-4 p-6 text-center">
      {title && <h2 className="font-script text-3xl text-pink-600">{title}</h2>}
      {photo && <PhotoFrame src={photo} alt={title ?? 'letter photo'} className="h-40 w-40 object-cover" />}
      <p className="max-w-md text-lg leading-relaxed text-pink-800">{body}</p>
      {cta && <p className="text-xl font-bold text-pink-600">{cta}</p>}
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/components/steps/__tests__/LetterStep.test.tsx
```

Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add shared letter step"
```

---

### Task 14: Photo collage and favorite person steps

**Files:**
- Create: `src/components/steps/PhotoCollageStep.tsx`
- Create: `src/components/steps/FavoritePersonStep.tsx`
- Test: `src/components/steps/__tests__/PhotoCollageStep.test.tsx`
- Test: `src/components/steps/__tests__/FavoritePersonStep.test.tsx`

- [ ] **Step 1: Write the failing tests**

`src/components/steps/__tests__/PhotoCollageStep.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PhotoCollageStep } from '@/components/steps/PhotoCollageStep'

describe('PhotoCollageStep', () => {
  it('renders the caption and one image per photo', () => {
    render(<PhotoCollageStep caption="together" photos={['/a.jpg', '/b.jpg', '/c.jpg']} />)
    expect(screen.getByText('together')).toBeInTheDocument()
    expect(screen.getAllByRole('img')).toHaveLength(3)
  })
})
```

`src/components/steps/__tests__/FavoritePersonStep.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FavoritePersonStep } from '@/components/steps/FavoritePersonStep'

describe('FavoritePersonStep', () => {
  it('renders the caption and photo', () => {
    render(<FavoritePersonStep caption="Favorite person" photo="/a.jpg" />)
    expect(screen.getByText('Favorite person')).toBeInTheDocument()
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/components/steps/__tests__/PhotoCollageStep.test.tsx src/components/steps/__tests__/FavoritePersonStep.test.tsx
```

Expected: both FAIL — modules not found.

- [ ] **Step 3: Create `src/components/steps/PhotoCollageStep.tsx`**

```tsx
import { PhotoFrame } from '@/components/PhotoFrame'

interface PhotoCollageStepProps {
  caption: string
  photos: string[]
}

export function PhotoCollageStep({ caption, photos }: PhotoCollageStepProps) {
  return (
    <div className="flex flex-col items-center gap-4 p-6 text-center">
      <div className="grid grid-cols-2 gap-3">
        {photos.map((photo, i) => (
          <PhotoFrame key={photo} src={photo} alt={`memory ${i + 1}`} className="h-32 w-32 object-cover" />
        ))}
      </div>
      <p className="font-script text-2xl text-pink-600">{caption}</p>
    </div>
  )
}
```

- [ ] **Step 4: Create `src/components/steps/FavoritePersonStep.tsx`**

```tsx
import { PhotoFrame } from '@/components/PhotoFrame'

interface FavoritePersonStepProps {
  caption: string
  photo: string
}

export function FavoritePersonStep({ caption, photo }: FavoritePersonStepProps) {
  return (
    <div className="bg-gingham flex flex-col items-center gap-4 p-6 text-center">
      <PhotoFrame src={photo} alt={caption} className="h-56 w-56 border-8 border-white object-cover shadow-lg" />
      <p className="font-script text-2xl text-pink-700">{caption}</p>
    </div>
  )
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npx vitest run src/components/steps/__tests__/PhotoCollageStep.test.tsx src/components/steps/__tests__/FavoritePersonStep.test.tsx
```

Expected: both PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Add photo collage and favorite person steps"
```

---

### Task 15: StepShell (progress dots + Next/Back navigation)

**Files:**
- Create: `src/components/StepShell.tsx`
- Test: `src/components/__tests__/StepShell.test.tsx`

- [ ] **Step 1: Write the failing test**

`src/components/__tests__/StepShell.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StepShell } from '@/components/StepShell'

describe('StepShell', () => {
  it('renders one dot per total step, highlighting the current one', () => {
    render(
      <StepShell currentIndex={2} totalSteps={9} canGoBack canGoNext onBack={() => {}} onNext={() => {}}>
        <p>content</p>
      </StepShell>,
    )
    expect(screen.getAllByTestId('step-dot')).toHaveLength(9)
    expect(screen.getAllByTestId('step-dot')[2]).toHaveAttribute('data-active', 'true')
  })

  it('hides Back on the first step and calls onNext when Next is clicked', () => {
    let nextCalled = false
    render(
      <StepShell
        currentIndex={0}
        totalSteps={9}
        canGoBack={false}
        canGoNext
        onBack={() => {}}
        onNext={() => (nextCalled = true)}
      >
        <p>content</p>
      </StepShell>,
    )
    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(nextCalled).toBe(true)
  })

  it('hides Next on the last step', () => {
    render(
      <StepShell
        currentIndex={8}
        totalSteps={9}
        canGoBack
        canGoNext={false}
        onBack={() => {}}
        onNext={() => {}}
      >
        <p>content</p>
      </StepShell>,
    )
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/components/__tests__/StepShell.test.tsx
```

Expected: FAIL — cannot find module `@/components/StepShell`.

- [ ] **Step 3: Create `src/components/StepShell.tsx`**

```tsx
import type { ReactNode } from 'react'

interface StepShellProps {
  currentIndex: number
  totalSteps: number
  canGoBack: boolean
  canGoNext: boolean
  onBack: () => void
  onNext: () => void
  children: ReactNode
}

export function StepShell({ currentIndex, totalSteps, canGoBack, canGoNext, onBack, onNext, children }: StepShellProps) {
  return (
    <div className="flex min-h-screen flex-col justify-between">
      <div className="flex justify-center gap-2 pt-4">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <span
            key={i}
            data-testid="step-dot"
            data-active={i === currentIndex}
            className={`h-2 w-2 rounded-full ${i === currentIndex ? 'bg-pink-500' : 'bg-pink-200'}`}
          />
        ))}
      </div>

      <div className="flex-1">{children}</div>

      <div className="flex justify-between p-6">
        {canGoBack ? (
          <button onClick={onBack} className="rounded-full bg-white px-5 py-2 text-pink-600 shadow">
            Back
          </button>
        ) : (
          <span />
        )}
        {canGoNext && (
          <button onClick={onNext} className="rounded-full bg-pink-500 px-5 py-2 text-white shadow">
            Next
          </button>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/components/__tests__/StepShell.test.tsx
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add StepShell navigation wrapper"
```

---

### Task 16: Fonts, global styles, and gingham utility

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Dancing_Script, Quicksand } from 'next/font/google'
import './globals.css'

const script = Dancing_Script({ subsets: ['latin'], variable: '--font-script' })
const body = Quicksand({ subsets: ['latin'], variable: '--font-body' })

export const metadata: Metadata = {
  title: 'For you',
  description: 'A little something for your birthday.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${script.variable} ${body.variable} font-sans bg-pink-50`}>{children}</body>
    </html>
  )
}
```

- [ ] **Step 2: Add the script font and gingham utility to `src/app/globals.css`**

Add these rules at the end of the existing file (keep the existing `@import "tailwindcss";` line at the top as-is):

```css
.font-script {
  font-family: var(--font-script);
}

.bg-gingham {
  background-color: #fff;
  background-image:
    linear-gradient(45deg, #fbcfe8 25%, transparent 25%),
    linear-gradient(-45deg, #fbcfe8 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #fbcfe8 75%),
    linear-gradient(-45deg, transparent 75%, #fbcfe8 75%);
  background-size: 40px 40px;
  background-position: 0 0, 0 20px, 20px -20px, -20px 0px;
}
```

- [ ] **Step 3: Verify the app still builds**

```bash
npm run build
```

Expected: build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add fonts and gingham background style"
```

---

### Task 17: Wire up the root page

**Files:**
- Modify: `src/app/page.tsx`
- Test: `src/app/__tests__/page.test.tsx`

- [ ] **Step 1: Write the failing integration test**

`src/app/__tests__/page.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Page from '@/app/page'
import { siteContent } from '@/content/site'

function enterPasscode() {
  for (const digit of siteContent.passcode.split('')) {
    fireEvent.click(screen.getByRole('button', { name: digit }))
  }
}

describe('Page', () => {
  it('starts on the passcode step', () => {
    render(<Page />)
    expect(screen.getByText('Enter a passcode')).toBeInTheDocument()
  })

  it('walks through the full flow to the final letter', () => {
    render(<Page />)
    enterPasscode()

    // letter1 -> photoCollage -> favoritePerson
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))

    // balloonPop: pop all 4 to auto-advance, then Next
    fireEvent.click(screen.getByRole('button', { name: 'Balloon 1' }))
    fireEvent.click(screen.getByRole('button', { name: 'Balloon 2' }))
    fireEvent.click(screen.getByRole('button', { name: 'Balloon 3' }))
    fireEvent.click(screen.getByRole('button', { name: 'Balloon 4' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))

    // giftChoice -> makeAWish
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))

    // makeAWish -> loveYouMore
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))

    // loveYouMore -> finalLetter
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))

    expect(screen.getByText(siteContent.finalLetter.cta)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/app/__tests__/page.test.tsx
```

Expected: FAIL — `Page` does not yet render the step flow.

- [ ] **Step 3: Replace `src/app/page.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { STEP_ORDER, nextStep, prevStep, canGoBack, canGoNext, stepIndex } from '@/lib/stepFlow'
import { siteContent } from '@/content/site'
import { StepShell } from '@/components/StepShell'
import { BackgroundAudio } from '@/components/BackgroundAudio'
import { PasscodeStep } from '@/components/steps/PasscodeStep'
import { LetterStep } from '@/components/steps/LetterStep'
import { PhotoCollageStep } from '@/components/steps/PhotoCollageStep'
import { FavoritePersonStep } from '@/components/steps/FavoritePersonStep'
import { BalloonPopStep } from '@/components/steps/BalloonPopStep'
import { GiftChoiceStep } from '@/components/steps/GiftChoiceStep'
import { MakeAWishStep } from '@/components/steps/MakeAWishStep'
import { LoveYouMoreStep } from '@/components/steps/LoveYouMoreStep'

export default function Page() {
  const [step, setStep] = useState<(typeof STEP_ORDER)[number]>('passcode')

  function goNext() {
    setStep((current) => nextStep(current))
  }

  function goBack() {
    setStep((current) => prevStep(current))
  }

  if (step === 'passcode') {
    return <PasscodeStep expected={siteContent.passcode} onSuccess={goNext} />
  }

  return (
    <>
      <BackgroundAudio src={siteContent.songSrc} />
      <StepShell
        currentIndex={stepIndex(step)}
        totalSteps={STEP_ORDER.length}
        canGoBack={canGoBack(step)}
        canGoNext={canGoNext(step)}
        onBack={goBack}
        onNext={goNext}
      >
        {step === 'letter1' && (
          <LetterStep title={siteContent.letter1.title} body={siteContent.letter1.body} photo={siteContent.letter1.photo} />
        )}
        {step === 'photoCollage' && (
          <PhotoCollageStep caption={siteContent.photoCollage.caption} photos={siteContent.photoCollage.photos} />
        )}
        {step === 'favoritePerson' && (
          <FavoritePersonStep caption={siteContent.favoritePerson.caption} photo={siteContent.favoritePerson.photo} />
        )}
        {step === 'balloonPop' && (
          <BalloonPopStep revealPhrases={siteContent.balloonPop.revealPhrases} onAllPopped={() => {}} />
        )}
        {step === 'giftChoice' && <GiftChoiceStep yesRevealText={siteContent.giftChoice.yesRevealText} />}
        {step === 'makeAWish' && <MakeAWishStep cakeMessage={siteContent.makeAWish.cakeMessage} />}
        {step === 'loveYouMore' && <LoveYouMoreStep />}
        {step === 'finalLetter' && (
          <LetterStep body={siteContent.finalLetter.body} cta={siteContent.finalLetter.cta} />
        )}
      </StepShell>
    </>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/app/__tests__/page.test.tsx
```

Expected: PASS (2 tests).

- [ ] **Step 5: Run the full test suite**

```bash
npm test
```

Expected: all tests across every file pass.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Wire up root page with full step flow"
```

---

### Task 18: Manual verification and README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create `README.md`**

```markdown
# Birthday Website

A private, passcode-gated birthday website. See `docs/superpowers/specs/2026-09-18-birthday-website-design.md` for the full design.

## Running locally

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use
npm install
npm run dev
```

Open http://localhost:3000.

## Filling in real content

Edit `src/content/site.ts`:
- `recipientName`, `passcode` — passcode is whatever digits you choose (currently 4 digits; PasscodeStep adapts to any length in `expected`).
- `letter1`, `photoCollage`, `favoritePerson`, `balloonPop`, `giftChoice`, `makeAWish`, `finalLetter` — all copy and photo paths.

Add real photos to `public/images/` matching the paths used in `site.ts`. If a photo is missing, the page shows a "📷 add photo" placeholder instead of crashing, so you can fill these in incrementally.

Add a song file to `public/audio/song.mp3` (referenced by `songSrc`). If missing, the mute/unmute control simply does not render.

## Running tests

```bash
npm test
```

## Deploying

Deploy to Vercel and keep the resulting URL unlisted/private — the in-app passcode is a UX flourish, not real security; the actual privacy boundary is not sharing the link.
```

- [ ] **Step 2: Run the dev server and manually click through every step**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use
npm run dev
```

Open http://localhost:3000 in a browser, resize to a phone width (or use devtools device emulation), and manually verify:
- Passcode keypad accepts digits and rejects a wrong code with the error message, then accepts the correct code.
- Every step's Next/Back buttons work and the progress dots update.
- Balloon pop reveals phrases and the step still requires pressing Next afterward.
- Gift choice's Yes reveals the message; No cycles through its playful labels.
- Make-a-wish's candle blows out and reveals the message.
- Love-you-more's button advances phrases and Restart resets it.
- The final letter shows the CTA text and there is no Next button after it.
- With no real photos/audio added yet, placeholders render instead of broken images or console errors.

- [ ] **Step 3: Run the full test suite one final time**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add README with content and deployment instructions"
```

---

## Self-Review Notes

- **Spec coverage:** all 9 steps from the spec (passcode, letter1, photoCollage, favoritePerson, balloonPop, giftChoice, makeAWish, loveYouMore, finalLetter) have a task; content model matches `SiteContent`; missing-photo and missing-audio edge cases from the spec are implemented via `PhotoFrame` and `BackgroundAudio`'s `onError` handling; mobile-first is addressed via Tailwind flex/grid layouts and manual phone-width verification in Task 18.
- **Type consistency:** `StepId`/`STEP_ORDER` (Task 4) are the single source of truth for step names and are reused as-is in Task 17's `page.tsx`; `SiteContent` fields (Task 3) match the props each step component expects in Tasks 12–14 and 17.
- **Deferred to content-fill time, not implementation:** the actual passcode digits, her name, real photos, and the final song file — these are content decisions for Rahul to make before sending the link, not implementation ambiguities (see README, Task 18).
