# Squares — Requirements Specification

## Functional Requirements

### Puzzle Board

The system must:

- render an NxN grid
- display clue numbers in specified cells
- support board sizes from 4x4 to 8x8
- visually distinguish clue cells

### Region Placement

The player must be able to:

- select a clue cell
- drag to define rectangle area
- preview rectangle during drag
- confirm rectangle placement on release

Placement must be rejected if:

- rectangle leaves board bounds
- rectangle overlaps existing region
- rectangle includes another clue
- rectangle excludes selected clue
- rectangle area != clue value

### Region Editing

The player must be able to:

- remove placed rectangle
- undo last placement
- reset puzzle

### Puzzle Completion

The puzzle is complete when:

- all clues assigned
- all cells covered
- all rectangles valid
- no overlaps exist

Completion must trigger:

- solved state
- completion modal
- next-level navigation option

### Puzzle Packs

System must:

- load puzzles from JSON
- group puzzles by difficulty
- allow puzzle selection
- track completion state

Minimum shipped content:

- 20 puzzles total
- easy / medium / hard groups

### Persistence

System must persist:

- completed puzzle IDs
- last selected difficulty
- tutorial completion state

Persistence layer:

- browser localStorage

### Tutorial

Tutorial must:

teach:

- clue meaning
- rectangle placement
- board completion requirement

Tutorial must:

- run once on first launch
- be skippable
- be replayable later

---

## Interaction Requirements

Primary interaction:

select clue → drag rectangle → release to place

During drag:

system must display:

- rectangle preview
- area size
- valid vs invalid feedback

Invalid preview must be visually distinct.

---

## UI Requirements

Screens required:

Home Screen

must include:

- title
- play button
- difficulty selection

Puzzle Screen

must include:

- grid
- undo button
- reset button
- back button
- level indicator

Completion Screen

must include:

- success message
- next puzzle button
- replay button

Tutorial Overlay

must include:

- 3 instructional steps
- interactive example

---

## Validation Requirements

System must validate:

rectangleInsideBoard(rect)

rectangleContainsClue(rect, clue)

rectangleContainsSingleClue(rect)

rectangleAreaMatchesClue(rect, clue)

rectangleDoesNotOverlap(rect, placedRects)

boardFullyCovered(board)

allCluesSatisfied(board)

---

## Data Requirements

Puzzle schema must support:

id

board size

clue list

solution rectangles

difficulty label

Example structure:

{
  id,
  size,
  clues[],
  solution[],
  difficulty
}

---

## Non-Functional Requirements

Performance

- interaction latency under 50ms
- placement validation immediate

Compatibility

- Chrome
- Safari
- Firefox
- mobile browsers

Accessibility

- visible grid contrast
- readable clue text
- touch-friendly hit targets

Maintainability

validation logic must be:

- deterministic
- unit-testable
- UI-independent