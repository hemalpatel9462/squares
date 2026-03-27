# Phase 1: Starter Pack Board Shell - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-27
**Phase:** 1-Starter Pack Board Shell
**Areas discussed:** Board presentation, Puzzle context display, Visual style direction

---

## Board presentation

| Option | Description | Selected |
|--------|-------------|----------|
| Board-first, centered and dominant | The grid is the hero, with very little surrounding UI. Strong fit if you want the puzzle itself to feel immediate and premium. | |
| Balanced game layout | The grid is primary, but there’s a clear header or frame around it for puzzle info and future controls. Strong fit if you want a polished product shell, not just a raw board. | ✓ |
| Dense utility layout | More information is visible around the board from the start, even if the grid feels a bit less dominant. Better for tool-like clarity than for elegance. | |
| Another direction | Custom direction provided by user. | |

**User's choice:** Balanced game layout  
**Notes:** User wants the board to remain primary but within a composed game shell rather than a bare board view.

| Option | Description | Selected |
|--------|-------------|----------|
| Keep the board as large as possible | Supporting info sits above or below the board; best when the puzzle should always win on space. | |
| Keep the board inside a fixed-feeling framed play area | Strong designed frame even if the board gives up some size. | |
| Adaptive by device | Desktop can feel more framed, while mobile prioritizes maximizing board size. | ✓ |
| Another preference | Custom behavior provided by user. | |

**User's choice:** Adaptive by device  
**Notes:** Desktop can feel more framed; mobile should prioritize board size.

---

## Puzzle context display

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal context | Show difficulty and a simple puzzle label only. | |
| Standard context | Show puzzle id, difficulty, and simple progress context like puzzle number within the pack. | ✓ |
| Rich context | Show puzzle id, difficulty, pack position, and extra stats or counts. | |
| Another preference | Custom direction provided by user. | |

**User's choice:** Standard context  
**Notes:** This aligns with the roadmap requirement for puzzle id, difficulty, and progression context.

| Option | Description | Selected |
|--------|-------------|----------|
| In a compact top header above the board | Familiar and easy to scan. | |
| In a slim panel or row just below the board title area | Keeps board and metadata grouped. | |
| Integrated into the same card/frame as the board | Feels more designed and cohesive if the whole puzzle screen should read as one polished unit. | ✓ |
| Another preference | Custom location provided by user. | |

**User's choice:** Integrated into the same card/frame as the board  
**Notes:** The metadata should feel embedded with the puzzle surface, not detached.

---

## Visual style direction

| Option | Description | Selected |
|--------|-------------|----------|
| Quiet and minimalist | Clean, restrained, puzzle-first, with subtle polish and very little visual noise. | |
| Modern premium game | Clean, but with intentional framing, richer surfaces, and a stronger sense of crafted product design. | ✓ |
| Playful casual puzzle app | Friendlier and brighter, with more obvious game energy. | |
| Another direction | Custom direction provided by user. | |

**User's choice:** Modern premium game  
**Notes:** The screen should feel crafted and polished rather than purely utilitarian.

| Option | Description | Selected |
|--------|-------------|----------|
| Crisp and flat | Sharp, clean, elegant, with contrast doing most of the work. | |
| Soft elevated surfaces | Subtle depth, gentle shadows, slightly tactile feel without becoming playful. | ✓ |
| High-contrast luxury | Darker or more dramatic surfaces with stronger contrast and more visual attitude. | |
| Another preference | Custom direction provided by user. | |

**User's choice:** Soft elevated surfaces  
**Notes:** The board and clue cells should have gentle tactility and depth.

| Option | Description | Selected |
|--------|-------------|----------|
| Calm app shell | Light background, centered framed puzzle area, restrained spacing, polished but understated. | |
| Immersive play surface | The puzzle area feels like the whole experience, with background treatment and framing that make it feel more like a crafted game screen. | ✓ |
| Editorial product feel | More typography-forward, more visible titles and labels, almost like a premium product page around the board. | |
| Another feel | Custom direction provided by user. | |

**User's choice:** Immersive play surface  
**Notes:** The first screen should already feel like a crafted game environment, not just an app screen.

## the agent's Discretion

- Exact typography choices
- Exact color palette and component token values
- Exact breakpoint thresholds and layout tuning

## Deferred Ideas

None.
