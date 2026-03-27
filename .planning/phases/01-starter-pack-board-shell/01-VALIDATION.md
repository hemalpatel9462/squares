---
phase: 01
slug: starter-pack-board-shell
status: revised
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-27
---

# Phase 01 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest + React Testing Library |
| **Config file** | `vitest.config.ts` with shared setup in `src/test/setup.ts` |
| **Quick run command** | `npm test -- --run` |
| **Full suite command** | `npm test -- --run` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test -- --run`
- **After every plan wave:** Run `npm test -- --run`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 20 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | PACK-01 | smoke | `npm test -- --run` | `src/test/app-shell.smoke.test.tsx` | ⬜ pending |
| 01-01-02 | 01 | 1 | PACK-01 | contract | `npm test -- --run` | inherits W0 smoke | ⬜ pending |
| 01-02-01 | 02 | 2 | PACK-01 | unit | `npm test -- --run` | inherits W0 smoke | ⬜ pending |
| 01-02-02 | 02 | 2 | PACK-02 | unit | `npm test -- --run` | `src/data/__tests__/starterPack.test.ts` | ⬜ pending |
| 01-03-01 | 03 | 3 | BOARD-01 | component | `npm test -- --run` | inherits prior tests | ⬜ pending |
| 01-03-02 | 03 | 3 | BOARD-02 | component | `npm test -- --run` | `src/components/__tests__/PuzzleBoard.test.tsx` | ⬜ pending |
| 01-04-01 | 04 | 4 | BOARD-03 | integration | `npm test -- --run && npm run build` | `src/components/__tests__/App.test.tsx` | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `package.json` — test script for Vitest
- [ ] `src/test/setup.ts` or equivalent — shared test setup
- [ ] `src/test/app-shell.smoke.test.tsx` — placeholder app-shell smoke test that makes the first test run real
- [ ] `src/data/__tests__/starterPack.test.ts` — verifies 40 puzzles load with expected counts
- [ ] `src/components/__tests__/PuzzleBoard.test.tsx` — board render coverage across representative sizes

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Immersive premium framing feels balanced on desktop and mobile | BOARD-03 | Visual composition quality is subjective and device-dependent | Open the app in desktop and narrow mobile viewport; confirm board remains primary, metadata stays integrated, and framing does not crowd the board |
| Clue cells are visually distinct from empty cells in the intended premium style | BOARD-02 | Final styling clarity requires human review | Load at least one easy and one hard puzzle; verify clue emphasis is obvious without harming readability |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 smoke coverage exists before any feature-specific test verify
- [ ] No watch-mode flags
- [ ] Feedback latency < 20s
- [ ] `nyquist_compliant: true` set in frontmatter once the revised files exist

**Approval:** pending
