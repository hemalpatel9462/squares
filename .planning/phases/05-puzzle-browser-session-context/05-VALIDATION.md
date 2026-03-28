---
phase: 05
slug: puzzle-browser-session-context
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-28
---

# Phase 05 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 3.2.4 + Testing Library React 16.3.0 |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npm test -- --run src/components/__tests__/App.browser.test.tsx` |
| **Full suite command** | `npm test -- --run` |
| **Estimated runtime** | ~20 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test -- --run src/components/__tests__/App.browser.test.tsx`
- **After every plan wave:** Run `npm test -- --run`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | PACK-03 | integration | `npm test -- --run src/components/__tests__/App.browser.test.tsx -t "browses puzzles by difficulty"` | ❌ W0 | ⬜ pending |
| 05-01-02 | 01 | 1 | SAVE-02 | integration | `npm test -- --run src/components/__tests__/App.browser.test.tsx -t "restores selected difficulty from localStorage"` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/components/__tests__/App.browser.test.tsx` — stubs for PACK-03 and SAVE-02
- [ ] localStorage fixture helper in `src/components/__tests__/App.browser.test.tsx` (or shared helper)

---

## Manual-Only Verifications

All phase behaviors have automated verification.

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
