# Somya Birthday Storybook — Redesign Specification

## Overview

Redesign the existing birthday website as a private, mobile-first digital
storybook for Somya's birthday on October 6, 2026. The experience celebrates
Somya as an individual: her character, the different sides of her personality,
what she means to Rahul, and their future together.

The tone blends romantic elegance with a few playful scrapbook interactions.
It should feel like a keepsake made specifically for Somya rather than a themed
birthday template. A subtle *Friends* reference appears only in the final
real-world call to action.

Rahul will be physically present when Somya completes the experience. The final
payoff is an invitation to find him, not an online gift reveal.

## Goals

- Make Somya and her photographs the visual focus.
- Create an emotionally paced journey that works beautifully on a phone.
- Balance polished editorial composition with tactile, playful interactions.
- Let Rahul update every photo, caption, observation, and letter in one typed
  content file.
- Use roughly 12–15 selected photos in the main story and make the remainder
  available through an optional epilogue gallery.
- Deliver a stable, accessible experience well before October 6, 2026.

## Non-goals

- A general-purpose birthday-site builder or reusable public template.
- A couple-centric scrapbook dominated by photographs of Rahul and Somya.
- A visually literal *Friends* theme.
- Accounts, a database, analytics, uploads, or server-managed content.
- Complex puzzles that delay or frustrate the emotional story.

## Experience principles

1. **Somya is the subject.** Photography and writing reveal her character;
   decoration remains secondary.
2. **One memorable entrance.** Unlocking the sealed letter brings a blurred
   portrait of Somya into focus. Ambient motion elsewhere stays restrained.
3. **Interaction earns its place.** Balloons, the candle, notes, and the final
   reveal respond to deliberate actions and advance the story.
4. **Emotional pacing matters.** Energetic photo sequences alternate with quiet
   letters so the experience does not become visually or emotionally flat.
5. **Personal beats trendy.** Contemporary editorial layouts and tactile motion
   are used, but generic gradients, identical cards, floating-heart clutter,
   emoji illustrations, and constant reveal animations are avoided.

## Visual system

### Color

| Token | Value | Use |
| --- | --- | --- |
| Ivory paper | `#FFF9F5` | Primary canvas and letter surfaces |
| Blush veil | `#F7DDE4` | Secondary fields and quiet transitions |
| Cherry red | `#D92F4C` | Active controls and playful highlights |
| Deep burgundy | `#591C2D` | Display type and emotional passages |
| Warm ink | `#33272B` | Body text |
| Champagne gold | `#C8A46A` | Sparse celebratory details |

Contrast must remain WCAG AA for text and interactive states. Gold is a detail
color and is not used for small text on light surfaces.

### Typography

Use an expressive editorial serif for titles, chapter statements, and key
quotes. Pair it with a highly legible sans-serif for controls and longer copy.
A natural handwriting face is reserved for annotations, Somya's name, and the
final handwritten letter. Script type is not used for paragraphs or every
heading.

Line lengths remain below approximately 65 characters for intimate letters.
Typography scales fluidly between narrow phone screens and desktop storybook
layouts without shrinking body copy below a comfortable reading size.

### Photography and material language

- Use one excellent portrait at full visual strength rather than placing every
  image inside a decorative card.
- Mix full-bleed crops with occasional physical-print treatments.
- Use subtle paper grain, soft edge variation, handwritten observations, and
  restrained tape or archival marks to imply a handmade keepsake.
- Avoid repeating the same border radius, shadow, and card treatment across
  every section.
- Preserve faces when responsive crops change by allowing focal-position data
  per photograph.

### Layout

Phone is the primary composition. Each chapter occupies at least one viewport
and can scroll vertically when copy or accessibility settings require it.
Desktop does not merely stretch the phone UI; it presents the chapter inside a
generous two-page storybook composition while retaining the same reading order.

Text is predominantly left aligned. Short ceremonial phrases may be centered,
but letters and observations remain left aligned for readability.

## Story structure

### 1. The sealed letter

The opening presents a sealed letter addressed to Somya with a soft, obscured
portrait behind it. A meaningful passcode unlocks the experience. Incorrect
entries shake gently, clear safely, and invite another attempt without lockout.
The successful entry triggers the site's principal orchestrated animation: the
letter opens and the portrait comes into focus.

The passcode remains ceremonial, not a security boundary. The site should be
deployed to an unlisted URL.

### 2. Happy birthday, Somya

A confident opening portrait carries the screen alongside her name and the date
October 6, 2026. Copy is intentionally brief so the first photograph can land.

### 3. All the ways you shine

An editorial mosaic uses approximately 6–8 photographs to show different sides
of Somya. The layout varies scale and crop rather than using an equal card grid.
One concise caption unifies the sequence.

### 4. Things I notice about you

Specific observations about Somya's personality, habits, warmth, humor, and
strength appear as handwritten notes alongside 2–3 photographs. Content must be
concrete enough to sound like Rahul, not generic romantic copy.

### 5. Pop a little happiness

Four custom illustrated balloons replace emoji. Each balloon reveals one
quality Rahul admires. The four phrases form a satisfying whole when all are
open. The interaction supports pointer, touch, and keyboard input and does not
depend on animation to communicate state.

### 6. Make a wish

A custom illustrated cake and candle form the visual center. Somya may tap to
blow out the candle. Microphone input may be offered as progressive enhancement
only: it requires an explicit permission request, explains why permission is
needed, handles denial, and never prevents the reliable tap path. The completed
state reveals a short birthday wish.

### 7. What you mean to me

The central emotional letter appears beside one quiet portrait. This chapter is
visually restrained and gives the writing room to breathe. It describes how
Somya affects Rahul's life without inventing a longer shared history than they
have.

### 8. Everything ahead of us

A hopeful passage turns from the present toward the future Rahul and Somya are
building together. One light interaction—such as unfolding a small note—keeps
the chapter tactile without becoming a game.

### 9. The final letter

Music and interface decoration recede. The final handwritten letter closes with
the subtle *Friends* Easter egg:

> Could this birthday *be* any more special? Now come find your Chandler.

This is the final required action and the real-world payoff. No automatic next
step competes with it.

### 10. Optional photo epilogue

An understated “One more thing…” control opens the remaining photographs in a
browsable gallery. This epilogue follows the main ending and never interrupts
its emotional pacing. It supports swipe, keyboard navigation, close/escape,
captions where supplied, and natural image dimensions.

## Navigation and state

Retain the project's simple client-side chapter state machine and tested pure
navigation helpers. Replace hardcoded conditional content with a typed chapter
model where doing so makes content maintenance clearer, but do not add routing,
global state, persistence, or a backend.

Navigation behavior:

- Back is available after entry and preserves chapter interaction state where
  practical.
- Continue is named contextually when an action is required.
- The final letter has no generic Next button.
- A subtle progress treatment communicates position without displaying a row of
  nine visually dominant dots.
- Browser refresh may restart the story; persistence is unnecessary.

## Content model

All authored content lives in `src/content/site.ts` and is validated through
TypeScript. The model includes:

- recipient name, birthday date, passcode, and optional passcode hint;
- hero portrait and its focal position;
- chapter headings and short introductions;
- an array of photo records with source, alt text, optional caption, optional
  date, and focal position;
- four balloon qualities;
- candle wish;
- observations about Somya;
- central and future-facing letters;
- final message and real-world call to action;
- optional epilogue photographs;
- background audio source and accessible title.

Placeholder content must be clearly identifiable. Missing assets render an
intentional paper placeholder during development without breaking layout.

## Components and responsibilities

- **Story controller:** owns the active chapter and navigation rules.
- **Story shell:** provides the shared canvas, restrained progress, sound
  control, and navigation.
- **Chapter components:** render one coherent story beat and expose completion
  events where required.
- **Responsive photo component:** wraps Next.js image optimization, focal crops,
  loading behavior, alt text, and development fallback.
- **Audio control:** starts only after user interaction, remembers its state for
  the current session, and never blocks progress.
- **Interaction hooks:** keep balloon, candle, letter, and gallery state small,
  predictable, and independently testable.

Chapter visuals may differ, but they share tokens, typography, focus treatment,
and motion rules.

## Motion and sound

The unlock is the only automatic showpiece. Other motion directly explains a
user action: a letter unfolds, a balloon changes state, a flame disappears, or
a gallery advances. Repeated fade-and-slide entrances are avoided.

Honor `prefers-reduced-motion` by removing transforms and shortening or
eliminating nonessential transitions. The full story remains understandable
with motion disabled.

Background audio begins only after the passcode interaction or an explicit
sound action. Controls use text labels accessible to screen readers and expose
playing/muted state. Missing or blocked audio fails quietly while leaving a
usable control state.

## Accessibility and responsive behavior

- Every control is reachable and operable by keyboard.
- Focus indicators are clearly visible against every chapter background.
- Tap targets are at least 44 by 44 CSS pixels.
- Semantic headings preserve a logical document hierarchy.
- Images have descriptive alt text; decorative marks use empty alt text or CSS.
- Revealed interaction content is announced appropriately without overwhelming
  assistive technology.
- No information is communicated only through color, motion, or hover.
- The layout has no horizontal overflow at 320 CSS pixels.
- Increased text size and long personalized copy may grow the chapter rather
  than being clipped to one viewport.

## Error and permission handling

- Wrong passcode: shake, clear, retain focus, and show a concise error.
- Missing photo: render a designed placeholder and log no noisy repeated error.
- Audio unavailable: keep the story functional and hide or disable misleading
  playback states.
- Microphone unsupported or denied: explain briefly and keep tap-to-blow ready.
- Gallery image failure: preserve navigation and identify the unavailable item.

## Testing and verification

Automated coverage should include:

- chapter order and forward/back navigation;
- passcode correctness and retry behavior;
- content-model expectations;
- balloon completion and revealed phrases;
- candle tap fallback and microphone-denial fallback where implemented;
- gallery navigation and dismissal;
- audio control states;
- reduced-motion behavior where practical.

Manual visual verification must cover:

- 320 px, 375 px, and 430 px phone widths;
- a representative tablet and desktop viewport;
- keyboard-only navigation and visible focus;
- reduced motion;
- blocked audio and denied microphone permission;
- missing-image fallbacks;
- all chapters with final personalized copy and real photographs;
- production build and a deployed preview on at least one real phone.

## Content preparation

Before final polish, Rahul should select:

- one strongest opening portrait;
- 6–8 expressive photographs for the editorial mosaic;
- 2–3 photographs that pair naturally with personal observations;
- one quiet portrait for the central letter;
- additional photographs for the optional epilogue;
- four specific qualities he admires;
- several concrete habits or moments he has noticed;
- the main letter, future-facing note, birthday wish, and passcode hint;
- a licensed or personally permitted audio track.

The implementation can begin with deliberate placeholders, but final visual
polish and crop decisions require the selected photographs.

## Success criteria

The redesign is complete when Somya can open the unlisted site on her phone,
move through the full experience without confusion, recognize herself in both
the photography and writing, complete every interaction with touch or keyboard,
and arrive at the final “find your Chandler” invitation with no technical or
visual interruption.
