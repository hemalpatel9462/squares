# Phase 04: correction-controls - Research

**Researched:** 2026-03-28
**Domain:** React puzzle interaction controls (remove, undo, reset) with Vitest coverage
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
### Remove interaction
- **D-01:** A placed rectangle is removed by direct tap/click on that rectangle.
- **D-02:** Removal happens immediately from the board interaction itself (no separate remove mode).
- **D-03:** Removal should preserve the current polished board feel rather than adding heavy destructive affordances.

### Undo behavior
- **D-04:** Undo is multi-step (more than one level), not single-step only.
- **D-05:** Undo behavior should feel predictable from action history rather than one-off special handling.

### Reset safety
- **D-06:** Reset uses smart confirmation: prompt only when at least one rectangle is currently placed.
- **D-07:** If no rectangles are placed, reset should be effectively no-op/instant without interrupting flow.

### Control layout and priority
- **D-08:** Controls live in a compact action row above the board.
- **D-09:** Action row prioritizes `Undo` and `Reset`; remove remains direct board interaction.
- **D-10:** Layout should remain compact and touch-friendly across desktop and mobile.

### Claude's Discretion
- Exact multi-step history depth and internal history structure, as long as behavior is consistent and testable.
- Exact visual treatment for selected/hovered removable rectangles, as long as readability stays calm and clear.
- Exact copy for reset confirmation messaging, as long as it is explicit and concise.

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PLAY-05 | Player can remove a placed rectangle, undo the last placement, and reset the current puzzle | App-owned puzzle-scoped history snapshots, direct board rectangle-hit removal callback, compact action row with smart-confirm reset, and Vitest interaction/regression coverage |
</phase_requirements>

## Summary

Phase 04 should be implemented by extending existing Phase 03 ownership boundaries: keep committed placement state in `App`, keep pointer/preview interaction in `PuzzleBoard`, and route new correction intents (`remove`, `undo`, `reset`) upward through `PuzzleShell` to `App`. This preserves the current architecture and avoids rework in rules logic.

Use a puzzle-scoped history model in `App` so undo is genuinely multi-step and deterministic. The simplest robust shape is stack-based snapshots per puzzle (`past[]`, `present[]`) where placement, removal, and reset each commit one new present snapshot and push prior present into `past`.

UI should add a compact action row above the board for `Undo` and `Reset` only. Removal remains direct tap/click on any placed rectangle cell via board event handling keyed by `data-placed-rectangle`. Reset confirmation should only trigger when current puzzle has placements.

**Primary recommendation:** Implement correction flows as puzzle-scoped immutable snapshot history in `App`, with direct board rectangle removal and a compact Undo/Reset action row in `PuzzleShell`.

## Project Constraints (from CLAUDE.md)

- Web browser only (desktop + mobile), no native dependencies.
- Frontend-only architecture with local persistence patterns; avoid backend assumptions.
- Deterministic, unit-testable logic is a top-level quality requirement.
- Scope must prioritize polished core loop over expansion features.
- Follow GSD workflow discipline for edits and verification artifacts.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react | `19.1.1` (repo), latest `19.2.4` | State ownership for puzzle + history | Existing app pattern is React state in `App` with immutable updates |
| react-dom | `19.1.1` (repo), latest `19.2.4` | Browser rendering | Already integrated and stable with current app shell |
| vite | `7.1.3` (repo), latest `8.0.3` | Dev/build toolchain | Existing project runtime; no migration needed for this phase |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| vitest | `3.2.4` (repo), latest `4.1.2` | Unit/component testing | Required for correction control and regression tests |
| @testing-library/react | `16.3.0` (repo), latest `16.3.2` | UI interaction assertions | For board removal clicks, undo/reset button flows |
| @testing-library/jest-dom | `6.6.3` (repo) | DOM matchers | Existing assertion layer |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| App-level snapshot history | Reducer with command/event log | More extensible long-term, but unnecessary overhead for PLAY-05 |
| `window.confirm` smart reset confirmation | Custom modal component | Better theming, but higher implementation/test cost for this phase |
| `fireEvent` pointer simulation in tests | `@testing-library/user-event` | `user-event` is higher-level, but `fireEvent` stays precise for pointer/move/up board gestures |

**Installation:**
```bash
npm install
```

**Version verification:** Verified via npm registry on 2026-03-28 using `npm view <package> version` and `npm view <package> time --json`.
- `react@19.1.1` published 2025-07-28; latest `19.2.4` published 2026-01-26
- `react-dom@19.1.1` published 2025-07-28; latest `19.2.4` published 2026-01-26
- `vite@7.1.3` published 2025-08-19; latest `8.0.3` published 2026-03-26
- `vitest@3.2.4` published 2025-06-17; latest `4.1.2` published 2026-03-26
- `@testing-library/react@16.3.0` published 2025-04-02; latest `16.3.2` published 2026-01-19

## Architecture Patterns

### Recommended Project Structure
```text
src/
├── App.tsx                          # Puzzle-scoped committed placements + correction history
├── components/
│   ├── PuzzleShell.tsx              # Compact action row above board (Undo/Reset)
│   ├── PuzzleBoard.tsx              # Direct rectangle tap/click removal event source
│   └── __tests__/                   # Correction interaction + regression coverage
└── styles/global.css                # Action row + removable-state styling
```

### Pattern 1: Puzzle-Scoped Immutable History in App
**What:** Store per-puzzle `{ past: CandidatePlacement[][], present: CandidatePlacement[] }`.
**When to use:** For all commit-level actions (`place`, `remove`, `reset`) that should be undoable.
**Example:**
```typescript
type PlacementSnapshot = CandidatePlacement[];
type PuzzleHistory = { past: PlacementSnapshot[]; present: PlacementSnapshot };

function commit(history: PuzzleHistory, next: PlacementSnapshot): PuzzleHistory {
  if (next === history.present) return history;
  return { past: [...history.past, history.present], present: next };
}
```

### Pattern 2: Direct Board Removal by Rectangle Hit
**What:** On board cell click/tap, if `data-placed-rectangle` exists, remove that rectangle index immediately.
**When to use:** Any pointer-up/click on a placed rectangle where no drag session is active.
**Example:**
```typescript
const index = Number(cell.dataset.placedRectangle);
if (Number.isInteger(index)) {
  onRemoveRectangle?.(index);
}
```

### Pattern 3: Smart Reset Confirmation
**What:** Confirm only if `present.length > 0`; no-op instantly when empty.
**When to use:** Reset button handler in action row.
**Example:**
```typescript
if (placements.length === 0) return;
if (window.confirm("Reset this puzzle and clear all placed rectangles?")) {
  onReset();
}
```

### Anti-Patterns to Avoid
- **Mutating arrays in React state:** Causes stale render/history corruption. Always create new arrays.
- **Single-step undo boolean:** Fails D-04 multi-step requirement and becomes non-deterministic.
- **Separate remove mode toggle:** Violates D-01/D-02 and adds avoidable UX friction.
- **Global history across puzzles:** Breaks puzzle isolation and conflicts with existing puzzle-scoped placement state.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Undo/redo complexity | Ad-hoc “last action” flags | Immutable snapshot stacks in state | Predictable multi-step behavior and testability |
| Reset confirmation UX | Custom modal system in this phase | Browser confirm with smart gate | Meets requirement quickly with low regression risk |
| Pointer event simulation | Manual DOM event constructors everywhere | Testing Library `fireEvent.pointer*` | Existing test suite already uses this pattern consistently |

**Key insight:** PLAY-05 is a control-flow/state problem, not a new rendering engine problem; reuse the existing state + event architecture.

## Common Pitfalls

### Pitfall 1: Undo stack pollution by invalid placements
**What goes wrong:** Invalid drag releases still push history entries.
**Why it happens:** Commit pipeline bypasses existing `analyzePlacement(...).isValid` gate.
**How to avoid:** Keep placement validity guard as the only path to `commit`.
**Warning signs:** Undo appears enabled immediately after failed drag releases.

### Pitfall 2: Remove action collides with drag interaction
**What goes wrong:** Tapping placed rectangles while interacting can accidentally start or cancel drags.
**Why it happens:** Remove handler is bound without checking drag session phase.
**How to avoid:** Only trigger remove on non-drag click/tap path and preserve current drag pointer logic.
**Warning signs:** Area preview flickers or release feedback triggers on remove taps.

### Pitfall 3: Reset confirmation appears when nothing would be lost
**What goes wrong:** User gets unnecessary modal interrupts.
**Why it happens:** Reset always confirms regardless of placement count.
**How to avoid:** Gate confirmation by `present.length > 0`.
**Warning signs:** Empty board + reset still prompts.

## Code Examples

Verified patterns from official and in-repo sources:

### Immutable remove update for React state
```typescript
setHistoryByPuzzleId((current) => {
  const h = current[puzzleId] ?? { past: [], present: [] };
  const nextPresent = h.present.filter((_, i) => i !== rectangleIndex);
  if (nextPresent.length === h.present.length) return current;
  return { ...current, [puzzleId]: { past: [...h.past, h.present], present: nextPresent } };
});
```

### Multi-step undo
```typescript
setHistoryByPuzzleId((current) => {
  const h = current[puzzleId] ?? { past: [], present: [] };
  if (h.past.length === 0) return current;
  const previous = h.past[h.past.length - 1];
  return { ...current, [puzzleId]: { past: h.past.slice(0, -1), present: previous } };
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| One-step rollback or reset-only recovery | Multi-step history-backed undo + direct remove | Modern puzzle UX baseline | Better trust/control during iterative solving |
| Destructive controls in separate mode | Contextual direct manipulation on board | Common in touch-first puzzle interfaces | Lower interaction friction |

**Deprecated/outdated:**
- Dedicated “erase mode” toggles for simple correction operations: unnecessary mode complexity for this phase scope.

## Open Questions

1. **Undo scope when switching puzzles**
   - What we know: placements are puzzle-scoped in `App` already.
   - What's unclear: whether to preserve each puzzle’s undo stack across navigation in-session.
   - Recommendation: preserve per-puzzle undo stacks in memory for consistency with existing puzzle-scoped placement persistence.

2. **Reset confirmation copy**
   - What we know: must be explicit and concise.
   - What's unclear: final tone/wording preference.
   - Recommendation: start with “Reset this puzzle and clear all placed rectangles?” and refine during UAT.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | React/Vitest execution | ✓ | `v22.16.0` | — |
| npm | Scripts and package tooling | ✓ | `11.12.1` | — |
| Vitest CLI (`npx vitest`) | Automated validation | ✓ | `3.2.4` | `npm test -- --run` |

**Missing dependencies with no fallback:**
- None.

**Missing dependencies with fallback:**
- None.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest `3.2.4` + Testing Library |
| Config file | `vitest.config.ts` |
| Quick run command | `npm test -- --run src/components/__tests__/App.placement.test.tsx` |
| Full suite command | `npm test -- --run` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PLAY-05 | Remove placed rectangle via board interaction | component interaction | `npm test -- --run src/components/__tests__/App.placement.test.tsx -t "remove"` | ❌ Wave 0 |
| PLAY-05 | Undo last action (multi-step) without full reset | component interaction | `npm test -- --run src/components/__tests__/App.placement.test.tsx -t "undo"` | ❌ Wave 0 |
| PLAY-05 | Reset current puzzle to clean state with smart confirmation | component interaction | `npm test -- --run src/components/__tests__/App.placement.test.tsx -t "reset"` | ❌ Wave 0 |
| PLAY-05 | Preserve Phase 03 drag/preview/release behavior | regression component | `npm test -- --run src/components/__tests__/PuzzleBoard.interaction.test.tsx` | ✅ |

### Sampling Rate
- **Per task commit:** `npm test -- --run src/components/__tests__/PuzzleBoard.interaction.test.tsx src/components/__tests__/App.placement.test.tsx`
- **Per wave merge:** `npm test -- --run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] Extend `src/components/__tests__/App.placement.test.tsx` for remove/undo/reset behaviors (PLAY-05).
- [ ] Add confirmation-path tests (confirm accept + cancel) around reset.
- [ ] Add undo stack depth test (at least 2+ sequential undos).

## Sources

### Primary (HIGH confidence)
- `.planning/phases/04-correction-controls/04-CONTEXT.md` - locked decisions and scope constraints
- `.planning/REQUIREMENTS.md` - PLAY-05 requirement semantics
- `src/App.tsx` - current placement ownership and validity commit gate
- `src/components/PuzzleBoard.tsx` - pointer interaction model and placed-cell metadata hooks
- `src/components/PuzzleShell.tsx` - insertion point for compact action controls
- `src/components/__tests__/App.placement.test.tsx` - existing placement persistence behavior
- `src/components/__tests__/PuzzleBoard.interaction.test.tsx` - Phase 03 interaction regression baseline
- React docs: https://react.dev/learn/updating-arrays-in-state
- Vitest docs: https://vitest.dev/guide/mocking/timers
- Vite docs: https://vite.dev/config/shared-options.html#resolve-alias
- Testing Library docs: https://testing-library.com/docs/dom-testing-library/api-events/
- npm registry metadata via `npm view` (2026-03-28)

### Secondary (MEDIUM confidence)
- None.

### Tertiary (LOW confidence)
- None.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - verified directly from repo + npm registry on 2026-03-28
- Architecture: HIGH - aligned with locked Phase 04 decisions and existing Phase 03 code boundaries
- Pitfalls: HIGH - derived from current interaction/state implementation and known React state constraints

**Research date:** 2026-03-28
**Valid until:** 2026-04-27
