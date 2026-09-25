# Birthday Website — Design Spec

## Overview

A private, single-recipient interactive website built as a birthday gift for [HER_NAME], to be sent as a link at midnight on **October 6, 2026**. The site is a linear "digital scrapbook" experience: a passcode-gated entry followed by a sequence of personal pages (letters, photo collages, a couple of light interactive moments), ending in a call-to-action that brings her to Rahul in person (he will be physically present and surprise her at 12am — the final page's payoff is "come find me," not a shipped/wrapped gift).

Reference material: two Instagram reels showing Canva-built "birthday website" templates (passcode lock with heart-shaped keypad, polaroid/gingham/checkered pastel aesthetic, handwritten script fonts, Next-button linear navigation, small interactive beats like balloon-popping and a "love you more" tug-of-war toggle). This spec adapts that pattern rather than the earlier riddle/puzzle/treasure-hunt concept explored during brainstorming (rejected in favor of the simpler, proven format shown in the reference videos).

**Context note:** this is an arranged marriage — the relationship has less shared history than a typical long-term-couple gift site. Content should lean into honest "getting to know you" sincerity (things learned/noticed since the wedding) rather than manufacturing a decade of memories.

## Goals

- A polished, mobile-first website (she will very likely open the link on her phone) that feels personal and non-templated, despite following a proven structural pattern.
- Content is entirely data-driven (text, photos, passcode) so Rahul can fill it in without touching page logic.
- Ships well before October 6, 2026, with time to test on a real phone.

## Non-goals

- No user accounts, backend database, or persistence — this is a single static experience for one recipient.
- No puzzle/riddle-solving mechanic (explored and dropped during brainstorming in favor of the simpler reference format).
- No analytics/tracking.

## Tech stack

- **Next.js (App Router)**, TypeScript, Tailwind CSS — consistent with Rahul's existing wedding-planner project conventions, but this project has **no Supabase/backend**: purely static content driven by a single local content file.
- Framer Motion for page-transition and micro-interaction animations (balloon pop, tug-of-war, card reveals).
- Deployed as a static/SSG Next.js site to Vercel with a private, unlisted URL (not linked from anywhere public). No auth beyond the in-app passcode gate (which is a UX/ceremony element, not real security — the URL itself is the actual privacy boundary).
- Node version: use v22.22.1 via nvm for local dev (this machine's shell defaults to a much older Node; see existing project conventions).

## Content model

All copy, photos, and the passcode live in a single typed content file (e.g. `src/content/site.ts`), so the flow/UI components stay generic and reusable. Example shape:

```ts
export const siteContent = {
  recipientName: "...",
  passcode: "....",           // 4-digit, e.g. a meaningful date
  unlockAt: "2026-10-06T00:00:00+05:30",
  pages: {
    letter1: { title: "...", body: "...", photo: "/images/..." },
    photoCollage: { caption: "...", photos: ["...", "..."] },
    favoritePerson: { photo: "...", caption: "Favorite person" },
    balloonPop: { revealPhrases: ["...", "...", "...", "..."] }, // one per balloon
    giftChoice: { yesRevealText: "...", noRedirect: "yes" },     // "No" playfully loops back to "Yes"
    makeAWish: { cakeMessage: "..." },
    loveYouMore: {},           // pure interaction, no content needed
    finalLetter: { body: "...", cta: "Come find me. I'm waiting outside." },
  },
}
```

Photos are static assets under `public/images/`, supplied by Rahul before content is finalized.

## Page flow

Single scrolling app state machine (not real routes — a `currentStep` index over an ordered array), so Next/Back just moves the index and Framer Motion cross-fades between steps. Steps, in order:

1. **Passcode lock** — heart-shaped numeric keypad (matches reference videos), 4-digit code tied to something only she'd know (e.g. a meaningful date). A polaroid photo + small prop illustration sits beside the keypad. Wrong code shakes and clears; correct code transitions to step 2.
2. **Letter 1** — handwritten-style note (custom script font), paired with a photo prop (vinyl record / polaroid styling).
3. **Photo collage** — "to the person who made my days" style grid of photos with a short caption.
4. **Favorite person** — a single large polaroid photo on a gingham/checkered background with a small doodle prop (teddy bear / flowers), "Favorite person" caption.
5. **Pop all 4 balloons** — mini interactive: four balloons, tapping/clicking each pops it (simple scale+fade animation) and reveals one word/phrase; all four together form a short sentence.
6. **"Do you want to open your gift?"** — Yes/No buttons. "No" is a joke — it snaps back or the button dodges/relabels itself; "Yes" reveals a short message (not a physical gift preview, since the real surprise is Rahul's physical presence — see final step).
7. **Make a wish** — cake graphic with candle(s), a blow-to-extinguish or tap-to-blow interaction, and a short "wish" message underneath.
8. **Love you more** — the tug-of-war/flip toggle from the reference video: dragging or tapping flips between "Love you" / "Love you more," endless and playful, with a restart control.
9. **Final letter** — closing heartfelt message, ending with the real-world call-to-action: **"Come find me — I'm right outside."** (exact wording to be finalized by Rahul). This is the payoff step; there is no page after it.

Every step: Next/Back navigation (Back disabled on step 1, no Next needed after step 9), a persistent subtle background song (auto-play with a mute toggle, since browsers block unmuted autoplay — the reference videos likely rely on the visitor unmuting), and a slim progress indicator (dots) so it doesn't feel endless on mobile.

## Visual style

Follows the reference videos rather than the wedding-planner app's emerald/gold palette: soft pink/red tones, gingham/checkerboard background patterns, handwritten/script display font (e.g. a cursive Google Font) for titles paired with a clean sans body font, polaroid-style photo frames with washi-tape corner accents, heart-shaped buttons/icons where natural (passcode keypad, nav buttons). Rounded, warm, maximalist-cute rather than minimal.

## Error handling / edge cases

- Wrong passcode: shake animation, clear input, no lockout (low stakes, single user).
- Autoplay audio blocked by browser: show a small "🔊 tap for sound" affordance rather than failing silently.
- Photos not yet supplied at build time: use clearly-labeled placeholder images so the layout can be tested before final content lands.
- Small screens (primary target): all steps must fit and be legible on a standard phone viewport without horizontal scrolling.

## Testing / verification

Since there's no business logic beyond a state machine and a passcode check, verification is manual: run the dev server, click/tap through the full flow on both desktop and a mobile viewport (browser devtools emulation, and ideally a real phone), confirm the passcode gate works, confirm all animations play, and confirm audio behavior in a fresh (unmuted-blocked) browser session.

## Timeline

Target: fully built and content-complete with a few days of buffer before October 6, 2026, to test on Rahul's and (if possible) a friend's phone before the midnight send.
