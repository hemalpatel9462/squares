# Phase 4: Correction Controls - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-28
**Phase:** 04-correction-controls
**Areas discussed:** Remove interaction, Undo behavior, Reset safety, Control layout and priority

---

## Remove interaction

| Option | Description | Selected |
|--------|-------------|----------|
| Tap/click placed rectangle | Remove immediately by direct interaction on the board | ✓ |
| Remove mode | Enter a dedicated mode, then tap rectangle to remove | |
| Separate control/list | Keep board taps non-destructive and remove outside board | |

**User's choice:** Tap/click a placed rectangle to remove immediately.
**Notes:** User wants direct removal without extra mode switching.

---

## Undo behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Single-step undo | Undo only the most recent placement action | |
| Placement/removal last action | Undo reverses either the last placement or last removal | |
| Multi-step history | More than one undo level | ✓ |

**User's choice:** Multi-step undo history.
**Notes:** User explicitly chose deeper correction capability over a single quick rollback.

---

## Reset safety

| Option | Description | Selected |
|--------|-------------|----------|
| Always confirm | Prompt before every reset action | |
| Never confirm | Reset immediately, no guard | |
| Smart confirm | Confirm only when at least one rectangle is placed | ✓ |

**User's choice:** Smart confirmation only when progress exists.
**Notes:** Preserves speed on empty boards while protecting in-progress work.

---

## Control layout and priority

| Option | Description | Selected |
|--------|-------------|----------|
| Compact row above board | `Undo` + `Reset` above board; direct tap handles remove | ✓ |
| Sticky footer bar | Mobile-first persistent bottom controls | |
| Inline near metadata | Put controls in puzzle meta/navigation block | |

**User's choice:** Compact action row above board.
**Notes:** Keep board-first focus while maintaining quick access.

---

## the agent's Discretion

- Internal data structure for multi-step undo history and exact history depth.
- Exact control copy and micro-interaction styling within the chosen compact-row layout.

## Deferred Ideas

None.
