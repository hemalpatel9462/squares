# Phase 5: Puzzle Browser & Session Context - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 5 delivers difficulty-based puzzle browsing and session-context restore for browsing state. Players should browse puzzles by difficulty, choose a puzzle, and keep that difficulty context visible when entering play. This phase adds browsing and context restore only; completion tracking, solved-state progression, and next-puzzle completion UX remain out of scope for later phases.

</domain>

<decisions>
## Implementation Decisions

### Browser entry model
- **D-01:** Use a dedicated browser view first, then enter puzzle play.
- **D-02:** The browser should be the primary place to choose puzzle difficulty and puzzle id before opening the board.

### Difficulty navigation behavior
- **D-03:** Use segmented difficulty tabs (`Easy`, `Medium`, `Hard`) in the browser view.
- **D-04:** Puzzle list content switches directly by selected tab rather than secondary nested filters.

### Session restore policy
- **D-05:** Persist and restore selected difficulty only for this phase (roadmap minimum scope).
- **D-06:** Do not persist full browser/play UI state in Phase 5.

### First-load and invalid-storage fallback
- **D-07:** If saved difficulty is missing or invalid, derive fallback from the last playable puzzle context when available.
- **D-08:** If no derivable puzzle context exists, default to `Easy`.

### In-play difficulty context visibility
- **D-09:** Best-guess decision: keep active difficulty visibly present in play view (meta/context surface) so players see which browser context they came from.
- **D-10:** Best-guess decision: provide a clear path back to browser that preserves currently selected difficulty tab.

### the agent's Discretion
- Exact localStorage key naming and serialization format for selected difficulty.
- Exact browser-to-play transition animation/layout treatment within the established shell style.
- Exact copy for browser headings, empty-states, and back-to-browser affordance.

</decisions>

<specifics>
## Specific Ideas

- Browser-first flow should reduce friction when selecting by difficulty and avoid overloading the play shell.
- Difficulty context should remain obvious during play to maintain orientation.
- Restore behavior should stay simple and robust in this phase: selected difficulty only.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product and phase scope
- `.planning/PROJECT.md` — MVP scope priorities, frontend-only constraints, and quality bar.
- `.planning/REQUIREMENTS.md` — `PACK-03` and `SAVE-02` requirements mapped to Phase 5.
- `.planning/ROADMAP.md` — Phase 5 goal, dependencies, and success criteria.
- `.planning/STATE.md` — current project position and cross-phase decisions.

### Prior phase decisions
- `.planning/phases/01-starter-pack-board-shell/01-CONTEXT.md` — board-first shell direction and metadata framing.
- `.planning/phases/03-live-rectangle-placement/03-CONTEXT.md` — cross-device interaction consistency and polished feedback expectations.
- `.planning/phases/04-correction-controls/04-CONTEXT.md` — compact controls and app-owned state orchestration conventions.

### Existing implementation baseline
- `src/App.tsx` — current puzzle index ownership, placement history state, and shell routing point.
- `src/data/starterPack.ts` — canonical starter-pack data and difficulty metadata on puzzle records.
- `src/types/puzzle.ts` — difficulty type contracts (`easy|medium|hard`) and puzzle list shape.
- `src/components/PuzzleShell.tsx` — current play-shell composition that Phase 5 must integrate with.
- `src/components/PuzzleNavigator.tsx` — existing next/previous puzzle navigation UX.
- `src/components/PuzzleMeta.tsx` — current puzzle metadata display area for in-play context visibility.
- `src/components/__tests__/App.test.tsx` — app-level rendering baseline for added browser routing/tests.
- `src/components/__tests__/App.placement.test.tsx` — regression surface for placement state staying puzzle-scoped after browser work.

### Source materials
- `Origianl Assets/REQUIREMENTS.md` — original pack browsing and persistence notes.
- `Origianl Assets/squares-starter-pack.json` — canonical puzzle ids and difficulty distribution used by browser lists.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/data/starterPack.ts`: already exposes full puzzle list with `difficulty` and `difficultyLabel`, ideal for grouped browser lists.
- `src/App.tsx`: already owns top-level session state and is the right place for selected-difficulty persistence and browser/play view switching.
- `src/components/PuzzleMeta.tsx`: existing metadata strip can carry visible difficulty context in play mode.
- `src/components/PuzzleNavigator.tsx`: reusable navigation controls can be adapted or supplemented once browser entry is introduced.

### Established Patterns
- App-owned source-of-truth state with stateless child components is the current architecture pattern.
- Puzzle interactions and corrections are already puzzle-scoped and should remain isolated from browser-state persistence.
- Tests use Vitest + Testing Library with direct interaction flows, which can extend cleanly to browser/tab persistence assertions.

### Integration Points
- Add selected-difficulty state and browser/play route state in `App.tsx`.
- Create or extend browser UI component(s) for segmented difficulty tabs and filtered puzzle list entry.
- Persist selected difficulty via localStorage at App boundary; hydrate during initial app load.
- Keep play-mode metadata aligned with selected difficulty context and back-navigation behavior.

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 05-puzzle-browser-session-context*
*Context gathered: 2026-03-28*
