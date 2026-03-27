# Roadmap: Squares

## Overview

This roadmap delivers Squares as a polished, frontend-only puzzle game by moving from a reliable board shell and deterministic rules engine into direct-manipulation play, progression, onboarding, and final cross-device usability hardening.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Starter Pack Board Shell** - Load the shipped puzzle pack and render a clear playable board shell.
- [ ] **Phase 2: Deterministic Rectangle Rules** - Implement the UI-independent validation and solve-detection engine.
- [ ] **Phase 3: Live Rectangle Placement** - Deliver drag-based rectangle placement with immediate validity feedback.
- [ ] **Phase 4: Correction Controls** - Let players remove, undo, and reset without friction.
- [ ] **Phase 5: Puzzle Browser & Session Context** - Add difficulty-based puzzle browsing and restore the player's browsing context.
- [ ] **Phase 6: Completion Tracking & Next Puzzle Flow** - Mark solved puzzles, persist progress, and guide players forward.
- [ ] **Phase 7: First-Use Tutorial** - Teach new players the rules and allow tutorial replay later.
- [ ] **Phase 8: Cross-Device Usability Polish** - Harden readability and touch usability across desktop and mobile.

## Phase Details

### Phase 1: Starter Pack Board Shell
**Goal**: Players can open any shipped puzzle and immediately understand the board they are solving.
**Depends on**: Nothing (first phase)
**Requirements**: BOARD-01, BOARD-02, BOARD-03, PACK-01, PACK-02
**Success Criteria** (what must be TRUE):
  1. Player can open a starter-pack puzzle and see the correct NxN grid for board sizes from 4x4 through 8x8.
  2. Player can see clue numbers in the correct cells, with clue cells visually distinct from empty cells.
  3. Player can see the current puzzle id, difficulty, and progression context while playing.
  4. Player can access the full shipped set of 40 handcrafted starter-pack puzzles through the app.
**Plans**: TBD
**UI hint**: yes

### Phase 2: Deterministic Rectangle Rules
**Goal**: The game can evaluate placements and solved boards with deterministic logic players can trust.
**Depends on**: Phase 1
**Requirements**: RULE-01, RULE-02, RULE-03, RULE-04, RULE-05, RULE-06, RULE-07
**Success Criteria** (what must be TRUE):
  1. Invalid rectangles are rejected when they leave the board, overlap another rectangle, include another clue, miss the selected clue, or have the wrong area.
  2. The same placement input always produces the same validation result independent of the UI.
  3. The system can determine when the entire board is correctly covered with valid non-overlapping rectangles and all clues are satisfied.
**Plans**: TBD

### Phase 3: Live Rectangle Placement
**Goal**: Players can create rectangles through direct manipulation and get instant visual feedback before committing.
**Depends on**: Phase 1 and Phase 2
**Requirements**: PLAY-01, PLAY-02, PLAY-03, PLAY-04, UX-03, UX-04
**Success Criteria** (what must be TRUE):
  1. Player can start a rectangle selection from a clue cell using mouse, touch, or pointer input.
  2. Player can drag to preview the target rectangle and see its area and validity state update immediately during the interaction.
  3. Player can release to place a rectangle when the preview is valid, with clean and satisfying feedback.
**Plans**: TBD
**UI hint**: yes

### Phase 4: Correction Controls
**Goal**: Players can recover from mistakes without losing control of the current puzzle.
**Depends on**: Phase 3
**Requirements**: PLAY-05
**Success Criteria** (what must be TRUE):
  1. Player can remove an already placed rectangle from the board.
  2. Player can undo the last placement without resetting all progress.
  3. Player can reset the current puzzle back to a clean unsolved state.
**Plans**: TBD
**UI hint**: yes

### Phase 5: Puzzle Browser & Session Context
**Goal**: Players can choose puzzles by difficulty and return to the same browsing context on their next visit.
**Depends on**: Phase 1
**Requirements**: PACK-03, SAVE-02
**Success Criteria** (what must be TRUE):
  1. Player can browse or select puzzles by difficulty across easy, medium, and hard groups.
  2. Player returns to the last selected difficulty after reloading or reopening the app.
  3. Player can move from the browser into a chosen puzzle with that difficulty context still visible while playing.
**Plans**: TBD
**UI hint**: yes

### Phase 6: Completion Tracking & Next Puzzle Flow
**Goal**: Solved puzzles update progress and smoothly move players through the starter pack.
**Depends on**: Phase 3, Phase 4, and Phase 5
**Requirements**: PACK-04, PACK-05, SAVE-01
**Success Criteria** (what must be TRUE):
  1. Solving a puzzle marks that puzzle as completed in the product.
  2. Completed puzzle ids persist across browser sessions.
  3. When a puzzle is solved, player sees a completion state with replay and next-puzzle navigation.
**Plans**: TBD
**UI hint**: yes

### Phase 7: First-Use Tutorial
**Goal**: New players can learn the rules quickly and experienced players can revisit the tutorial on demand.
**Depends on**: Phase 1 and Phase 5
**Requirements**: TUT-01, TUT-02, TUT-03, SAVE-03
**Success Criteria** (what must be TRUE):
  1. A first-time player sees a tutorial explaining clue meaning, rectangle placement, and the board completion rule.
  2. Player can skip the tutorial and replay it later from the product.
  3. Tutorial includes an interactive example or guided first-use flow that walks the player through a real placement.
  4. Tutorial completion state persists across sessions.
**Plans**: TBD
**UI hint**: yes

### Phase 8: Cross-Device Usability Polish
**Goal**: The complete gameplay loop feels readable and reliable on desktop and mobile browsers.
**Depends on**: Phase 3, Phase 6, and Phase 7
**Requirements**: UX-01, UX-02
**Success Criteria** (what must be TRUE):
  1. Core interactions remain usable on both desktop and mobile browsers.
  2. Grid, clue text, and controls remain readable with sufficient contrast during normal play.
  3. Interactive controls and board targets stay touch-friendly on smaller screens.
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Starter Pack Board Shell | 0/TBD | Not started | - |
| 2. Deterministic Rectangle Rules | 0/TBD | Not started | - |
| 3. Live Rectangle Placement | 0/TBD | Not started | - |
| 4. Correction Controls | 0/TBD | Not started | - |
| 5. Puzzle Browser & Session Context | 0/TBD | Not started | - |
| 6. Completion Tracking & Next Puzzle Flow | 0/TBD | Not started | - |
| 7. First-Use Tutorial | 0/TBD | Not started | - |
| 8. Cross-Device Usability Polish | 0/TBD | Not started | - |
