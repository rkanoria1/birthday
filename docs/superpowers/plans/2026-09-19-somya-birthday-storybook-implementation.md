# Somya Birthday Storybook Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing birthday prototype into a polished, mobile-first storybook celebrating Somya, ending with the real-world “find your Chandler” reveal.

**Architecture:** Keep a single client-side story controller over a typed, ordered chapter list. Content remains local and typed; focused chapter components own presentation, while small hooks own interactive state and shared components own photography, navigation, sound, and accessibility behavior.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Framer Motion 13, Vitest, React Testing Library

**Spec:** `docs/superpowers/specs/2026-09-19-somya-birthday-storybook-design.md`

## Global Constraints

- The birthday date is October 6, 2026.
- Phone is the primary layout; support 320 px without horizontal overflow.
- Use `#FFF9F5`, `#F7DDE4`, `#D92F4C`, `#591C2D`, `#33272B`, and `#C8A46A` as the core palette.
- Main-story photographs show Somya; use approximately 12–15 in the main journey and place remaining photographs in the optional epilogue.
- The *Friends* reference appears only in the final call to action.
- Tap-to-blow must work without microphone permission; microphone support is progressive enhancement only.
- Motion must respect `prefers-reduced-motion`.
- Audio must begin only after user interaction and must never block the story.
- Keep all authored copy, photo metadata, passcode, and audio metadata in `src/content/site.ts`.
- No backend, database, analytics, account system, or persistent story progress.
- Before editing Next.js code, read the relevant local guides in `node_modules/next/dist/docs/01-app/` plus `03-architecture/accessibility.md` as required by `AGENTS.md`.

---

## File Structure

```text
src/
  app/
    globals.css                         # tokens, global texture, utilities, reduced motion
    layout.tsx                          # fonts and page metadata
    page.tsx                            # story controller and chapter rendering
  components/
    BackgroundAudio.tsx                 # session-scoped sound control
    StoryShell.tsx                      # shared progress and navigation
    StoryImage.tsx                      # optimized image with focal crop and fallback
    EpilogueGallery.tsx                 # accessible lightbox/gallery
    illustrations/
      Balloon.tsx                       # CSS/SVG balloon artwork
      BirthdayCake.tsx                  # CSS/SVG cake and candle artwork
    chapters/
      PasscodeChapter.tsx               # sealed-letter entry
      BirthdayHeroChapter.tsx           # opening portrait
      PhotoMosaicChapter.tsx            # editorial image mosaic
      ObservationsChapter.tsx           # handwritten observations
      BalloonChapter.tsx                # four-quality reveal
      WishChapter.tsx                   # candle interaction
      MeaningChapter.tsx                # central letter
      FutureChapter.tsx                 # fold-open future note
      FinalLetterChapter.tsx            # closing and epilogue entry
  content/
    types.ts                            # complete content contracts
    site.ts                             # all authored site data
    __tests__/site.test.ts              # content invariants
  hooks/
    useBalloonPop.ts                    # retained balloon state
    useCandle.ts                        # candle state plus optional microphone state
    useEpilogueGallery.ts               # gallery state and keyboard-safe navigation
    __tests__/useCandle.test.ts
    __tests__/useEpilogueGallery.test.ts
  lib/
    storyFlow.ts                        # ordered chapters and pure navigation helpers
    __tests__/storyFlow.test.ts
```

Delete obsolete chapter components and hooks only in the final integration task,
after their replacements pass tests.

---

### Task 1: Define the story content contract and chapter flow

**Files:**
- Modify: `src/content/types.ts`
- Modify: `src/content/site.ts`
- Create: `src/content/__tests__/site.test.ts`
- Create: `src/lib/storyFlow.ts`
- Create: `src/lib/__tests__/storyFlow.test.ts`

**Interfaces:**
- Produces: `StoryImageData`, `SiteContent`, `STORY_ORDER`, `StoryId`, `nextStory`, `prevStory`, `storyIndex`, `canAdvance`, and `canRetreat`.
- Consumes: no new project interfaces.

- [ ] **Step 1: Write content and navigation tests**

```ts
// src/content/__tests__/site.test.ts
import { describe, expect, it } from 'vitest'
import { siteContent } from '@/content/site'

describe('siteContent', () => {
  it('identifies Somya and her birthday', () => {
    expect(siteContent.recipientName).toBe('Somya')
    expect(siteContent.birthday).toBe('2026-10-06')
  })

  it('has a numeric passcode and four balloon qualities', () => {
    expect(siteContent.passcode).toMatch(/^\d{4}$/)
    expect(siteContent.balloons.qualities).toHaveLength(4)
  })

  it('provides accessible metadata for every photograph', () => {
    const images = [
      siteContent.hero.image,
      ...siteContent.mosaic.images,
      ...siteContent.observations.map((item) => item.image),
      siteContent.meaning.image,
      ...siteContent.epilogue.images,
    ]
    expect(images.length).toBeGreaterThanOrEqual(12)
    expect(images.every((image) => image.src && image.alt)).toBe(true)
  })

  it('keeps the Friends reference in the final call to action only', () => {
    expect(siteContent.finalLetter.cta).toContain('Chandler')
    expect(JSON.stringify({
      hero: siteContent.hero,
      mosaic: siteContent.mosaic,
      observations: siteContent.observations,
      meaning: siteContent.meaning,
      future: siteContent.future,
    })).not.toContain('Chandler')
  })
})
```

```ts
// src/lib/__tests__/storyFlow.test.ts
import { describe, expect, it } from 'vitest'
import { STORY_ORDER, canAdvance, canRetreat, nextStory, prevStory } from '@/lib/storyFlow'

describe('storyFlow', () => {
  it('uses the approved chapter order', () => {
    expect(STORY_ORDER).toEqual([
      'passcode', 'hero', 'mosaic', 'observations', 'balloons',
      'wish', 'meaning', 'future', 'finalLetter',
    ])
  })

  it('clamps navigation at both ends', () => {
    expect(prevStory('passcode')).toBe('passcode')
    expect(nextStory('finalLetter')).toBe('finalLetter')
    expect(canRetreat('passcode')).toBe(false)
    expect(canAdvance('finalLetter')).toBe(false)
  })

  it('moves between adjacent chapters', () => {
    expect(nextStory('hero')).toBe('mosaic')
    expect(prevStory('mosaic')).toBe('hero')
  })
})
```

- [ ] **Step 2: Run the focused tests and verify failure**

Run: `npm test -- src/content/__tests__/site.test.ts src/lib/__tests__/storyFlow.test.ts`

Expected: FAIL because the new content fields and `storyFlow` module do not exist.

- [ ] **Step 3: Implement the typed content model**

Use these exact public types in `src/content/types.ts`:

```ts
export interface StoryImageData {
  src: string
  alt: string
  caption?: string
  date?: string
  focalPoint?: `${number}% ${number}%`
}

export interface ObservationData {
  text: string
  image: StoryImageData
}

export interface SiteContent {
  recipientName: string
  birthday: '2026-10-06'
  passcode: string
  passcodeHint: string
  audio: { src: string; title: string }
  hero: { kicker: string; title: string; image: StoryImageData }
  mosaic: { title: string; caption: string; images: StoryImageData[] }
  observations: ObservationData[]
  balloons: { title: string; qualities: [string, string, string, string] }
  wish: { title: string; message: string }
  meaning: { title: string; body: string; image: StoryImageData }
  future: { title: string; body: string; noteLabel: string }
  finalLetter: { body: string; cta: string }
  epilogue: { triggerLabel: string; images: StoryImageData[] }
}
```

Update `siteContent` to satisfy the interface. Use `/images/somya-01.jpg`
through `/images/somya-15.jpg` for the main story, `/images/somya-16.jpg`
through `/images/somya-30.jpg` for the epilogue, and specific draft alt text
such as `Somya smiling in a sunlit portrait`. Mark draft prose with an exported
`CONTENT_STATUS = 'draft' as const` rather than embedding markers in visible copy.

- [ ] **Step 4: Implement pure story navigation**

```ts
export const STORY_ORDER = [
  'passcode', 'hero', 'mosaic', 'observations', 'balloons',
  'wish', 'meaning', 'future', 'finalLetter',
] as const

export type StoryId = (typeof STORY_ORDER)[number]

export const storyIndex = (story: StoryId) => STORY_ORDER.indexOf(story)
export const nextStory = (story: StoryId): StoryId =>
  STORY_ORDER[Math.min(storyIndex(story) + 1, STORY_ORDER.length - 1)]
export const prevStory = (story: StoryId): StoryId =>
  STORY_ORDER[Math.max(storyIndex(story) - 1, 0)]
export const canAdvance = (story: StoryId) => story !== STORY_ORDER.at(-1)
export const canRetreat = (story: StoryId) => storyIndex(story) > 1
```

- [ ] **Step 5: Run the focused tests**

Run: `npm test -- src/content/__tests__/site.test.ts src/lib/__tests__/storyFlow.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/content src/lib/storyFlow.ts src/lib/__tests__/storyFlow.test.ts
git commit -m "feat: define Somya story content and flow"
```

---

### Task 2: Establish the visual foundation

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: global color variables, type variables, `.paper-texture`, `.chapter-frame`, `.focus-ring`, and reduced-motion defaults.
- Consumes: no project interfaces.

- [ ] **Step 1: Read the installed Next.js font, CSS, and accessibility guides**

Run:

```bash
sed -n '1,240p' node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md
sed -n '1,240p' node_modules/next/dist/docs/01-app/01-getting-started/11-css.md
sed -n '1,240p' node_modules/next/dist/docs/03-architecture/accessibility.md
```

Expected: local documentation is available and confirms App Router font and
global CSS conventions for the installed Next.js version.

- [ ] **Step 2: Replace generic global styling with the approved tokens**

In `globals.css`, define the six palette values as CSS custom properties, set
`color-scheme: light`, remove the automatic dark theme, add a subtle inline SVG
paper grain to `.paper-texture`, and add the shared chapter container:

```css
:root {
  --ivory: #fff9f5;
  --blush: #f7dde4;
  --cherry: #d92f4c;
  --burgundy: #591c2d;
  --ink: #33272b;
  --gold: #c8a46a;
}

body {
  min-width: 320px;
  background: var(--ivory);
  color: var(--ink);
  font-family: var(--font-body), sans-serif;
}

.chapter-frame {
  width: min(100%, 78rem);
  min-height: 100svh;
  margin-inline: auto;
  padding: clamp(1.25rem, 4vw, 4rem);
}

:focus-visible {
  outline: 3px solid var(--cherry);
  outline-offset: 4px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: Configure deliberate fonts and metadata**

Use an installed `next/font/google` editorial serif, readable sans, and
handwriting face in `layout.tsx`. Bind them to `--font-display`, `--font-body`,
and `--font-hand`. Set title to `For Somya — October 6, 2026` and description to
`A birthday story made for Somya.`

- [ ] **Step 4: Run static checks**

Run: `npm run lint && npm run build`

Expected: both exit 0; no unavailable font weight or metadata error.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "feat: establish birthday story visual system"
```

---

### Task 3: Build the responsive story image primitive

**Files:**
- Create: `src/components/StoryImage.tsx`
- Create: `src/components/__tests__/StoryImage.test.tsx`

**Interfaces:**
- Consumes: `StoryImageData` from `@/content/types`.
- Produces: `StoryImage({ image, className, priority, sizes, fill })`.

- [ ] **Step 1: Write image rendering and fallback tests**

Mock `next/image`, render a known image, assert its alt text and focal
`objectPosition`, then fire its error event and assert a `role="img"` fallback
with `aria-label="Photo unavailable: <alt>"`.

```tsx
expect(screen.getByAltText('Somya laughing')).toHaveStyle({ objectPosition: '40% 30%' })
fireEvent.error(screen.getByAltText('Somya laughing'))
expect(screen.getByRole('img', { name: 'Photo unavailable: Somya laughing' })).toBeInTheDocument()
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm test -- src/components/__tests__/StoryImage.test.tsx`

Expected: FAIL because `StoryImage` does not exist.

- [ ] **Step 3: Implement `StoryImage` using `next/image`**

Use local-path optimized images, `image.focalPoint ?? '50% 50%'`, an `onError`
state switch, and a neutral paper fallback. When `fill` is true, pass `fill` and
require the caller to provide a positioned container; otherwise use dimensions
of `1200 × 1500`. Forward `priority`, `sizes`, and `className`.

- [ ] **Step 4: Run the focused test and lint**

Run: `npm test -- src/components/__tests__/StoryImage.test.tsx && npm run lint`

Expected: PASS and lint exits 0.

- [ ] **Step 5: Commit**

```bash
git add src/components/StoryImage.tsx src/components/__tests__/StoryImage.test.tsx
git commit -m "feat: add responsive story image primitive"
```

---

### Task 4: Replace the shell and audio experience

**Files:**
- Create: `src/components/StoryShell.tsx`
- Modify: `src/components/BackgroundAudio.tsx`
- Create: `src/components/__tests__/StoryShell.test.tsx`
- Create: `src/components/__tests__/BackgroundAudio.test.tsx`

**Interfaces:**
- Consumes: `StoryId`, numeric index/total, navigation callbacks, and audio `{ src, title }`.
- Produces: responsive shell, contextual Back/Continue controls, restrained progress bar, and sound toggle.

- [ ] **Step 1: Write shell behavior tests**

Assert that the shell renders `Chapter 2 of 9`, applies progress width via
`aria-valuenow`, invokes Back/Continue callbacks, hides Back when disabled, and
hides Continue on the final chapter.

- [ ] **Step 2: Write audio behavior tests**

Mock `HTMLMediaElement.prototype.play`. Assert the button begins with accessible
name `Play <title>`, calls `play()` after a click, changes its name to
`Pause <title>`, and disappears after an audio error.

- [ ] **Step 3: Run the focused tests and verify failure**

Run: `npm test -- src/components/__tests__/StoryShell.test.tsx src/components/__tests__/BackgroundAudio.test.tsx`

Expected: FAIL because the new shell and audio contract are absent.

- [ ] **Step 4: Implement `StoryShell`**

Use a fixed-height 2 px progress track with `role="progressbar"`, a quiet header
containing `For Somya`, and a bottom navigation area that remains in normal flow
on small screens. Buttons must use minimum height `44px`. Accept an optional
`continueLabel` defaulting to `Continue`.

- [ ] **Step 5: Refactor `BackgroundAudio`**

Remove `autoPlay` and emoji. Initialize paused. On click, call `play()` or
`pause()`, catch rejected play promises by returning to paused state, store the
playing preference in `sessionStorage` under `somya-story-audio`, and render a
small text-and-icon control. Do not automatically resume on mount because that
would violate browser gesture rules.

- [ ] **Step 6: Run focused tests and lint**

Run: `npm test -- src/components/__tests__/StoryShell.test.tsx src/components/__tests__/BackgroundAudio.test.tsx && npm run lint`

Expected: PASS and lint exits 0.

- [ ] **Step 7: Commit**

```bash
git add src/components/StoryShell.tsx src/components/BackgroundAudio.tsx src/components/__tests__
git commit -m "feat: add story shell and intentional audio controls"
```

---

### Task 5: Create the sealed-letter entry and birthday hero

**Files:**
- Create: `src/components/chapters/PasscodeChapter.tsx`
- Create: `src/components/chapters/BirthdayHeroChapter.tsx`
- Create: `src/components/chapters/__tests__/PasscodeChapter.test.tsx`

**Interfaces:**
- Consumes: passcode, hint, recipient name, hero content, `StoryImage`, and `onUnlock`.
- Produces: ceremonial unlock event and the opening portrait chapter.

- [ ] **Step 1: Write passcode interaction tests**

Test numeric entry, correct-code `onUnlock`, wrong-code clearing, error message,
retained keypad focus, and ignored decorative keys. Keep the existing pure
`isPasscodeCorrect` tests.

- [ ] **Step 2: Run the passcode test and verify failure**

Run: `npm test -- src/components/chapters/__tests__/PasscodeChapter.test.tsx`

Expected: FAIL because `PasscodeChapter` does not exist.

- [ ] **Step 3: Implement `PasscodeChapter`**

Render a semantic heading `A letter for Somya`, a closed envelope built with
CSS shapes, the hint, four status cells, and a 3-column numeric keypad. Use
Framer Motion only for wrong-code shake and successful envelope opening. Check
`useReducedMotion()` and replace transforms with an opacity change when reduced
motion is requested. Place the blurred hero image behind the letter with
`aria-hidden="true"`; reveal the unblurred image only after success.

- [ ] **Step 4: Implement `BirthdayHeroChapter`**

Render the priority-loaded hero portrait, approved kicker, name, and localized
`6 October 2026` date. On desktop use an asymmetric 5/7 text/image split; on
mobile let the portrait occupy approximately 62svh above the short message.

- [ ] **Step 5: Run focused tests and lint**

Run: `npm test -- src/components/chapters/__tests__/PasscodeChapter.test.tsx && npm run lint`

Expected: PASS and lint exits 0.

- [ ] **Step 6: Commit**

```bash
git add src/components/chapters/PasscodeChapter.tsx src/components/chapters/BirthdayHeroChapter.tsx src/components/chapters/__tests__/PasscodeChapter.test.tsx
git commit -m "feat: create sealed letter and birthday opening"
```

---

### Task 6: Build the photo mosaic and personal observations

**Files:**
- Create: `src/components/chapters/PhotoMosaicChapter.tsx`
- Create: `src/components/chapters/ObservationsChapter.tsx`
- Create: `src/components/chapters/__tests__/PhotoMosaicChapter.test.tsx`

**Interfaces:**
- Consumes: mosaic content, `ObservationData[]`, and `StoryImage`.
- Produces: responsive editorial collage and observation-note composition.

- [ ] **Step 1: Write a mosaic semantics test**

Render six images and assert one chapter heading, six accessible photographs,
the supplied caption, and a list containing six items. Do not test CSS geometry
in jsdom.

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm test -- src/components/chapters/__tests__/PhotoMosaicChapter.test.tsx`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the mosaic**

Use CSS Grid with intentionally varied spans through `nth-child` selectors.
Use a two-column mobile grid and a twelve-column desktop grid. The lead image
occupies more area than the others. Maintain DOM order, do not overlap faces,
and pass responsive `sizes` strings to `StoryImage`.

- [ ] **Step 4: Implement observations**

Render each observation as a semantic list item pairing one photograph and one
short handwritten note. Alternate image/text alignment only above the tablet
breakpoint; mobile reading order always remains image then note. Add restrained
tape marks with pseudo-elements marked decorative by virtue of CSS.

- [ ] **Step 5: Run focused tests and lint**

Run: `npm test -- src/components/chapters/__tests__/PhotoMosaicChapter.test.tsx && npm run lint`

Expected: PASS and lint exits 0.

- [ ] **Step 6: Commit**

```bash
git add src/components/chapters/PhotoMosaicChapter.tsx src/components/chapters/ObservationsChapter.tsx src/components/chapters/__tests__/PhotoMosaicChapter.test.tsx
git commit -m "feat: add Somya photo mosaic and observations"
```

---

### Task 7: Redesign the balloon-quality interaction

**Files:**
- Create: `src/components/illustrations/Balloon.tsx`
- Create: `src/components/chapters/BalloonChapter.tsx`
- Create: `src/components/chapters/__tests__/BalloonChapter.test.tsx`
- Modify: `src/hooks/useBalloonPop.ts`

**Interfaces:**
- Consumes: `[string, string, string, string]` qualities and `useBalloonPop(4)`.
- Produces: keyboard-accessible balloon buttons and an all-complete announcement.

- [ ] **Step 1: Write interaction tests**

Render four qualities. Assert four buttons named `Reveal quality 1` through
`Reveal quality 4`; click one and assert its quality appears; activate all and
assert `Four beautiful things about you` appears in a polite live region.

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm test -- src/components/chapters/__tests__/BalloonChapter.test.tsx`

Expected: FAIL because `BalloonChapter` does not exist.

- [ ] **Step 3: Implement custom balloon artwork**

Build the balloon from semantic-free SVG inside a native button. Use a unique
burgundy, blush, cherry, or gold fill based on index. The popped state replaces
the balloon with its text in the same layout slot, preventing layout jumps.

- [ ] **Step 4: Implement the chapter and harden the hook**

Render a two-by-two composition on mobile and four columns on desktop. Update
`pop(index)` to ignore indices below zero or greater than/equal to `total`.
Animate scale only when reduced motion is not requested.

- [ ] **Step 5: Run component and hook tests**

Run: `npm test -- src/components/chapters/__tests__/BalloonChapter.test.tsx src/hooks/__tests__/useBalloonPop.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/illustrations/Balloon.tsx src/components/chapters/BalloonChapter.tsx src/components/chapters/__tests__/BalloonChapter.test.tsx src/hooks/useBalloonPop.ts
git commit -m "feat: reveal Somya qualities with illustrated balloons"
```

---

### Task 8: Create the accessible candle wish

**Files:**
- Create: `src/components/illustrations/BirthdayCake.tsx`
- Create: `src/components/chapters/WishChapter.tsx`
- Modify: `src/hooks/useCandle.ts`
- Modify: `src/hooks/__tests__/useCandle.test.ts`
- Create: `src/components/chapters/__tests__/WishChapter.test.tsx`

**Interfaces:**
- Produces: `useCandle()` with `blownOut`, `microphoneState`, `blow`, `relight`, and `enableMicrophone`.
- Consumes: wish title/message and browser `navigator.mediaDevices` when available.

- [ ] **Step 1: Expand hook tests**

Keep existing state tests and add cases for unsupported media devices and a
rejected `getUserMedia()` promise. Both must set `microphoneState` to
`'unavailable'` without changing `blownOut`.

- [ ] **Step 2: Write the chapter fallback test**

Render the chapter, click `Blow out the candle`, assert the flame is absent,
and assert the supplied birthday message appears. Also assert a microphone
button is absent when `mediaDevices` is unavailable.

- [ ] **Step 3: Run focused tests and verify failure**

Run: `npm test -- src/hooks/__tests__/useCandle.test.ts src/components/chapters/__tests__/WishChapter.test.tsx`

Expected: FAIL because the microphone contract and chapter do not exist.

- [ ] **Step 4: Implement the candle hook**

Use `type MicrophoneState = 'idle' | 'listening' | 'unavailable'`. Request audio
only inside `enableMicrophone`. If granted, create an `AudioContext` analyser,
sample average frequency data, call `blow()` after a documented threshold is
exceeded for two frames, stop every media track, and close the context. On
unsupported, rejected, or runtime error, stop resources and set unavailable.
Return a cleanup function from the internal effect.

- [ ] **Step 5: Implement cake artwork and chapter**

Create the cake with CSS/SVG shapes in the approved palette. Render a native
button labeled `Blow out the candle` around the candle area. Offer `Try blowing
into the microphone` only when `navigator.mediaDevices?.getUserMedia` exists;
explain permission immediately above that button. The tap action is always
visible. Reveal the message in `aria-live="polite"`.

- [ ] **Step 6: Run focused tests and lint**

Run: `npm test -- src/hooks/__tests__/useCandle.test.ts src/components/chapters/__tests__/WishChapter.test.tsx && npm run lint`

Expected: PASS and lint exits 0.

- [ ] **Step 7: Commit**

```bash
git add src/hooks/useCandle.ts src/hooks/__tests__/useCandle.test.ts src/components/illustrations/BirthdayCake.tsx src/components/chapters/WishChapter.tsx src/components/chapters/__tests__/WishChapter.test.tsx
git commit -m "feat: add accessible birthday candle wish"
```

---

### Task 9: Build the emotional chapters and final reveal

**Files:**
- Create: `src/components/chapters/MeaningChapter.tsx`
- Create: `src/components/chapters/FutureChapter.tsx`
- Create: `src/components/chapters/FinalLetterChapter.tsx`
- Create: `src/components/chapters/__tests__/FinalLetterChapter.test.tsx`

**Interfaces:**
- Consumes: meaning, future, and final-letter content; `StoryImage`; `onOpenEpilogue`.
- Produces: quiet letter layouts, an unfold interaction, and final CTA.

- [ ] **Step 1: Write final-letter tests**

Assert that the body and `Now come find your Chandler` CTA render, generic Next
navigation does not appear inside the component, and clicking `One more thing…`
calls `onOpenEpilogue`.

- [ ] **Step 2: Run the test and verify failure**

Run: `npm test -- src/components/chapters/__tests__/FinalLetterChapter.test.tsx`

Expected: FAIL because the chapter does not exist.

- [ ] **Step 3: Implement `MeaningChapter`**

Use a quiet two-column layout on desktop and portrait-first layout on mobile.
Render the body as readable paragraphs by splitting on blank lines in the
authored content. Do not animate individual paragraphs.

- [ ] **Step 4: Implement `FutureChapter`**

Render a closed note button with the supplied label. Clicking unfolds the note
and reveals the body; the button uses `aria-expanded` and `aria-controls`.
Reduced motion replaces the fold transform with an immediate state change.

- [ ] **Step 5: Implement `FinalLetterChapter`**

Use the handwriting face for the letter, visually isolate the CTA in burgundy,
and render the epilogue trigger after the CTA with quiet secondary styling. The
CTA is text, not a fake button; the only interactive control is the epilogue
trigger.

- [ ] **Step 6: Run focused tests and lint**

Run: `npm test -- src/components/chapters/__tests__/FinalLetterChapter.test.tsx && npm run lint`

Expected: PASS and lint exits 0.

- [ ] **Step 7: Commit**

```bash
git add src/components/chapters/MeaningChapter.tsx src/components/chapters/FutureChapter.tsx src/components/chapters/FinalLetterChapter.tsx src/components/chapters/__tests__/FinalLetterChapter.test.tsx
git commit -m "feat: add emotional story chapters and final reveal"
```

---

### Task 10: Add the optional epilogue gallery

**Files:**
- Create: `src/hooks/useEpilogueGallery.ts`
- Create: `src/hooks/__tests__/useEpilogueGallery.test.ts`
- Create: `src/components/EpilogueGallery.tsx`
- Create: `src/components/__tests__/EpilogueGallery.test.tsx`

**Interfaces:**
- Produces: `useEpilogueGallery(length)` returning `index`, `next`, `previous`, and `goTo`; `EpilogueGallery({ images, onClose })`.
- Consumes: `StoryImageData[]` and `StoryImage`.

- [ ] **Step 1: Write hook boundary tests**

Assert `next()` wraps from the last image to zero, `previous()` wraps from zero
to the last image, and `goTo()` ignores out-of-range indices.

- [ ] **Step 2: Write gallery accessibility tests**

Assert `role="dialog"`, `aria-modal="true"`, close/previous/next buttons, current
caption, `1 of N`, Escape dismissal, and ArrowLeft/ArrowRight navigation.

- [ ] **Step 3: Run focused tests and verify failure**

Run: `npm test -- src/hooks/__tests__/useEpilogueGallery.test.ts src/components/__tests__/EpilogueGallery.test.tsx`

Expected: FAIL because hook and component do not exist.

- [ ] **Step 4: Implement gallery state and dialog**

Use modulo arithmetic for wraparound. Mount the gallery as a fixed overlay,
save the previously focused element, focus the Close button on mount, restore
focus on unmount, lock body scroll while open, and handle Escape/arrow keys on
`window`. Keep controls in DOM order: Close, image, caption/status, Previous,
Next. Use natural containment rather than face-cropping the epilogue images.

- [ ] **Step 5: Run focused tests and lint**

Run: `npm test -- src/hooks/__tests__/useEpilogueGallery.test.ts src/components/__tests__/EpilogueGallery.test.tsx && npm run lint`

Expected: PASS and lint exits 0.

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useEpilogueGallery.ts src/hooks/__tests__/useEpilogueGallery.test.ts src/components/EpilogueGallery.tsx src/components/__tests__/EpilogueGallery.test.tsx
git commit -m "feat: add optional birthday photo epilogue"
```

---

### Task 11: Integrate the complete story and remove obsolete prototype code

**Files:**
- Modify: `src/app/page.tsx`
- Delete: `src/components/StepShell.tsx`
- Delete: `src/components/PhotoFrame.tsx`
- Delete: `src/components/steps/LetterStep.tsx`
- Delete: `src/components/steps/PhotoCollageStep.tsx`
- Delete: `src/components/steps/FavoritePersonStep.tsx`
- Delete: `src/components/steps/BalloonPopStep.tsx`
- Delete: `src/components/steps/GiftChoiceStep.tsx`
- Delete: `src/components/steps/MakeAWishStep.tsx`
- Delete: `src/components/steps/LoveYouMoreStep.tsx`
- Delete: `src/hooks/useGiftChoice.ts`
- Delete: `src/hooks/useLoveToggle.ts`
- Delete: `src/hooks/__tests__/useGiftChoice.test.ts`
- Delete: `src/hooks/__tests__/useLoveToggle.test.ts`
- Delete: `src/lib/stepFlow.ts`
- Delete: `src/lib/__tests__/stepFlow.test.ts`
- Create: `src/app/__tests__/page.test.tsx`

**Interfaces:**
- Consumes: all prior chapter components, `STORY_ORDER`, navigation helpers, `StoryShell`, `BackgroundAudio`, and `EpilogueGallery`.
- Produces: complete end-to-end client story.

- [ ] **Step 1: Write a page journey test**

Mock `next/image` and Framer Motion to stable DOM elements. Enter the configured
passcode, assert the birthday hero, advance through every chapter by accessible
button name, complete required balloon/candle/note actions, assert the final
Chandler CTA, open the epilogue, and close it.

- [ ] **Step 2: Run the page test and verify failure**

Run: `npm test -- src/app/__tests__/page.test.tsx`

Expected: FAIL because `page.tsx` still renders the prototype flow.

- [ ] **Step 3: Integrate the story controller**

Keep `story` and `epilogueOpen` in `Page`. Render `PasscodeChapter` outside the
shell. After unlock, render `BackgroundAudio`, `StoryShell`, and one chapter
selected by `story`. Use one keyed motion wrapper with a restrained opacity
transition; when reduced motion is requested, set duration to zero. Call
`window.scrollTo({ top: 0 })` after chapter changes when available.

- [ ] **Step 4: Gate contextual continuation**

The balloon chapter may continue at any time but changes the label to `Continue`
after all four balloons are revealed. The wish chapter keeps Continue available
so permission or interaction never traps the user. The future chapter uses
`Read the final letter`; the final letter has no Continue control.

- [ ] **Step 5: Remove obsolete prototype files**

Delete only the files listed above. Run `rg` for each removed import name and
confirm no references remain. Retain `isPasscodeCorrect`, `useBalloonPop`, and
`useCandle` because the redesigned components use them.

- [ ] **Step 6: Run the entire automated suite**

Run: `npm test`

Expected: all tests pass with no unhandled promise or React `act()` warnings.

- [ ] **Step 7: Run lint and production build**

Run: `npm run lint && npm run build`

Expected: both exit 0.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: integrate Somya birthday storybook"
```

---

### Task 12: Perform visual QA and document the content handoff

**Files:**
- Modify: `README.md`
- Create: `docs/content/somya-content-checklist.md`

**Interfaces:**
- Consumes: completed application and typed content model.
- Produces: reproducible customization and launch checklist.

- [ ] **Step 1: Start the production server for QA**

Run:

```bash
npm run build
npm run start
```

Expected: server starts successfully on `http://localhost:3000`.

- [ ] **Step 2: Capture and inspect responsive screenshots**

Use the in-app browser at widths 320, 375, 430, 768, and 1440 pixels. Capture
the sealed letter, hero, mosaic, observations, balloon interaction, wish,
meaning, future, final letter, and gallery. Check each against the spec for
cropped faces, unreadable text, collision, clipping, excessive decoration, and
horizontal overflow. Fix issues in the owning component rather than adding
broad one-off overrides.

- [ ] **Step 3: Verify accessibility modes manually**

Navigate the entire story using only Tab, Shift+Tab, Enter, Space, Escape, and
arrow keys. Repeat with reduced motion enabled. Confirm focus is always visible,
the gallery returns focus, balloon state remains understandable, and no chapter
depends on animation.

- [ ] **Step 4: Verify media failures manually**

Test with the audio path temporarily changed to a missing file in browser
devtools, deny microphone permission, and load one missing image URL. Confirm
the story remains navigable, tap-to-blow remains available, and the designed
image fallback preserves layout. Revert the temporary browser-only changes.

- [ ] **Step 5: Write the content checklist**

Create `docs/content/somya-content-checklist.md` with explicit checkboxes for:
one hero portrait; 6–8 mosaic photographs; 2–3 observation photographs and
specific observations; one meaning-letter portrait; 15 epilogue photographs;
four qualities; birthday wish; central letter; future note; final letter;
passcode and hint; image alt text and focal points; and a licensed/permitted
audio file. Include the expected filenames `/public/images/somya-01.jpg`
through `somya-30.jpg` and `/public/audio/song.mp3`.

- [ ] **Step 6: Update README launch instructions**

Document Node `22.22.1`, `npm test`, `npm run lint`, `npm run build`, the content
file, image naming, the content checklist, privacy limitation of the ceremonial
passcode, real-phone testing, and Vercel deployment. State that personal copy
and photo selection must be completed before the site is gift-ready.

- [ ] **Step 7: Run final verification**

Run: `npm test && npm run lint && npm run build && git diff --check`

Expected: every command exits 0.

- [ ] **Step 8: Commit**

```bash
git add README.md docs/content/somya-content-checklist.md src
git commit -m "docs: add birthday content and launch checklist"
```

---

## Definition of Done

- All automated tests, lint, and the production build pass.
- The story has no horizontal overflow at 320 px.
- Keyboard and reduced-motion journeys work from passcode through epilogue.
- Audio and microphone denial never block progress.
- Final content uses Somya's selected photographs and Rahul's personalized copy.
- The last required chapter ends with the approved Chandler call to action.
- A deployed preview has been verified on at least one real phone before October 6, 2026.
