# Phase 4: Correction Controls - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 4 delivers fast correction controls for the current puzzle session: remove a placed rectangle directly from the board, undo through multi-step history, and reset the current puzzle using scoped confirmation behavior. This phase improves recovery from mistakes without adding new progression, completion, or puzzle-browsing capabilities.

</domain>

<decisions>
## Implementation Decisions

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

### the agent's Discretion
- Exact multi-step history depth and internal history structure, as long as behavior is consistent and testable.
- Exact visual treatment for selected/hovered removable rectangles, as long as readability stays calm and clear.
- Exact copy for reset confirmation messaging, as long as it is explicit and concise.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product and phase scope
- `.planning/PROJECT.md` — product direction and quality priorities for polished, low-friction gameplay.
- `.planning/REQUIREMENTS.md` — `PLAY-05` requirement for remove, undo, and reset behavior.
- `.planning/ROADMAP.md` — Phase 4 goal, dependency on Phase 3, and success criteria.
- `.planning/STATE.md` — current project position and handoff status after Phase 3 verification.

### Prior phase decisions
- `.planning/phases/03-live-rectangle-placement/03-CONTEXT.md` — interaction style, cross-device behavior, and polished feedback expectations to preserve.
- `.planning/phases/03-live-rectangle-placement/03-HUMAN-UAT.md` — verified desktop and mobile interaction quality baseline.

### Existing implementation baseline
- `src/App.tsx` — placement state ownership (`placementsByPuzzleId`) and current placement commit path.
- `src/components/PuzzleShell.tsx` — current shell structure and likely insertion point for compact correction controls.
- `src/components/PuzzleBoard.tsx` — placed-rectangle rendering and board interaction events needed for direct removal.
- `src/components/__tests__/App.placement.test.tsx` — current persistence and placement UX tests to extend for correction controls.
- `src/components/__tests__/PuzzleBoard.interaction.test.tsx` — interaction coverage baseline for drag/preview/release flow compatibility.
- `src/rules/placementAnalysis.ts` — overlap/validity analysis assumptions that correction flows must not violate.

### Source materials
- `Origianl Assets/REQUIREMENTS.md` — original gameplay interaction framing for correction behavior expectations.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/App.tsx`: already stores placements by puzzle id and can host undo/reset history state.
- `src/components/PuzzleShell.tsx`: already composes board and prompt content; supports adding a compact action row without reworking page structure.
- `src/components/PuzzleBoard.tsx`: already marks placed regions (`data-placed-rectangle`) and handles pointer interactions, enabling direct rectangle removal from board cells.

### Established Patterns
- Placement validity remains rules-driven (`analyzePlacement`) with App as owner of committed placement state.
- Interaction feedback is restrained and polished, with mobile-aware thresholds and readable board cues.
- Tests already validate puzzle-scoped placement persistence and board interaction behavior.

### Integration Points
- Add remove callbacks from `PuzzleBoard` to `App` through `PuzzleShell` forwarding, matching existing `onPlaceRectangle` flow.
- Introduce action history in App for multi-step undo and reset consistency.
- Extend component tests to cover remove, multi-step undo, and smart reset confirmation without regressing Phase 3 drag behavior.

</code_context>

<specifics>
## Specific Ideas

- Removing should feel as direct as placing: interact with the board, not a detached management panel.
- Undo should support iterative correction, not only one immediate rollback.
- Reset should guard against accidental loss only when there is actual work to lose.
- Controls should stay lightweight and above-board so board focus remains primary.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 04-correction-controls*
*Context gathered: 2026-03-28*
