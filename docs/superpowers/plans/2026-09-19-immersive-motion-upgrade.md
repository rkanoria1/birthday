# Immersive Motion Upgrade Implementation Plan

**Goal:** Raise the existing Somya birthday storybook to a premium interactive experience without changing its emotional sequence or content model.

1. Add motion tokens, ambient scene layers, glass/paper materials, responsive type, and reduced-motion fallbacks in `globals.css`.
2. Create shared `AmbientScene`, `ChapterTransition`, `MagneticButton`, and `Sparkles` primitives.
3. Redesign the story shell as a floating progress dock and integrate directional chapter transitions.
4. Upgrade passcode and hero into the signature letter-opening sequence.
5. Upgrade mosaic, observations, balloons, candle, future note, final letter, and gallery with distinct interaction-specific motion.
6. Preserve behavior through the existing full-flow test, add focused interaction coverage where behavior changes, and verify test/lint/build.
7. Render and inspect representative mobile and desktop chapters, then remove visual excess discovered during critique.

**Spec:** `docs/superpowers/specs/2026-09-19-immersive-motion-upgrade-design.md`
