# Phase 1: Starter Pack Board Shell - Research

**Date:** 2026-03-27
**Status:** Complete

## Research Question

What do we need to know to plan Phase 1 well so the project starts with a strong board shell, canonical puzzle loading, and UI foundations that later phases can extend cleanly?

## Key Findings

### 1. Phase 1 should establish the app skeleton, data contract, and read-only puzzle screen

Because there is no existing application code, Phase 1 needs to cover more than a single visual component. The plan should include:

- project bootstrap for the chosen frontend stack
- a canonical puzzle data module built from `Origianl Assets/squares-starter-pack.json`
- shared puzzle schema/types
- a read-only board renderer that supports 4x4 through 8x8 layouts
- a puzzle screen shell that displays integrated metadata and premium framing

This keeps later phases focused on interaction and rules logic instead of backfilling missing foundations.

### 2. The starter-pack JSON should remain the canonical content source, with a normalized app-facing layer

The shipped content already contains:

- `counts.total = 40`
- difficulty distribution for easy, medium, and hard
- per-puzzle `id`, `size`, `difficulty`, `clues[]`, and `solution[]`

The app should not mutate this raw file directly inside UI code. A small data-layer adapter should:

- expose typed puzzle records
- validate the expected fields at load time
- derive lightweight app metadata such as pack position and display labels
- keep the original puzzle structure intact for later engine and progression phases

### 3. Board rendering should be read-only in Phase 1 and explicitly stop short of placement logic

Phase 1 should render:

- the board grid sized from puzzle `size`
- clue cells in the correct coordinates
- clear clue emphasis versus empty cells
- integrated metadata for puzzle id, difficulty, and simple pack progress

Phase 1 should not yet implement:

- selection state
- drag previews
- validation
- solve detection

That separation matters because Phase 2 owns deterministic rules and Phase 3 owns interaction.

### 4. Responsive behavior should optimize for legibility first, then framing

The discussion context sets a clear device strategy:

- desktop: more framed, composed, immersive play surface
- mobile: preserve board size first, minimize wasted chrome

The plan should therefore include:

- a board container that scales by puzzle size
- layout rules that keep the grid square and centered
- metadata integrated into the same visual surface without shrinking the board excessively on mobile

### 5. The visual system should be intentionally premium from the first pass

The user chose:

- balanced game layout
- standard metadata integrated with the board surface
- modern premium game tone
- soft elevated surfaces
- immersive play-surface composition

Phase 1 planning should translate that into concrete setup tasks such as:

- foundational design tokens or CSS variables
- background and surface treatments that support depth without clutter
- clue-cell styling states for readable static display
- a screen composition that feels deliberate even before game actions exist

### 6. Phase 1 should leave obvious extension points for later phases

The first implementation should make later work easier by creating:

- shared puzzle types that rules logic can reuse
- a board renderer that can accept future overlays and region states
- a puzzle screen layout that can host controls in later phases
- clean separation between content loading, board rendering, and future interaction logic

## Recommended Planning Shape

Phase 1 likely benefits from 3 plans:

1. App foundation and canonical puzzle data ingestion
2. Read-only board renderer and puzzle metadata shell
3. Visual polish and responsive composition for the immersive premium surface

This keeps setup, functional board rendering, and presentation polish separable while still respecting the phase goal.

## Risks And Planning Watchouts

### Risk: Overbuilding interaction too early

The board shell can easily blur into placement work. Plans should explicitly keep rectangle selection, preview, and validation out of scope.

### Risk: Baking raw JSON assumptions into components

If UI components read the starter-pack file shape directly everywhere, later refactors get harder. A typed adapter layer is worth adding in Phase 1.

### Risk: Premium styling that sacrifices legibility

Soft elevation and immersive framing should not reduce clue readability or board clarity. The board must still read instantly as a logic puzzle surface.

### Risk: Mobile shell crowding the board

Integrated metadata is part of the desired product feel, but on smaller screens it must collapse or compress rather than stealing too much board space.

## Concrete Recommendations

- Bootstrap a modern React + TypeScript web app with a simple, low-friction styling approach suited to design tokens.
- Add a dedicated puzzle data module that imports the starter pack, validates structure, and exports normalized puzzle records plus pack summary metadata.
- Define shared puzzle, clue, and rectangle types in a central types module during Phase 1.
- Build the board renderer as a presentational component tree with no interaction side effects.
- Separate app shell, data loading, and board rendering into distinct modules so later phases can slot in logic and controls cleanly.
- Include one or more lightweight tests that validate starter-pack ingestion and board-rendering assumptions early, since this phase establishes the project baseline.

## Validation Architecture

### Best Fit For This Phase

Because the repo starts without app code, validation should focus on fast feedback for:

- puzzle data shape integrity
- normalized puzzle loading behavior
- board-render utility behavior where applicable
- at least one render smoke test for a sample puzzle view

### Suggested Test Strategy

- Use a frontend-friendly test runner that supports TypeScript and component rendering.
- Add one quick command suitable for phase execution loops.
- Keep early tests small and structural; deeper interaction tests belong to later phases.

### Validation Expectations For Planning

The plans for Phase 1 should include tasks that establish:

- a runnable test command
- at least one data-loading verification path
- at least one render or component smoke-test path
- acceptance criteria that verify the 40-puzzle pack is available and that representative board sizes render correctly

## Planning Input Summary

Downstream planner should preserve these truths:

- Phase 1 is the first app bootstrap, not just a UI tweak.
- The shipped 40-puzzle JSON is the content source of truth.
- The board shell is read-only in this phase.
- The visual direction should already feel modern, premium, soft-elevated, and immersive.
- Mobile must protect board size while desktop can afford richer framing.
