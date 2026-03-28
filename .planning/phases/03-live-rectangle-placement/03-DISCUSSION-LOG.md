# Phase 3: Live Rectangle Placement - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-28
**Phase:** 03-live-rectangle-placement
**Areas discussed:** Drag interaction shape, Anchor model, Preview feedback style, Invalid preview style, Input parity across touch and desktop, Touch forgiveness, Invalid release behavior, Invalid snap-back intensity, Rectangle coexistence visibility, Placed region distinction, Drag start threshold, Threshold priority, Placement confirmation feel, Placement confirmation emphasis

---

## Drag Interaction Shape

| Option | Description | Selected |
|--------|-------------|----------|
| Free drag from the clue | The player drags outward naturally, and the preview rectangle follows the dragged bounds. | ✓ |
| Guided rectangle growth | The preview snaps into cleaner rectangle candidates as the player moves. | |
| Strongly constrained drag | Dragging mostly scrubs through tightly limited candidates. | |

**User's choice:** Free drag from the clue
**Notes:** The interaction should feel direct and tactile rather than assisted.

---

## Anchor Model

| Option | Description | Selected |
|--------|-------------|----------|
| Required anchor | The selected clue stays fixed as a required corner or interior anchor while the dragged cell determines bounds. | ✓ |
| Starting corner | The selected clue always acts like the starting corner. | |
| Other | Custom anchor behavior. | |

**User's choice:** Required interior-or-corner anchor
**Notes:** The clue must belong to the rectangle, but should not be artificially forced into a corner-only model.

---

## Preview Feedback Style

| Option | Description | Selected |
|--------|-------------|----------|
| Clean and minimal | Candidate rectangle plus subtle valid/invalid treatment, very little extra info. | |
| Balanced and readable | Candidate rectangle plus small visible area cue and clear valid/invalid styling. | ✓ |
| Highly explicit | Rectangle, area, stronger warnings, and helper messaging during drag. | |

**User's choice:** Balanced and readable
**Notes:** The preview should expose area during drag, but avoid clutter.

---

## Invalid Preview Style

| Option | Description | Selected |
|--------|-------------|----------|
| Soft but clear | Muted invalid tint or border, still calm and polished. | ✓ |
| Assertive | Stronger invalid color/contrast so failure is obvious immediately. | |
| Other | Custom invalid visual treatment. | |

**User's choice:** Soft but clear
**Notes:** Errors should stay elegant rather than punitive.

---

## Input Parity Across Touch and Desktop

| Option | Description | Selected |
|--------|-------------|----------|
| Same interaction model everywhere | Keep the mental model identical across mouse, touch, and pointer input. | |
| Same core model, touch slightly more forgiving | Keep the same concept, but make touch handling smoother. | ✓ |
| Meaningfully different touch interaction | Touch gets a noticeably adapted interaction pattern. | |

**User's choice:** Same core model, touch slightly more forgiving
**Notes:** Smoothness on phones matters, but the game should not feel conceptually different across devices.

---

## Touch Forgiveness

| Option | Description | Selected |
|--------|-------------|----------|
| Easier drag tracking | Touch holds the interaction more reliably during movement. | |
| Kinder release behavior | Touch is more tolerant at gesture end. | |
| Balanced mix of both | Smooth the full gesture, not just one moment. | ✓ |

**User's choice:** Balanced mix of both
**Notes:** The whole gesture should feel forgiving, not just drag or release in isolation.

---

## Invalid Release Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Clean disappearance | Preview clears immediately on invalid release. | |
| Soft snap-back | Preview recedes in a gentle, polished way. | ✓ |
| Brief failed-state hold | Invalid preview lingers briefly before clearing. | |

**User's choice:** Soft snap-back
**Notes:** The player should feel a graceful failed release rather than a harsh or silent drop.

---

## Invalid Snap-Back Intensity

| Option | Description | Selected |
|--------|-------------|----------|
| Very subtle | Almost immediate, just enough motion to avoid abruptness. | |
| Noticeable but restrained | Clearly felt retreat that stays elegant and fast. | ✓ |
| Other | Custom motion intensity. | |

**User's choice:** Noticeable but restrained
**Notes:** The motion should be felt, but not slow the interaction down.

---

## Rectangle Coexistence Visibility

| Option | Description | Selected |
|--------|-------------|----------|
| Very subtle grouping | Placed rectangles are only gently separated from the board. | |
| Clear grouped regions | Placed rectangles read as distinct regions without becoming toy-like. | ✓ |
| Strong segmentation | Placed rectangles stand apart very clearly, almost like puzzle pieces. | |

**User's choice:** Clear grouped regions
**Notes:** Readability should improve as the board fills, without losing the premium calm tone.

---

## Placed Region Distinction

| Option | Description | Selected |
|--------|-------------|----------|
| Surface tint first | Tasteful fill/tint is the main differentiation. | |
| Edge definition first | Boundaries are the main differentiation. | |
| Balanced mix | Tint and edge separation work together in a restrained way. | ✓ |

**User's choice:** Balanced mix
**Notes:** Placed rectangles should feel clear, but not overly segmented.

---

## Drag Start Threshold

| Option | Description | Selected |
|--------|-------------|----------|
| Start immediately on press | Most direct, but more accidental drags. | |
| Tiny movement threshold | Arm on press, activate drag after slight movement. | ✓ |
| Other | Custom threshold behavior. | |

**User's choice:** Tiny movement threshold
**Notes:** This should help touch polish without making the interaction feel laggy.

---

## Threshold Priority

| Option | Description | Selected |
|--------|-------------|----------|
| Consistency across devices | Keep threshold feel essentially the same everywhere. | |
| Touch smoothness first | Let touch be slightly more forgiving than desktop. | ✓ |
| Other | Custom threshold priority. | |

**User's choice:** Touch smoothness first
**Notes:** Phone feel matters more than strict input symmetry.

---

## Placement Confirmation Feel

| Option | Description | Selected |
|--------|-------------|----------|
| Instant and quiet | Rectangle just lands with almost no ceremony. | |
| Subtle settle-in | Brief polished lock-in moment on successful placement. | ✓ |
| More obvious confirmation | Stronger success feedback. | |

**User's choice:** Subtle settle-in
**Notes:** Successful placement should feel satisfying but still fast.

---

## Placement Confirmation Emphasis

| Option | Description | Selected |
|--------|-------------|----------|
| Quick surface settle | Fill/surface resolves more than edges. | |
| Quick edge lock-in | Boundaries crisp into place more than fill changes. | |
| Balanced mix | Surface and edges settle together in a restrained way. | ✓ |

**User's choice:** Balanced mix
**Notes:** Confirmation should support the premium board feel instead of adding one loud effect.

---

## the agent's Discretion

- Exact animation timings and easing curves
- Exact threshold values for mouse versus touch
- Exact visual design and placement of the area cue

## Deferred Ideas

None.
