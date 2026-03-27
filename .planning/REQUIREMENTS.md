# Requirements: Squares

**Defined:** 2026-03-27
**Core Value:** Players get a polished puzzle experience with trustworthy, deterministic rectangle-validation logic.

## v1 Requirements

### Puzzle Board

- [x] **BOARD-01**: Player can open a puzzle and see an NxN grid for board sizes from 4x4 through 8x8
- [x] **BOARD-02**: Player can see clue numbers in their correct cells with clue cells visually distinguished from empty cells
- [ ] **BOARD-03**: Player can see the current puzzle id, difficulty, and progression context while playing

### Placement Interaction

- [ ] **PLAY-01**: Player can start a rectangle selection from a clue cell using mouse, touch, or pointer input
- [ ] **PLAY-02**: Player can drag to preview the target rectangle before placement is confirmed
- [ ] **PLAY-03**: Player receives immediate visual feedback showing whether the current preview is valid or invalid
- [ ] **PLAY-04**: Player can place a rectangle on release when the selection is valid
- [ ] **PLAY-05**: Player can remove a placed rectangle, undo the last placement, and reset the current puzzle

### Puzzle Rules Engine

- [ ] **RULE-01**: System rejects rectangles that leave the board bounds
- [ ] **RULE-02**: System rejects rectangles that overlap an existing placed rectangle
- [ ] **RULE-03**: System rejects rectangles that include another clue cell
- [ ] **RULE-04**: System rejects rectangles that do not include the selected clue cell
- [ ] **RULE-05**: System rejects rectangles whose area does not match the selected clue value
- [ ] **RULE-06**: System can determine when the board is fully covered with valid non-overlapping rectangles and all clues are satisfied
- [ ] **RULE-07**: Puzzle validation logic is deterministic, unit-testable, and UI-independent

### Progression And Content

- [x] **PACK-01**: System loads puzzles from the starter-pack JSON file
- [x] **PACK-02**: System ships with the current 40 handcrafted puzzles from the starter pack
- [ ] **PACK-03**: Player can browse or select puzzles by difficulty across easy, medium, and hard groups
- [ ] **PACK-04**: System tracks completion state per puzzle
- [ ] **PACK-05**: System shows a completion state with replay and next-puzzle navigation when a puzzle is solved

### Persistence

- [ ] **SAVE-01**: System persists completed puzzle ids in localStorage
- [ ] **SAVE-02**: System persists the last selected difficulty in localStorage
- [ ] **SAVE-03**: System persists tutorial completion state in localStorage

### Tutorial And Onboarding

- [ ] **TUT-01**: First-time players see a tutorial that explains clue meaning, rectangle placement, and the board completion rule
- [ ] **TUT-02**: Player can skip the tutorial and replay it later
- [ ] **TUT-03**: Tutorial includes an interactive example or guided first-use flow

### UX Quality

- [ ] **UX-01**: Core interactions feel usable on both desktop and mobile browsers
- [ ] **UX-02**: Grid, clue text, and controls maintain readable contrast and touch-friendly hit targets
- [ ] **UX-03**: Placement feedback feels clean and satisfying, with visible area and validity cues during drag
- [ ] **UX-04**: Placement validation feedback appears immediately during interaction

## v2 Requirements

### Content Expansion

- **CONT-01**: System can generate new puzzles that satisfy game rules
- **CONT-02**: System can validate generated puzzles for acceptable quality before release

### Assistance And Modes

- **MODE-01**: Player can request contextual hints for the current puzzle
- **MODE-02**: Player can play rotating daily puzzles
- **MODE-03**: Player can opt into alternate puzzle variants such as square-only constraints

## Out of Scope

| Feature | Reason |
|---------|--------|
| Backend services and accounts | Frontend-only MVP keeps scope focused on gameplay quality |
| Native mobile apps | Responsive web is sufficient for v1 |
| Multiplayer, leaderboards, and monetization | Not part of the core solo puzzle experience |
| Sound-heavy or nonessential effects | Polish should come from interaction quality and clarity first |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| BOARD-01 | Phase 1 | Complete |
| BOARD-02 | Phase 1 | Complete |
| BOARD-03 | Phase 1 | Pending |
| PLAY-01 | Phase 3 | Pending |
| PLAY-02 | Phase 3 | Pending |
| PLAY-03 | Phase 3 | Pending |
| PLAY-04 | Phase 3 | Pending |
| PLAY-05 | Phase 4 | Pending |
| RULE-01 | Phase 2 | Pending |
| RULE-02 | Phase 2 | Pending |
| RULE-03 | Phase 2 | Pending |
| RULE-04 | Phase 2 | Pending |
| RULE-05 | Phase 2 | Pending |
| RULE-06 | Phase 2 | Pending |
| RULE-07 | Phase 2 | Pending |
| PACK-01 | Phase 1 | Complete |
| PACK-02 | Phase 1 | Complete |
| PACK-03 | Phase 5 | Pending |
| PACK-04 | Phase 6 | Pending |
| PACK-05 | Phase 6 | Pending |
| SAVE-01 | Phase 6 | Pending |
| SAVE-02 | Phase 5 | Pending |
| SAVE-03 | Phase 7 | Pending |
| TUT-01 | Phase 7 | Pending |
| TUT-02 | Phase 7 | Pending |
| TUT-03 | Phase 7 | Pending |
| UX-01 | Phase 8 | Pending |
| UX-02 | Phase 8 | Pending |
| UX-03 | Phase 3 | Pending |
| UX-04 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 30 total
- Mapped to phases: 30
- Unmapped: 0

---
*Requirements defined: 2026-03-27*
*Last updated: 2026-03-27 after roadmap creation*
