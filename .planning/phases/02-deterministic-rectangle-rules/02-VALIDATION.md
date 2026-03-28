---
phase: 02
slug: deterministic-rectangle-rules
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-27
---

# Phase 02 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 3.2.4 |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/rules/__tests__/rectangleRules.test.ts src/rules/__tests__/boardRules.test.ts` |
| **Full suite command** | `npm test -- --run` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run src/rules/__tests__/rectangleRules.test.ts src/rules/__tests__/boardRules.test.ts`
- **After every plan wave:** Run `npm test -- --run`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | RULE-07 | unit | `npx vitest run src/rules/__tests__/rectangleRules.test.ts src/rules/__tests__/boardRules.test.ts` | ✅ | ✅ green |
| 02-01-02 | 01 | 1 | RULE-01 | unit | `npx vitest run src/rules/__tests__/rectangleRules.test.ts -t "rejects out-of-bounds rectangles"` | ✅ | ✅ green |
| 02-01-03 | 01 | 1 | RULE-04 | unit | `npx vitest run src/rules/__tests__/rectangleRules.test.ts -t "rejects rectangles missing origin clue"` | ✅ | ✅ green |
| 02-02-01 | 02 | 2 | RULE-02 | unit | `npx vitest run src/rules/__tests__/rectangleRules.test.ts -t "rejects overlaps against placed rectangles"` | ✅ | ✅ green |
| 02-02-02 | 02 | 2 | RULE-03 | unit | `npx vitest run src/rules/__tests__/rectangleRules.test.ts -t "rejects rectangles containing non-origin clues"` | ✅ | ✅ green |
| 02-02-03 | 02 | 2 | RULE-05 | unit | `npx vitest run src/rules/__tests__/rectangleRules.test.ts -t "rejects rectangles with wrong area"` | ✅ | ✅ green |
| 02-03-01 | 03 | 3 | RULE-06 | unit | `npx vitest run src/rules/__tests__/boardRules.test.ts -t "marks a fully covered valid board as solved"` | ✅ | ✅ green |
| 02-03-02 | 03 | 3 | RULE-07 | unit | `npx vitest run src/rules/__tests__/rectangleRules.test.ts src/rules/__tests__/boardRules.test.ts` | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `src/rules/__tests__/rectangleRules.test.ts` — placement diagnostics, fixed issue ordering, and deterministic wrapper coverage
- [x] `src/rules/__tests__/boardRules.test.ts` — solved-board aggregation, uncovered cells, overlap state, and invalid placement propagation
- [x] `src/rules/__tests__/starterPackSolutions.test.ts` — verify bundled `solution` partitions pass rules-first analysis without becoming gameplay authority

---

## Manual-Only Verifications

All phase behaviors have automated verification.

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** passed
