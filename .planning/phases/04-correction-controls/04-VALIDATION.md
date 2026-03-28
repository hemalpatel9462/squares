---
phase: 04
slug: correction-controls
status: passed
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-28
updated: 2026-03-28
---

# Phase 04 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 3.2.4 + Testing Library |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npm test -- --run src/components/__tests__/PuzzleBoard.interaction.test.tsx src/components/__tests__/App.placement.test.tsx` |
| **Full suite command** | `npm test -- --run` |
| **Estimated runtime** | ~20 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test -- --run src/components/__tests__/PuzzleBoard.interaction.test.tsx src/components/__tests__/App.placement.test.tsx`
- **After every plan wave:** Run `npm test -- --run`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | PLAY-05 | component interaction | `npm test -- --run src/components/__tests__/App.placement.test.tsx -t "remove"` | ✅ | ✅ green |
| 04-01-02 | 01 | 1 | PLAY-05 | component interaction | `npm test -- --run src/components/__tests__/App.placement.test.tsx -t "undo"` | ✅ | ✅ green |
| 04-01-03 | 01 | 1 | PLAY-05 | component interaction | `npm test -- --run src/components/__tests__/App.placement.test.tsx -t "reset"` | ✅ | ✅ green |
| 04-02-01 | 02 | 1 | PLAY-05 | regression component | `npm test -- --run src/components/__tests__/PuzzleBoard.interaction.test.tsx` | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `src/components/__tests__/App.placement.test.tsx` — extend with remove, multi-step undo, and reset confirmation-path checks
- [x] `src/components/__tests__/testGeometry.ts` — keep geometry helpers aligned with correction interaction tests
- [x] `src/components/__tests__/PuzzleBoard.interaction.test.tsx` — add/remove-regression assertions to protect drag-preview behavior

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Touch-target comfort for compact Undo/Reset row | PLAY-05 | Real device ergonomics are not verifiable in jsdom | Test on phone-sized viewport; ensure controls are reachable and taps are reliable without accidental board interactions |
| Reset confirmation clarity | PLAY-05 | Wording and interruption feel require human judgment | Place several rectangles, tap Reset, evaluate confirmation copy clarity and cancel/confirm confidence |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved

## Validation Audit 2026-03-28

| Metric | Count |
|--------|-------|
| Gaps found | 0 |
| Resolved | 0 |
| Escalated | 0 |
