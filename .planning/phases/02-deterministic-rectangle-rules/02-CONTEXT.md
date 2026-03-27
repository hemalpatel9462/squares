# Phase 2: Deterministic Rectangle Rules - Context

**Gathered:** 2026-03-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 2 delivers the pure rules engine for Squares: deterministic rectangle validation and solved-board analysis that remain independent from UI components and input handling. This phase defines the core logic contracts and diagnostic behavior the later interaction layers will call, but it does not implement drag behavior, placement previews, or player-facing UI feedback itself.

</domain>

<decisions>
## Implementation Decisions

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

### the agent's Discretion
- Exact type and function names for the rules engine API, as long as they preserve the explicit originating-clue contract
- Exact internal data structures used to compute diagnostics, provided the external behavior stays deterministic and UI-independent
- Exact shape of secondary diagnostic metadata beyond the locked failure reasons and full-analysis behavior

</decisions>

<specifics>
## Specific Ideas

- The engine should feel trustworthy enough that later UI can surface its outputs without second-guessing them.
- The bundled `solution` rectangles should help tests and tooling, but should not make the game reject an alternate valid partition.
- The gameplay layer should be able to ask for a single primary invalid reason without losing access to the richer diagnostic picture underneath.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product and phase scope
- `.planning/PROJECT.md` — core value, quality priorities, and architecture constraints for the MVP
- `.planning/REQUIREMENTS.md` — Phase 2 requirement definitions for RULE-01 through RULE-07
- `.planning/ROADMAP.md` — Phase 2 goal, dependency on Phase 1, and success criteria
- `.planning/STATE.md` — current project status and prior execution decisions

### Prior phase decisions and implementation baseline
- `.planning/phases/01-starter-pack-board-shell/01-CONTEXT.md` — Phase 1 decisions that established a read-only shell and clean separation before interaction work
- `src/types/puzzle.ts` — current puzzle and starter-pack type contracts
- `src/data/starterPack.ts` — canonical starter-pack adapter and normalization helpers
- `src/components/PuzzleBoard.tsx` — current read-only board rendering baseline
- `src/App.tsx` — current app-level state shape and puzzle selection flow

### Source materials
- `Origianl Assets/REQUIREMENTS.md` — original rule and validation notes for the puzzle system
- `Origianl Assets/squares-starter-pack.json` — bundled puzzle content including `solution` rectangles, used for tooling/tests but not gameplay truth

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/types/puzzle.ts`: shared puzzle, clue, and rectangle types that the rules engine can extend or complement
- `src/data/starterPack.ts`: normalized puzzle access helpers and bundled content source
- `src/components/PuzzleBoard.tsx`: current read-only board rendering that should remain a consumer of engine outputs, not the source of logic

### Established Patterns
- Phase 1 kept the UI read-only and separated data access from rendering, which creates a clean seam for introducing pure rules logic now.
- The codebase already treats starter-pack data through one canonical adapter rather than raw JSON reads in components.

### Integration Points
- Phase 2 should introduce a pure logic layer that later interaction work in Phase 3 can call when evaluating candidate rectangles.
- The engine should be easy to test in isolation without mounting React components.
- Future UI feedback can consume both full diagnostics and the deterministic primary reason from the same core engine outputs.

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-deterministic-rectangle-rules*
*Context gathered: 2026-03-27*
