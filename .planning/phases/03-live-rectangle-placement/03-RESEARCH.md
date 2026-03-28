# Phase 3: Live Rectangle Placement - Research

**Researched:** 2026-03-27
**Domain:** React pointer-driven rectangle placement with live rules-engine preview
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
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

### Claude's Discretion
- Exact animation durations, easing, and threshold values, as long as the interaction remains fast and touch-friendly
- Exact visual design of the area cue, as long as it stays readable without cluttering the board
- Exact implementation of touch forgiveness, provided the interaction model stays conceptually the same across input types

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PLAY-01 | Player can start a rectangle selection from a clue cell using mouse, touch, or pointer input | Use one pointer-event pipeline on clue-origin press, with a small movement threshold before drag activation. |
| PLAY-02 | Player can drag to preview the target rectangle before placement is confirmed | Keep transient drag state in `PuzzleBoard` and derive a `CandidatePlacement` from live pointer coordinates every move. |
| PLAY-03 | Player receives immediate visual feedback showing whether the current preview is valid or invalid | Call `analyzePlacement` on every drag update and render preview cells, area, and validity directly from that result. |
| PLAY-04 | Player can place a rectangle on release when the selection is valid | Commit only the last valid preview on `pointerup`; ignore invalid release and trigger soft snap-back feedback. |
| UX-03 | Placement feedback feels clean and satisfying, with visible area and validity cues during drag | Use restrained area chip, valid/invalid edge treatments, and a subtle settle animation aligned with `03-UI-SPEC.md`. |
| UX-04 | Placement validation feedback appears immediately during interaction | Avoid debounced validation; compute preview analysis synchronously from the rules engine during the drag session. |
</phase_requirements>

## Summary

Phase 3 does not need new libraries. The existing React 19, Vite, Vitest, Testing Library, and pure TypeScript rules stack already fits the problem. The repo’s clean seam is already present: [PuzzleBoard](/Users/hemalpatel/Development/fill-the-squares/src/components/PuzzleBoard.tsx) is still read-only, [App](/Users/hemalpatel/Development/fill-the-squares/src/App.tsx) already owns puzzle-level state, and [analyzePlacement](/Users/hemalpatel/Development/fill-the-squares/src/rules/placementAnalysis.ts) provides the exact deterministic validity contract the interaction layer should consume.

The planning challenge is interaction architecture, not algorithmic complexity. Standard current practice is one pointer-event interaction path, `touch-action` on the interactive board surface, and pointer capture once the drag becomes active. That avoids separate mouse/touch logic, prevents mobile scroll from canceling the gesture, and keeps drag tracking stable when the pointer leaves the board bounds.

The phase should split state in two layers. `App` should own committed placements so puzzle changes and future correction controls have one source of truth. `PuzzleBoard` should own ephemeral press/drag/snap-back state because it is local, high-frequency, and presentation-heavy. Every preview frame should derive a `CandidatePlacement`, call `analyzePlacement(size, clues, placement, placedRectangles)`, and render from the returned `PlacementAnalysis` instead of duplicating rule logic in React.

**Primary recommendation:** Plan Phase 3 around a board-local pointer session plus app-level committed placements, with preview validity derived live from `@/rules` on every move.

## Project Constraints (from AGENTS.md)

- Target web browsers on desktop and mobile only.
- Stay frontend-only; do not introduce backend dependencies.
- Keep puzzle logic deterministic and unit-testable.
- Use the existing 40-puzzle starter pack.
- Favor the polished core loop over scope expansion.
- Do not make repo edits outside a GSD workflow unless explicitly asked to bypass it.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.1.1 (project), npm latest `19.2.4` verified 2026-03-27 | Board interaction state and rendering | Existing app stack; pointer handlers and local state are enough for this phase. |
| React DOM | 19.1.1 (project) | DOM event wiring and board rendering | Existing runtime; no alternative renderer is justified. |
| TypeScript | 5.9.2 (project) | Gesture/session types, preview state, rules contracts | Already used across UI and rules modules. |
| `@/rules` placement API | repo-local | Deterministic preview and commit validation | Phase 2 already established the trusted contract for placement validity. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Vitest | 3.2.4 (project), npm latest `4.1.2` verified 2026-03-27 | Fast component and integration tests in jsdom | Use for focused pointer-flow and commit-path tests. |
| `@testing-library/react` | 16.3.0 (project), npm latest `16.3.2` verified 2026-03-27 | Interaction-oriented component tests | Use `fireEvent` for pointer event sequences in jsdom. |
| Browser Pointer Events + CSS `touch-action` | Baseline across modern browsers per MDN | Unified mouse/touch/pen input | Use for the live drag model instead of dual mouse/touch code paths. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Pointer Events | Separate mouse and touch handlers | More code, more drift, worse consistency across devices. |
| Board-local transient drag state | App-global drag state or external store | Adds rerender coordination and state plumbing for a short-lived gesture. |
| CSS transitions/keyframes for settle/snap-back | Animation library | Unnecessary dependency for one contained interaction. |

**Installation:** No additional packages required for this phase.

**Version verification:** Registry checks on 2026-03-27 returned `react@19.2.4` (modified 2026-03-28), `vite@8.0.3` (modified 2026-03-26), `vitest@4.1.2` (modified 2026-03-26), and `@testing-library/react@16.3.2` (modified 2026-01-19). The repo currently uses `react@19.1.1`, `vite@7.1.3`, `vitest@3.2.4`, and `@testing-library/react@16.3.0`. Phase 3 should stay on installed versions unless the planner explicitly adds a toolchain-upgrade task.

## Architecture Patterns

### Recommended Project Structure
```text
src/
├── App.tsx                    # Owns current puzzle + committed placements
├── components/
│   ├── PuzzleShell.tsx        # Passes placement props through without owning drag logic
│   ├── PuzzleBoard.tsx        # Owns active pointer session + preview rendering
│   └── __tests__/             # Interaction tests for preview and commit flow
├── rules/                     # Pure placement/board analysis, unchanged as authority
└── types/                     # Shared placement/session UI types if needed
```

### Pattern 1: Split Committed State From Gesture State
**What:** Keep committed rectangles in `App` and keep ephemeral press/drag preview state in `PuzzleBoard`.
**When to use:** Always for this phase.
**Example:**
```typescript
type DragPhase = "idle" | "armed" | "dragging" | "snapback";

interface DragSession {
  pointerId: number;
  origin: CellCoord;
  startClientX: number;
  startClientY: number;
  phase: DragPhase;
  preview: PlacementAnalysis | null;
}
```
Source: repo architecture in [App.tsx](/Users/hemalpatel/Development/fill-the-squares/src/App.tsx), [PuzzleBoard.tsx](/Users/hemalpatel/Development/fill-the-squares/src/components/PuzzleBoard.tsx), and locked decisions `D-03` through `D-04`.

### Pattern 2: One Pointer Pipeline For All Devices
**What:** Use `onPointerDown`, `onPointerMove`, `onPointerUp`, and `onPointerCancel` rather than separate mouse/touch code paths.
**When to use:** For all rectangle creation interactions.
**Example:**
```typescript
function handlePointerDown(event: React.PointerEvent<HTMLDivElement>, origin: CellCoord) {
  setSession({
    pointerId: event.pointerId,
    origin,
    startClientX: event.clientX,
    startClientY: event.clientY,
    phase: "armed",
    preview: null,
  });
}

function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
  if (!session || event.pointerId !== session.pointerId) return;
  // Promote to dragging after the movement threshold is crossed.
}
```
Source: React DOM built-in components support browser events (<https://react.dev/reference/react-dom/components>) and MDN Pointer Events guide (<https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events/Using_Pointer_Events>).

### Pattern 3: Apply Pointer Capture After Drag Activation
**What:** Once the gesture crosses the drag threshold, call `setPointerCapture(pointerId)` on the board element and release on `pointerup` or `pointercancel`.
**When to use:** Immediately after arming turns into dragging.
**Example:**
```typescript
if (nextPhase === "dragging" && event.currentTarget.hasPointerCapture?.(event.pointerId) !== true) {
  event.currentTarget.setPointerCapture(event.pointerId);
}
```
Source: MDN `setPointerCapture()` docs (<https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture>).

### Pattern 4: Preview Is Pure Derivation From Pointer Location
**What:** Convert the live pointer position into a candidate rectangle, then feed it through `analyzePlacement`.
**When to use:** On every drag move and again on release before commit.
**Example:**
```typescript
const candidate: CandidatePlacement = {
  origin,
  rectangle: makeAnchoredRectangle(origin, hoveredCell),
};

const preview = analyzePlacement(
  puzzle.size,
  puzzle.clues,
  candidate,
  placedRectangles,
);
```
Source: repo rules contract in [src/rules/placementAnalysis.ts](/Users/hemalpatel/Development/fill-the-squares/src/rules/placementAnalysis.ts).

### Pattern 5: Board Hit-Testing Uses DOMRect, Not Hard-Coded Pixels
**What:** Derive row and column from the current board rect and puzzle size. This must stay responsive with the existing board sizing rules.
**When to use:** For hover/drag cell targeting.
**Example:**
```typescript
function pointToCell(clientX: number, clientY: number, rect: DOMRect, size: number): CellCoord {
  const row = Math.max(0, Math.min(size - 1, Math.floor(((clientY - rect.top) / rect.height) * size)));
  const col = Math.max(0, Math.min(size - 1, Math.floor(((clientX - rect.left) / rect.width) * size)));
  return { row, col };
}
```
Source: MDN `getBoundingClientRect()` docs (<https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect>). This mapping choice is an inference: treating gap space as part of the nearest band is a good fit for the locked touch-forgiveness requirement.

### Anti-Patterns to Avoid
- **Separate mouse and touch implementations:** Violates `D-09` and invites behavior drift.
- **UI-side rule duplication:** If React checks area or clue inclusion itself, preview and final commit can disagree.
- **Drag start on press with no threshold:** Produces accidental placements, especially on touch.
- **Board hit-testing based on fixed cell pixels:** Breaks on responsive board sizes and with current CSS gap/layout rules.
- **Committing from stale preview state only:** Always recompute or verify preview validity at release before appending placement.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Cross-device input model | Separate mouse/touch gesture systems | Pointer Events + `touch-action` + pointer capture | This is the standard browser model and directly matches the phase requirement. |
| Placement validity checks | Ad hoc React conditionals | `analyzePlacement` from `@/rules` | Keeps preview and commit behavior deterministic. |
| Global interaction store | Zustand/Redux or custom event bus | Local React state in `PuzzleBoard` + app-level placements in `App` | Gesture state is short-lived and local. |
| Release animation system | GSAP or a custom physics engine | CSS transitions/keyframes toggled by board state classes | Enough for a subtle settle and soft snap-back. |
| Board geometry engine | Canvas or geometry library | DOMRect math plus grid-size normalization | Board is tiny and already rendered as DOM cells. |

**Key insight:** The deceptively hard part is not drawing a rectangle. It is making press, drag, preview, and release all consult the same source of truth while staying smooth on touch.

## Common Pitfalls

### Pitfall 1: Mobile Scroll Cancels The Gesture
**What goes wrong:** Touch drags start scrolling the page or trigger `pointercancel`, so preview feels broken or inconsistent.
**Why it happens:** The interactive board surface lacks `touch-action` configuration.
**How to avoid:** Apply `touch-action: none` to the board interaction surface during this phase.
**Warning signs:** Drag works with a mouse but touch preview never stabilizes on a phone.

### Pitfall 2: Drag Tracking Stops When Leaving The Grid
**What goes wrong:** The preview freezes or drops if the pointer briefly leaves the board bounds.
**Why it happens:** No pointer capture is set after drag activation.
**How to avoid:** Capture the active pointer once the movement threshold is crossed and clean up on `pointerup` and `pointercancel`.
**Warning signs:** Fast diagonal drags fail more often than slow drags.

### Pitfall 3: Touch Feels More Precise Than The Visual Grid
**What goes wrong:** Users drag across narrow board gaps and the hovered cell jumps or stalls.
**Why it happens:** Hit-testing assumes exact visual cell boxes and ignores gaps or responsive scaling.
**How to avoid:** Map pointer position to normalized board bands, then clamp to valid cell coordinates.
**Warning signs:** Preview flickers near cell boundaries even though the finger motion is smooth.

### Pitfall 4: Preview And Final Commit Disagree
**What goes wrong:** A rectangle looks valid during drag but fails on release, or the reverse.
**Why it happens:** Preview uses one logic path and release uses another.
**How to avoid:** Build both preview and release from the same `CandidatePlacement` and `analyzePlacement` call shape.
**Warning signs:** Bug reports mention “green outline but nothing placed.”

### Pitfall 5: Puzzle Navigation Leaves Old Placements Behind
**What goes wrong:** Switching puzzles carries committed rectangles or snap-back classes into the next puzzle.
**Why it happens:** Placement state is not reset when `currentPuzzleIndex` changes.
**How to avoid:** Scope committed placements to the current puzzle and reset board-local gesture state on puzzle change.
**Warning signs:** The next puzzle renders tinted regions before any interaction.

## Code Examples

Verified patterns from official sources and current repo contracts:

### Pointer Session With Capture And Cancel Cleanup
```typescript
function handleBoardPointerMove(event: React.PointerEvent<HTMLDivElement>) {
  if (!session || event.pointerId !== session.pointerId) return;

  const moved = Math.hypot(
    event.clientX - session.startClientX,
    event.clientY - session.startClientY,
  );

  if (session.phase === "armed" && moved >= dragThresholdPx) {
    event.currentTarget.setPointerCapture(event.pointerId);
    setSession((current) => current ? { ...current, phase: "dragging" } : current);
  }

  if (session.phase !== "dragging") return;

  const rect = event.currentTarget.getBoundingClientRect();
  const target = pointToCell(event.clientX, event.clientY, rect, puzzle.size);
  const candidate = buildPlacementFromAnchor(session.origin, target);

  setSession((current) =>
    current
      ? {
          ...current,
          preview: analyzePlacement(puzzle.size, puzzle.clues, candidate, placedRectangles),
        }
      : current,
  );
}

function handleBoardPointerCancel() {
  setSession(null);
}
```
Source: MDN Pointer Events + `setPointerCapture()` docs and the repo’s `analyzePlacement` contract.

### Valid Release Commits, Invalid Release Snaps Back
```typescript
function handleBoardPointerUp(event: React.PointerEvent<HTMLDivElement>) {
  if (!session || event.pointerId !== session.pointerId) return;

  const preview = session.preview;

  if (preview?.isValid) {
    onPlace(preview.placement);
    setSession(null);
    setReleaseFeedback("settle");
    return;
  }

  setSession((current) => current ? { ...current, phase: "snapback" } : current);
}
```
Source: locked decisions `D-08`, `D-14`, and `D-15`, plus `PlacementAnalysis.isValid` in [src/types/rules.ts](/Users/hemalpatel/Development/fill-the-squares/src/types/rules.ts).

### Interaction Test Shape In jsdom
```typescript
fireEvent.pointerDown(clueCell, {
  pointerId: 1,
  clientX: 32,
  clientY: 32,
});

fireEvent.pointerMove(board, {
  pointerId: 1,
  clientX: 140,
  clientY: 140,
});

expect(screen.getByText(/area 4/i)).toBeInTheDocument();

fireEvent.pointerUp(board, {
  pointerId: 1,
  clientX: 140,
  clientY: 140,
});
```
Source: Testing Library `fireEvent[eventName]` docs (<https://testing-library.com/docs/dom-testing-library/api-events/>).

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Separate mouse and touch event trees | Pointer Events for unified input | Widely established by modern browser baseline; MDN lists broad support since 2019-2020 | Simpler code and consistent behavior across desktop and mobile. |
| `preventDefault()`-driven touch suppression | CSS `touch-action` plus Pointer Events | Current MDN guidance | More reliable touch behavior and fewer `pointercancel` surprises. |
| Release-only validation | Live preview derived every move from the rules engine | Current expectation for direct-manipulation UIs | Immediate feedback satisfies `PLAY-03` and `UX-04`. |

**Deprecated/outdated:**
- Mouse-only drag logic for a mobile-first board interaction.
- Touch-specific logic that re-implements hit-testing separately from desktop.
- UI-level area/clue validation outside the rules module.

## Open Questions

1. **How should the board expose preview status to assistive tech?**
   - What we know: The board is currently rendered as `role="img"` with a read-only label.
   - What's unclear: Whether Phase 3 should add `aria-live` status text for area/validity or wait for broader accessibility work.
   - Recommendation: Plan a minimal hidden status region for preview area + validity if it does not complicate the interaction; otherwise defer fuller accessibility treatment to the later UX-hardening phase and note the gap explicitly.

2. **Should invalid-release snap-back animate the full preview or only the border/fill layer?**
   - What we know: The UI contract wants a noticeable-but-restrained soft snap-back.
   - What's unclear: Which visual layer reads best in the current premium shell.
   - Recommendation: Keep the animation CSS-only and scoped to preview visuals, not the full board layout.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 3.2.4 + React Testing Library 16.3.0 |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run src/components/__tests__/PuzzleBoard.interaction.test.tsx -t "live rectangle placement"` |
| Full suite command | `npm test -- --run` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PLAY-01 | Pressing a clue cell arms rectangle placement for pointer input | component integration | `npx vitest run src/components/__tests__/PuzzleBoard.interaction.test.tsx -t "arms from clue cell"` | ❌ Wave 0 |
| PLAY-02 | Dragging updates a live rectangle preview before commit | component integration | `npx vitest run src/components/__tests__/PuzzleBoard.interaction.test.tsx -t "updates preview during drag"` | ❌ Wave 0 |
| PLAY-03 | Preview renders immediate valid/invalid state from the rules engine | component integration | `npx vitest run src/components/__tests__/PuzzleBoard.interaction.test.tsx -t "shows validity state"` | ❌ Wave 0 |
| PLAY-04 | Valid release commits placement; invalid release does not | component integration | `npx vitest run src/components/__tests__/PuzzleBoard.interaction.test.tsx -t "commits on valid release"` | ❌ Wave 0 |
| UX-03 | Area cue and release feedback render cleanly during drag and commit | component integration | `npx vitest run src/components/__tests__/PuzzleBoard.interaction.test.tsx -t "shows area cue and release feedback"` | ❌ Wave 0 |
| UX-04 | Validation feedback updates immediately on drag movement | component integration | `npx vitest run src/components/__tests__/PuzzleBoard.interaction.test.tsx -t "updates without debounce"` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run src/components/__tests__/PuzzleBoard.interaction.test.tsx`
- **Per wave merge:** `npm test -- --run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/components/__tests__/PuzzleBoard.interaction.test.tsx` — pointer-driven preview and commit flow for PLAY-01 through PLAY-04 and UX-03 through UX-04
- [ ] `src/components/__tests__/App.placement.test.tsx` — placement persistence across puzzle navigation/reset-on-puzzle-change behavior
- [ ] A shared test helper for mocking `getBoundingClientRect()` on the board grid so pointer coordinates map deterministically in jsdom

## Sources

### Primary (HIGH confidence)
- Repo code: [src/components/PuzzleBoard.tsx](/Users/hemalpatel/Development/fill-the-squares/src/components/PuzzleBoard.tsx), [src/App.tsx](/Users/hemalpatel/Development/fill-the-squares/src/App.tsx), [src/rules/placementAnalysis.ts](/Users/hemalpatel/Development/fill-the-squares/src/rules/placementAnalysis.ts), [src/types/rules.ts](/Users/hemalpatel/Development/fill-the-squares/src/types/rules.ts)
- UI contract: [03-UI-SPEC.md](/Users/hemalpatel/Development/fill-the-squares/.planning/phases/03-live-rectangle-placement/03-UI-SPEC.md)
- React DOM components reference: <https://react.dev/reference/react-dom/components>
- MDN Pointer Events guide: <https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events/Using_Pointer_Events>
- MDN `setPointerCapture()`: <https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture>
- MDN `touch-action`: <https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action>
- MDN `getBoundingClientRect()`: <https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect>

### Secondary (MEDIUM confidence)
- Testing Library `fireEvent` docs: <https://testing-library.com/docs/dom-testing-library/api-events/>
- npm registry version metadata from `npm view` on 2026-03-27

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Current repo already uses the needed libraries and registry versions were verified.
- Architecture: HIGH - Recommendations are anchored in the current file structure, Phase 2 rules contract, and official pointer-event guidance.
- Pitfalls: HIGH - They come from current browser docs plus concrete constraints in the existing responsive board implementation.

**Research date:** 2026-03-27
**Valid until:** 2026-04-26
