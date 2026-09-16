# Squares Game — Responsive Layout Specification

## Objective

Build a focused Squares game screen that uses the full visible viewport without introducing horizontal or vertical scrolling.

## Hard requirements

- The application shell must fill the viewport: `width: 100vw; height: 100dvh`.
- The document, shell, and game area must not scroll: use `overflow: hidden`.
- The game screen must not display the **Starter Pack** title.
- The internal puzzle ID must not appear in the UI. Do not expose values such as `Puzzle 6/40`.
- Remove oversized header treatments and decorative board cards. The top bar and board should be compact, direct, and focused on play.

## Top bar

Use one compact top bar with the following contents, in this order:

1. **Back** — icon plus accessible label; returns to the previous screen.
2. **Difficulty** — e.g. `Easy`.
3. **Puzzle progress** — user-facing progress only, such as `6 of 40`; never show the internal puzzle ID.
4. **Undo** — undo the most recent valid move.
5. **Reset** — reset the current puzzle, with confirmation if reset is destructive.

The bar should remain visible while playing, have a stable height, and avoid wrapping at supported widths. On narrow screens, preserve the controls but reduce horizontal gaps and use icon buttons with visible accessible names/tooltips where appropriate.

## Board sizing and placement

The board is the dominant visual element and should be as large as the remaining viewport permits while remaining square.

Define layout constants for the top-bar height and safe padding, then size the board using the tighter available dimension:

```css
:root {
  --top-bar-height: 56px;
  --game-padding: clamp(12px, 3vw, 32px);
}

.board {
  width: min(
    calc(100vw - (2 * var(--game-padding))),
    calc(100dvh - var(--top-bar-height) - (2 * var(--game-padding)))
  );
  aspect-ratio: 1;
}
```

If the board has a reasonable product maximum, apply it without making typical desktop/laptop boards unnecessarily small:

```css
.board {
  width: min(
    100%,
    700px,
    calc(100vw - (2 * var(--game-padding))),
    calc(100dvh - var(--top-bar-height) - (2 * var(--game-padding)))
  );
}
```

Center the board in the remaining game area. The board must not rely on fixed cell sizes that can exceed the available viewport.

## Recommended CSS structure

```css
html,
body,
#root {
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
}

.app {
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.top-bar {
  flex: 0 0 var(--top-bar-height);
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-inline: var(--game-padding);
}

.game-area {
  min-height: 0;
  flex: 1 1 auto;
  display: grid;
  place-items: center;
  padding: var(--game-padding);
}
```

Use `box-sizing: border-box` globally. Ensure flex/grid children that contain the board have `min-width: 0` and `min-height: 0`; otherwise intrinsic content can create overflow.

## Desktop and laptop behavior

- Treat the board as the primary content and allow it to become large—up to approximately `600–700px` when the viewport permits.
- Maximize the board within the space below the top bar and inside the horizontal safe area.
- Keep the board visually centered, with balanced breathing room around it.
- Do not add a large page header, title block, card wrapper, or extra vertical sections that reduce playable board size.

## Mobile and narrow-screen behavior

- Continue fitting the complete interface inside the visible viewport; never solve narrow layouts with page scrolling.
- Let the board shrink according to the same `min(available width, available height)` constraint.
- Account for device safe areas with `env(safe-area-inset-top)`, `env(safe-area-inset-right)`, `env(safe-area-inset-bottom)`, and `env(safe-area-inset-left)` as needed.
- Reduce top-bar gaps and horizontal padding at narrow widths.
- Keep controls usable with touch targets of at least `44px` where practical.
- If labels cannot fit, retain accessible names and use familiar icons, but do not hide essential actions without an accessible alternative.

## Accessibility

- Use semantic landmarks: a `header` for the top bar and `main` for the game area.
- Give Back, Undo, and Reset real accessible names; icon-only controls need an accessible label.
- Expose difficulty and progress as readable text, not color alone.
- Maintain visible keyboard focus indicators and logical tab order: Back → difficulty/progress → Undo → Reset → board controls.
- Ensure board cells have appropriate roles, names, and state announcements for screen readers.
- Preserve sufficient color contrast and provide non-color feedback for selected, completed, invalid, or focused states.
- Respect `prefers-reduced-motion` for transitions and move feedback.

## Acceptance criteria

- At supported desktop, laptop, tablet, and narrow mobile viewport sizes, the complete game UI fits without horizontal or vertical scrolling.
- `html`, `body`, the application shell, and the game area do not produce overflow.
- The top bar contains Back, difficulty, user-facing puzzle progress, Undo, and Reset.
- Starter Pack, the internal puzzle ID, oversized header content, and oversized board cards are absent from the game screen.
- The board remains square, centered, and sized by the tighter available width/height constraint.
- Desktop/laptop boards can reach roughly `600–700px` when space allows.
- Narrow screens shrink the board and compact the top bar without clipping, wrapping essential controls, or requiring scroll.
- Keyboard navigation, focus visibility, touch target sizing, screen-reader labels, and contrast meet the accessibility requirements above.
- Resize and orientation changes recalculate the board size without layout breakage.
