# Phase 3: Live Rectangle Placement - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 3 delivers the first interactive rectangle-placement flow for Squares: the player starts from a clue cell, drags out a candidate rectangle, sees live validity feedback during the gesture, and places the rectangle on release when valid. This phase defines the feel of direct manipulation, preview behavior, and release feedback, but does not yet add remove/undo/reset controls, progression systems, or completion UX beyond the act of placing rectangles.

</domain>

<decisions>
## Implementation Decisions

### Drag interaction shape
- **D-01:** Use free drag interaction rather than guided candidate snapping or strongly constrained scrubbing.
- **D-02:** The selected clue acts as a required anchor inside the rectangle rather than being forced to a corner-only model.
- **D-03:** Placement should arm on clue press and become an active drag after a tiny movement threshold rather than starting fully on press.
- **D-04:** That drag-start threshold should prioritize touch smoothness, with touch allowed to feel slightly more forgiving than desktop.

### Live preview feedback
- **D-05:** Preview feedback should be balanced and readable rather than ultra-minimal or highly explicit.
- **D-06:** The live preview should include a visible area cue during drag.
- **D-07:** Invalid preview styling should feel soft but clear rather than harsh or warning-heavy.
- **D-08:** When an invalid drag is released, the preview should use a noticeable-but-restrained soft snap-back.

### Cross-device input handling
- **D-09:** Mouse, touch, and pointer input should share the same conceptual interaction model.
- **D-10:** Touch should get slightly more forgiving handling than desktop to protect smoothness on phones.
- **D-11:** That touch forgiveness should show up as a balanced mix of easier drag tracking and kinder release handling, not only one or the other.

### Placed rectangle readability
- **D-12:** Once placed, rectangles should read as clear grouped regions on the board rather than barely-visible grouping or highly segmented puzzle-piece styling.
- **D-13:** Placed regions should be distinguished by a restrained balance of surface tint and edge separation together.

### Placement confirmation feel
- **D-14:** A valid release should feel like a subtle settle-in rather than an instant silent change or a heavy confirmation flourish.
- **D-15:** That confirmation should come from a balanced mix of quick surface settling and edge lock-in.

### the agent's Discretion
- Exact animation durations, easing, and threshold values, as long as the interaction remains fast and touch-friendly
- Exact visual design of the area cue, as long as it stays readable without cluttering the board
- Exact implementation of touch forgiveness, provided the interaction model stays conceptually the same across input types

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product and phase scope
- `.planning/PROJECT.md` — project vision, cross-device priorities, and the requirement to keep puzzle logic trustworthy and UI-separated
- `.planning/REQUIREMENTS.md` — Phase 3 requirements for `PLAY-01`, `PLAY-02`, `PLAY-03`, `PLAY-04`, `UX-03`, and `UX-04`
- `.planning/ROADMAP.md` — Phase 3 goal, dependency on Phases 1 and 2, and success criteria
- `.planning/STATE.md` — current project position and phase handoff state

### Prior phase decisions
- `.planning/phases/01-starter-pack-board-shell/01-CONTEXT.md` — board-first premium shell, integrated metadata, and mobile board-priority decisions
- `.planning/phases/02-deterministic-rectangle-rules/02-CONTEXT.md` — rules engine authority, diagnostic contract, and explicit origin-clue placement model
- `.planning/phases/02-deterministic-rectangle-rules/02-VERIFICATION.md` — verified evidence for the rules API the interaction layer must consume

### Existing implementation baseline
- `src/App.tsx` — current puzzle state owner and top-level shell integration point
- `src/components/PuzzleShell.tsx` — board shell composition that Phase 3 interaction work must preserve
- `src/components/PuzzleBoard.tsx` — current board rendering baseline that will become interactive
- `src/data/starterPack.ts` — starter-pack puzzle source used to drive live placement
- `src/rules/index.ts` — public rules API surface for placement and board analysis
- `src/rules/placementAnalysis.ts` — deterministic placement diagnostics and primary invalid-reason behavior
- `src/rules/boardAnalysis.ts` — aggregate board analysis used by later placement and solve checks

### Source materials
- `Origianl Assets/REQUIREMENTS.md` — original notes on puzzle interaction and rule behavior
- `Origianl Assets/squares-starter-pack.json` — canonical puzzle content and bundled solution fixtures

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/PuzzleBoard.tsx`: already renders the NxN grid and clue cells, making it the natural place to layer interactive hit-testing and live preview visuals
- `src/components/PuzzleShell.tsx`: already owns the premium framed presentation, so interaction feedback should fit inside that existing shell rather than introduce a new layout model
- `src/App.tsx`: currently owns the active puzzle selection state and is the likely coordination point for placed-rectangle session state before later persistence phases
- `src/rules/index.ts`: provides the stable public placement and board analysis APIs Phase 3 should call instead of embedding validation logic in React components

### Established Patterns
- Starter-pack data flows through a canonical adapter in `src/data/starterPack.ts` rather than raw JSON reads in UI code
- Puzzle logic now lives in pure TypeScript rules modules, and the UI is expected to consume those outputs rather than reimplement rule checks
- The existing shell is board-first and mobile-conscious, so interaction affordances should preserve board size and avoid clutter-heavy overlays

### Integration Points
- Live drag state will need to connect board pointer/touch events in `PuzzleBoard` to the deterministic placement analyzer in `@/rules`
- Preview visuals should integrate with the existing board cell rendering without breaking the premium framed shell established in Phase 1
- Valid release behavior will likely need app-level placed-rectangle state that can later feed Phase 4 correction controls and Phase 6 completion tracking

</code_context>

<specifics>
## Specific Ideas

- The interaction should feel tactile and direct, not like scrubbing through precomputed candidates.
- The player should feel the board responding continuously during drag without the UI second-guessing the rules engine.
- Touch should feel smoother and slightly more forgiving than desktop, but not like a different game.
- Invalid feedback should stay elegant and calm, while successful placement should have a small satisfying settle-in moment.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-live-rectangle-placement*
*Context gathered: 2026-03-28*
