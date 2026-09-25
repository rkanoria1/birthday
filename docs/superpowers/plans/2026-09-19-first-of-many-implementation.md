# First of Many Implementation Plan

**Goal:** Reframe the birthday story around an engaged couple still getting to know each other and add three purposeful interactive chapters.

**Spec:** `docs/superpowers/specs/2026-09-19-first-of-many-design.md`

1. Extend the typed content model with birthday-mood options, time-capsule wishes, and a future-Rahul note; revise current copy to remove married-life assumptions.
2. Extend the pure story order with `birthdayMood`, `timeCapsule`, and `futureRahul`, with failing navigation/content tests first.
3. Build `BirthdayMoodChapter` as an inclusive no-wrong-answer choice and test selection/reveal behavior.
4. Build `TimeCapsuleChapter` with five local-only wish choices, an accessible selection state, and a screenshot-ready promise card; test choice changes.
5. Build `FutureRahulChapter` as an accessible unfold interaction dated October 6, 2027; test reveal behavior.
6. Integrate all chapters into `page.tsx`, preserve navigation semantics, and update the full-flow test.
7. Run tests, lint, build, and responsive visual review; refine spacing and motion, then commit.
