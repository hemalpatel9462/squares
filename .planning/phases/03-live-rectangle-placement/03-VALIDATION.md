---
phase: 03
slug: live-rectangle-placement
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-03-27
---

# Phase 03 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 3.2.4 + React Testing Library 16.3.0 |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/components/__tests__/PuzzleBoard.interaction.test.tsx` |
| **Full suite command** | `npm test -- --run` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run src/components/__tests__/PuzzleBoard.interaction.test.tsx`
- **After every plan wave:** Run `npm test -- --run`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | PLAY-01 | component integration | `npx vitest run src/components/__tests__/PuzzleBoard.interaction.test.tsx -t "arms from clue cell"` | ❌ W0 | ⬜ pending |
| 03-01-02 | 01 | 1 | PLAY-02 | component integration | `npx vitest run src/components/__tests__/PuzzleBoard.interaction.test.tsx -t "updates preview during drag"` | ❌ W0 | ⬜ pending |
| 03-01-03 | 01 | 1 | PLAY-03 | component integration | `npx vitest run src/components/__tests__/PuzzleBoard.interaction.test.tsx -t "shows validity state"` | ❌ W0 | ⬜ pending |
| 03-02-01 | 02 | 2 | PLAY-04 | component integration | `npx vitest run src/components/__tests__/PuzzleBoard.interaction.test.tsx -t "commits on valid release"` | ❌ W0 | ⬜ pending |
| 03-02-02 | 02 | 2 | UX-03 | component integration | `npx vitest run src/components/__tests__/PuzzleBoard.interaction.test.tsx -t "shows area cue and release feedback"` | ❌ W0 | ⬜ pending |
| 03-02-03 | 02 | 2 | UX-04 | component integration | `npx vitest run src/components/__tests__/PuzzleBoard.interaction.test.tsx -t "updates without debounce"` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/components/__tests__/PuzzleBoard.interaction.test.tsx` — pointer-driven preview and commit flow for PLAY-01 through PLAY-04 and UX-03 through UX-04
- [ ] `src/components/__tests__/App.placement.test.tsx` — placement persistence across puzzle navigation and reset-on-puzzle-change behavior
- [ ] `src/components/__tests__/testGeometry.ts` — shared `getBoundingClientRect()` helpers so pointer coordinates map deterministically in jsdom

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Touch drag feels slightly more forgiving than desktop while keeping the same interaction model | UX-03 | jsdom cannot validate real mobile touch smoothness, pointer capture feel, or page-scroll suppression fidelity | Run the app on a phone-sized browser, start from a clue cell, drag slowly and diagonally across cell boundaries, and confirm preview tracking stays stable without accidental page scrolling. |
| Invalid release snap-back reads as noticeable but restrained inside the premium shell | UX-03 | Motion tone and visual subtlety are subjective and not meaningfully asserted in DOM-only tests | Perform an invalid drag release and verify the preview briefly snaps back without harsh warning styling or board layout shift. |
| Valid release settle feels quick and satisfying without obscuring clue readability | UX-03 | Automated tests can detect class/state changes but not experiential timing quality | Perform a valid release on desktop and mobile widths and confirm the placed rectangle settles in cleanly while clue numerals remain readable. |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
