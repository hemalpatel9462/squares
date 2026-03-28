# Squares

## What This Is

Squares is a web-based logic puzzle game where players partition a square grid into valid rectangles based on clue numbers. The v1 release is a polished, frontend-only experience for desktop and mobile that ships with a 40-puzzle starter pack across multiple difficulties.

## Core Value

Players get a polished puzzle experience with trustworthy, deterministic rectangle-validation logic.

## Requirements

### Validated

- [x] Load and present the 40 handcrafted puzzles from the starter pack JSON
  Validated in Phase 1: Starter Pack Board Shell
- [x] Implement deterministic validation and completion logic that players can trust
  Validated in Phase 2: Deterministic Rectangle Rules

### Active

- [ ] Ship a complete playable rectangle-partition puzzle game for desktop and mobile web
- [ ] Deliver smooth touch and pointer interactions with clean visual feedback during selection and placement
- [ ] Persist player progress locally across sessions

### Out of Scope

- Puzzle generation engine — defer until after the handcrafted starter-pack experience is working well
- Backend services or authentication — frontend-only MVP to keep scope focused on gameplay quality
- Native mobile apps — responsive web is the target surface for v1
- Multiplayer, leaderboards, and monetization — not part of the core solo puzzle experience

## Context

This is a weekend MVP and also a test of the Codex + GSD workflow, but that process goal is secondary to delivering a polished playable game. The current source materials live in the `Origianl Assets/` directory and include early project docs plus a 40-puzzle starter pack JSON file. The product should support both desktop and mobile play, use localStorage for persistence, and keep the puzzle engine logic cleanly separated from the UI so future puzzle-generation work can build on the same foundations.

## Constraints

- **Platform**: Web browser only on desktop and mobile — v1 must feel good without native apps
- **Architecture**: Frontend-only with localStorage persistence — avoid backend dependencies in MVP
- **Quality**: Deterministic, unit-testable puzzle logic — correctness is a top-level product requirement
- **Content**: Use the existing 40-puzzle starter pack for launch content — generation is deferred
- **Scope**: Weekend MVP — prioritize the polished core loop over expansion features

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Prioritize polished playability and engine correctness over workflow experimentation | The product goal is a satisfying puzzle experience players can trust | Confirmed during initialization |
| Ship the handcrafted 40-puzzle starter pack in v1 | Launch content already exists and reduces scope risk versus building generation now | Validated in Phase 1 |
| Keep v1 frontend-only with localStorage | Faster delivery and simpler architecture for a puzzle MVP | Still active |
| Optimize first for smooth touch and pointer interactions | Cross-device usability is the most visible expression of "polished" for this release | Still active for upcoming interaction work |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `$gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `$gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-28 after Phase 2 completion*
