# Phase 2: Deterministic Rectangle Rules - Research

**Researched:** 2026-03-27
**Domain:** Pure TypeScript puzzle-rule evaluation for rectangle placement and solved-board analysis
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
### Solve source of truth
- **D-01:** Gameplay solve checking is rules-first, not bundled-solution-first.
- **D-02:** Any board that fully satisfies the rectangle rules counts as solved, even if it differs from the starter pack’s bundled `solution` rectangles.
- **D-03:** Bundled `solution` data remains useful for tooling, fixtures, QA, and future hint/debug workflows, but not as the gameplay authority.

### Validation result contract
- **D-04:** The core engine should produce full diagnostics rather than only boolean pass/fail or a single reason code.
- **D-05:** Gameplay-facing APIs should be thin wrappers over the same full-analysis engine instead of maintaining a separate validation path.
- **D-06:** A simpler gameplay wrapper may expose a primary reason, but that primary reason must be derived deterministically from the full-analysis result.

### Placement identity contract
- **D-07:** Candidate placements should include both rectangle geometry and the originating clue coordinates as first-class input.
- **D-08:** The rules engine should not infer clue ownership after the fact as its primary contract; it should validate a rectangle against the selected clue explicitly.

### Deterministic failure ordering
- **D-09:** Gameplay-facing wrappers should expose one primary invalid reason using a fixed priority order.
- **D-10:** The fixed v1 priority order is `missing_origin_clue` → `contains_other_clue` → `wrong_area` → `out_of_bounds` → `overlap`.
- **D-11:** Full diagnostics still include all applicable failures; the ordering only governs the primary surfaced reason.

### Solved-board analysis strictness
- **D-12:** The engine should support a complete deterministic solved-board assessment that evaluates coverage, clue satisfaction, overlap state, and other board diagnostics every time full analysis is requested.
- **D-13:** Lightweight yes/no or primary-reason helpers should wrap this same core analysis rather than duplicating logic.

### Claude's Discretion
- Exact type and function names for the rules engine API, as long as they preserve the explicit originating-clue contract
- Exact internal data structures used to compute diagnostics, provided the external behavior stays deterministic and UI-independent
- Exact shape of secondary diagnostic metadata beyond the locked failure reasons and full-analysis behavior

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| RULE-01 | System rejects rectangles that leave the board bounds | Placement analysis must compute `out_of_bounds` in full diagnostics, then derive primary reason from fixed ordering. |
| RULE-02 | System rejects rectangles that overlap an existing placed rectangle | Placement and board analysis should share one occupancy-based overlap detector. |
| RULE-03 | System rejects rectangles that include another clue cell | Placement analysis must distinguish origin clue from foreign clues and report `contains_other_clue`. |
| RULE-04 | System rejects rectangles that do not include the selected clue cell | Candidate placement contract must include explicit origin clue coordinates and report `missing_origin_clue`. |
| RULE-05 | System rejects rectangles whose area does not match the selected clue value | Area checks should compare normalized rectangle area against the selected clue value and report `wrong_area`. |
| RULE-06 | System can determine when the board is fully covered with valid non-overlapping rectangles and all clues are satisfied | Board analysis should aggregate placement diagnostics, coverage, clue assignment, and overlap state from one deterministic engine. |
| RULE-07 | Puzzle validation logic is deterministic, unit-testable, and UI-independent | Implement pure TypeScript functions under a non-React rules module with table-driven Vitest coverage. |
</phase_requirements>

## Summary

Phase 2 does not need new libraries. The existing TypeScript and Vitest stack is sufficient for a pure rules engine, and the current repo structure already gives a clean seam: puzzle types in `src/types`, starter-pack loading in `src/data`, and UI components that should remain consumers of rule outputs rather than rule owners.

The main planning concern is contract design, not algorithmic complexity. Boards are only 4x4 through 8x8, so simple `Map` and `Set` based cell enumeration is the standard approach. The critical correctness decisions are already locked: validation is rules-first, origin clue is explicit input, full diagnostics are the source of truth, and the gameplay-facing primary invalid reason is a deterministic projection with fixed priority rather than an early-return branch.

The shipped starter pack is a reliable fixture source. I verified locally that all 40 bundled `solution` partitions stay in bounds, cover their boards exactly, have no overlaps, and place exactly one clue inside each rectangle. Use those records for happy-path tests and add small synthetic fixtures for invalid states that the shipped content will never contain.

**Primary recommendation:** Plan this phase around one pure full-analysis engine plus thin wrappers, not around separate boolean helper chains or bundled-solution comparisons.

## Project Constraints (from CLAUDE.md)

- Web browser only on desktop and mobile.
- Frontend-only architecture with localStorage persistence; avoid backend dependencies.
- Deterministic, unit-testable puzzle logic is a top-level quality requirement.
- Use the existing 40-puzzle starter pack as launch content.
- Scope is a weekend MVP; favor the polished core loop over expansion work.
- Do not make direct repo edits outside a GSD workflow unless explicitly asked to bypass it.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | 5.9.2 (project-installed) | Pure rules module types and exhaustive diagnostics modeling | Existing repo standard; strong fit for discriminated unions and deterministic contracts. |
| Vitest | 3.2.4 (project-installed, npm latest tag on 2026-03-27 search) | Unit tests for pure placement and board analysis | Already configured, fast, and aligned with current repo test workflow. |
| Node built-ins (`Map`, `Set`, arrays) | Node 22.16.0 runtime | Cell occupancy, clue indexing, deterministic analysis | Board sizes are tiny; no geometry or state library is justified. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| React | 19.1.1 (project-installed) | Consumer of rule outputs only | Later phases should call the rules engine from UI, not embed rule logic in components. |
| Testing Library | 16.3.0 (project-installed) | Integration coverage around consumers | Keep for app-level tests; Phase 2 itself should be mostly pure-unit coverage. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Pure function module with `Map`/`Set` | Class-based engine | Adds state and lifecycle complexity without solving a real problem on 8x8 boards. |
| Shared full-analysis engine | Separate placement validator and solved-board validator | Duplicates rule logic and invites drift in failure behavior. |
| Existing Vitest setup | Add a second test runner | Unnecessary overhead for a small pure-logic phase. |

**Installation:** No additional packages required for this phase.

**Version verification:** Local project versions are `typescript@5.9.2`, `vitest@3.2.4`, `react@19.1.1`, and `@testing-library/react@16.3.0` from `package.json`. External verification on 2026-03-27 confirmed Vitest latest tag `3.2.4` on npm. I did not rely on adding or changing dependencies for this phase.

## Architecture Patterns

### Recommended Project Structure
```text
src/
├── types/                  # Shared puzzle data contracts
├── rules/                  # Pure rectangle and board analysis functions
│   ├── rectangleRules.ts   # Placement normalization + single-placement analysis
│   ├── boardRules.ts       # Board-wide aggregation and solved-state analysis
│   └── __tests__/          # Pure unit tests, no React rendering
└── data/                   # Starter-pack fixtures and adapters
```

### Pattern 1: Full Diagnostics As The Source Of Truth
**What:** Every placement and board evaluation returns structured diagnostics first; booleans and primary-reason helpers derive from that result.
**When to use:** Always. This is the locked validation contract for the phase.
**Example:**
```typescript
type PlacementIssue =
  | "missing_origin_clue"
  | "contains_other_clue"
  | "wrong_area"
  | "out_of_bounds"
  | "overlap";

interface CandidatePlacement {
  row: number;
  col: number;
  width: number;
  height: number;
  originClueRow: number;
  originClueCol: number;
}

interface PlacementAnalysis {
  isValid: boolean;
  issues: PlacementIssue[];
  primaryIssue: PlacementIssue | null;
  coveredCells: string[];
}
```
Source: TypeScript union guidance from https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html and the locked phase contract in `02-CONTEXT.md`.

### Pattern 2: Normalize Geometry Once, Then Reuse It Everywhere
**What:** Derive area, cell coordinates, bounds status, and clue membership from a normalized rectangle helper instead of recomputing ad hoc in multiple functions.
**When to use:** In both placement analysis and board-wide solved checks.
**Example:**
```typescript
function getRectangleCells(rect: { row: number; col: number; width: number; height: number }) {
  const cells: Array<{ row: number; col: number; key: string }> = [];

  for (let row = rect.row; row < rect.row + rect.height; row += 1) {
    for (let col = rect.col; col < rect.col + rect.width; col += 1) {
      cells.push({ row, col, key: `${row}:${col}` });
    }
  }

  return cells;
}
```
Source: Project pattern inferred from `src/data/starterPack.ts` using one canonical adapter layer.

### Pattern 3: Fixed Priority Is A Projection, Not Evaluation Order
**What:** Compute all applicable failures first, then choose `primaryIssue` using the locked priority order.
**When to use:** Any gameplay-facing wrapper that needs one reason string.
**Example:**
```typescript
const ISSUE_PRIORITY: PlacementIssue[] = [
  "missing_origin_clue",
  "contains_other_clue",
  "wrong_area",
  "out_of_bounds",
  "overlap",
];

function getPrimaryIssue(issues: PlacementIssue[]): PlacementIssue | null {
  return ISSUE_PRIORITY.find((issue) => issues.includes(issue)) ?? null;
}
```
Source: Locked decision `D-10` in `02-CONTEXT.md`.

### Pattern 4: Board Analysis Reuses Placement Analysis
**What:** Board-wide solved-state checks should analyze each placed rectangle with the same placement validator, then aggregate coverage, clue satisfaction, and overlap/coverage gaps.
**When to use:** Any `analyzeBoard` or `isSolved` style helper.
**Example:**
```typescript
interface BoardAnalysis {
  isSolved: boolean;
  uncoveredCells: string[];
  overlappingCells: string[];
  unsatisfiedClues: string[];
  invalidPlacements: PlacementAnalysis[];
}
```
Source: Locked decisions `D-12` and `D-13` in `02-CONTEXT.md`.

### Anti-Patterns to Avoid
- **Bundled-solution equality as gameplay truth:** Rejects alternate valid partitions and directly violates `D-01` through `D-03`.
- **Inferring origin clue from rectangle contents:** Breaks the explicit placement identity contract in `D-07` and `D-08`.
- **Early-return validation:** Prevents full diagnostics and can make `primaryIssue` dependent on code order instead of the locked priority list.
- **UI-coupled rules:** Putting validation in React components makes Phase 3 harder and weakens RULE-07.
- **Separate overlap math in placement and solved checks:** Creates drift between "can place" and "board solved" behavior.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Board occupancy tracking | Spatial tree or geometry library | `Set<string>` / `Map<string, ...>` keyed by `row:col` | Maximum board area is 64 cells; simple cell maps are clearer and easier to test. |
| Gameplay invalid reason selection | Branchy `if/else` early returns in UI handlers | Full `issues[]` plus one deterministic priority function | Keeps diagnostics complete and primary reason stable. |
| Solved-state authority | Comparison to bundled `solution` rectangles | Rules-first board aggregation | Alternate valid partitions must count as solved. |
| Phase test infrastructure | Custom assertion helpers or a new runner | Existing Vitest + table-driven tests | Current suite is green and already part of repo workflow. |

**Key insight:** The hard part of this phase is not geometry performance. It is preserving one deterministic contract across placement checks, board solve checks, and future UI wrappers.

## Common Pitfalls

### Pitfall 1: Treating Primary Failure Order As Evaluation Order
**What goes wrong:** The first check in code becomes the only reported failure, so diagnostics differ if implementation order changes.
**Why it happens:** Early-return validators are the default instinct.
**How to avoid:** Collect all issues first, then derive `primaryIssue` from the locked priority list.
**Warning signs:** Tests only assert one reason at a time and never inspect multi-failure cases.

### Pitfall 2: Using Bundled Solutions As Gameplay Validation
**What goes wrong:** A board that obeys all rules but differs from the shipped `solution` is marked invalid or unsolved.
**Why it happens:** The starter pack already contains `solution` rectangles, so it is tempting to compare against them directly.
**How to avoid:** Use bundled solutions only for fixtures and positive-path verification.
**Warning signs:** `isSolved` or placement checks accept a `solution` array as an input.

### Pitfall 3: Confusing The Selected Clue With "Any Clue In The Rectangle"
**What goes wrong:** A rectangle that contains the selected clue plus another clue is accepted, or a rectangle that omits the selected clue but contains some other clue is misclassified.
**Why it happens:** The phase requires both explicit origin inclusion and rejection of foreign clues.
**How to avoid:** Index clues once, check origin inclusion explicitly, then count or list non-origin clues separately.
**Warning signs:** Validation logic only checks clue count, not clue identity.

### Pitfall 4: Letting Placement And Board Rules Drift
**What goes wrong:** A rectangle can be "valid" in preview but still make the board analyzer fail for different reasons.
**Why it happens:** Placement and solved-board logic get implemented as separate systems.
**How to avoid:** Board analysis should call the same placement analyzer for each rectangle and then add aggregate checks.
**Warning signs:** Duplicate overlap or area logic across multiple files.

### Pitfall 5: Overfitting Tests To Shipped Fixtures
**What goes wrong:** Positive-path tests pass, but invalid-state branches remain untested because the starter pack contains only valid solutions.
**Why it happens:** The fixture set is clean by design.
**How to avoid:** Use starter-pack puzzles for valid partitions and add compact synthetic rectangles for overlaps, wrong area, out-of-bounds, and multi-failure ordering.
**Warning signs:** No test constructs an impossible or conflicting placement directly.

## Code Examples

Verified patterns from current stack and official docs:

### Deterministic Primary Issue Wrapper
```typescript
const ISSUE_PRIORITY = [
  "missing_origin_clue",
  "contains_other_clue",
  "wrong_area",
  "out_of_bounds",
  "overlap",
] as const;

type PlacementIssue = (typeof ISSUE_PRIORITY)[number];

export function toPrimaryIssue(issues: PlacementIssue[]): PlacementIssue | null {
  return ISSUE_PRIORITY.find((issue) => issues.includes(issue)) ?? null;
}
```
Source: locked decision `D-10` in `02-CONTEXT.md`.

### Table-Driven Vitest For Pure Rules
```typescript
import { describe, expect, it } from "vitest";

describe("toPrimaryIssue", () => {
  it.each([
    [["overlap"], "overlap"],
    [["wrong_area", "overlap"], "wrong_area"],
    [["out_of_bounds", "contains_other_clue"], "contains_other_clue"],
  ])("returns %s -> %s", (issues, expected) => {
    expect(toPrimaryIssue(issues)).toBe(expected);
  });
});
```
Source: current repo test style in `src/data/__tests__/starterPack.test.ts` and Vitest config guidance at https://vitest.dev/config/.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Bundled-solution equality | Rules-first solved-board analysis | Locked on 2026-03-27 in Phase 2 context | Supports alternate valid partitions and keeps gameplay trustworthy. |
| Boolean-only validators | Full diagnostics plus deterministic primary wrapper | Locked on 2026-03-27 in Phase 2 context | Later UI can show one reason without losing deeper analysis. |
| UI-owned validation | Pure TypeScript rules module | Already implied by RULE-07 and current repo structure | Keeps React components thin and Phase 3 integration simple. |

**Deprecated/outdated:**
- Using starter-pack `solution` as gameplay truth: replaced by rules-first analysis.
- Separate validation code paths for placement and solved detection: replaced by a shared full-analysis core.

## Open Questions

1. **Exact public API names and file split**
   - What we know: The external behavior is locked, but names are discretionary.
   - What's unclear: Whether the planner should expose `analyzePlacement` / `analyzeBoard` / `isBoardSolved` or slightly different names.
   - Recommendation: Decide in planning, but keep one low-level full-analysis API and a small wrapper surface.

2. **How rich secondary diagnostics should be in v1**
   - What we know: Full diagnostics are required, and extra metadata is discretionary.
   - What's unclear: Whether to return only issue codes or also offending clue coordinates, overlap cell keys, and uncovered cell lists.
   - Recommendation: Include cell-key lists for board analysis and foreign-clue coordinates for placement analysis if they help tests and future UI, but do not add UI-specific messaging.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 3.2.4 |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run src/rules/__tests__/rectangleRules.test.ts src/rules/__tests__/boardRules.test.ts` |
| Full suite command | `npm test -- --run` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| RULE-01 | Reject out-of-bounds rectangles | unit | `npx vitest run src/rules/__tests__/rectangleRules.test.ts -t "rejects out-of-bounds rectangles"` | ❌ Wave 0 |
| RULE-02 | Reject overlapping rectangles | unit | `npx vitest run src/rules/__tests__/rectangleRules.test.ts -t "rejects overlaps against placed rectangles"` | ❌ Wave 0 |
| RULE-03 | Reject rectangles containing another clue | unit | `npx vitest run src/rules/__tests__/rectangleRules.test.ts -t "rejects rectangles containing non-origin clues"` | ❌ Wave 0 |
| RULE-04 | Reject rectangles missing the selected clue | unit | `npx vitest run src/rules/__tests__/rectangleRules.test.ts -t "rejects rectangles missing origin clue"` | ❌ Wave 0 |
| RULE-05 | Reject wrong-area rectangles | unit | `npx vitest run src/rules/__tests__/rectangleRules.test.ts -t "rejects rectangles with wrong area"` | ❌ Wave 0 |
| RULE-06 | Detect fully solved boards using rules-first analysis | unit | `npx vitest run src/rules/__tests__/boardRules.test.ts -t "marks a fully covered valid board as solved"` | ❌ Wave 0 |
| RULE-07 | Deterministic and UI-independent logic contract | unit | `npx vitest run src/rules/__tests__/rectangleRules.test.ts src/rules/__tests__/boardRules.test.ts` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run src/rules/__tests__/rectangleRules.test.ts src/rules/__tests__/boardRules.test.ts`
- **Per wave merge:** `npm test -- --run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/rules/__tests__/rectangleRules.test.ts` — placement diagnostics, fixed issue ordering, and deterministic wrappers
- [ ] `src/rules/__tests__/boardRules.test.ts` — solved-board aggregation, uncovered cells, and invalid placement propagation
- [ ] `src/rules/__tests__/starterPackSolutions.test.ts` — verify shipped `solution` partitions pass rules-first analysis without making them gameplay authority

## Sources

### Primary (HIGH confidence)
- Local phase context: `/Users/hemalpatel/Development/fill-the-squares/.planning/phases/02-deterministic-rectangle-rules/02-CONTEXT.md` - locked behavior, failure ordering, and contract rules
- Local requirements: `/Users/hemalpatel/Development/fill-the-squares/.planning/REQUIREMENTS.md` - RULE-01 through RULE-07 definitions
- Local project constraints: `/Users/hemalpatel/Development/fill-the-squares/CLAUDE.md` - project-level constraints and GSD workflow directives
- Local implementation baseline: `/Users/hemalpatel/Development/fill-the-squares/src/types/puzzle.ts`, `/Users/hemalpatel/Development/fill-the-squares/src/data/starterPack.ts`, `/Users/hemalpatel/Development/fill-the-squares/src/components/PuzzleBoard.tsx`, `/Users/hemalpatel/Development/fill-the-squares/src/App.tsx`
- Local fixture source: `/Users/hemalpatel/Development/fill-the-squares/Origianl Assets/squares-starter-pack.json` and `/Users/hemalpatel/Development/fill-the-squares/Origianl Assets/REQUIREMENTS.md`

### Secondary (MEDIUM confidence)
- Vitest config docs: https://vitest.dev/config/ - confirms current config-driven test structure
- Vitest environment docs: https://vitest.dev/config/environmentoptions - confirms environment scoping and mixed-environment support
- TypeScript unions handbook: https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html - supports discriminated-union recommendation for diagnostics
- npm package metadata for Vitest: https://www.npmjs.com/package/vitest - latest tag verification used for current stack note

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - no new dependencies are needed; current project stack and Vitest docs are sufficient.
- Architecture: HIGH - driven mostly by locked phase decisions plus small-board constraints verified from shipped data.
- Pitfalls: HIGH - directly derived from locked constraints and from common drift risks in split validator designs.

**Research date:** 2026-03-27
**Valid until:** 2026-04-26
