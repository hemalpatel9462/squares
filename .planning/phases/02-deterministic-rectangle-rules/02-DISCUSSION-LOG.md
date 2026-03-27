# Phase 2: Deterministic Rectangle Rules - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-27
**Phase:** 2-Deterministic Rectangle Rules
**Areas discussed:** Win condition source of truth, Validation result shape, Solved-board strictness, Rectangle identity contract, Deterministic reason ordering

---

## Win condition source of truth

| Option | Description | Selected |
|--------|-------------|----------|
| Rules-only | A board is solved if it satisfies the rectangle rules, even if it differs from bundled `solution` layout. | |
| Bundled-solution exact match | A board is solved only if it matches the starter-pack `solution` rectangles exactly. | |
| Rules-first, solution used only for tooling | Gameplay treats any valid board as solved; bundled `solution` data is for tests, QA, hints, or tooling. | ✓ |
| Another direction | Custom direction provided by user. | |

**User's choice:** Rules-first, solution used only for tooling  
**Notes:** Bundled `solution` should not be the gameplay truth in v1.

---

## Validation result shape

| Option | Description | Selected |
|--------|-------------|----------|
| Boolean only | Return only valid/invalid. | |
| Primary reason code | Return valid/invalid plus one deterministic primary failure reason. | |
| Full diagnostics | Return valid/invalid plus all applicable failure reasons and supporting details. | ✓ |
| Another preference | Custom contract provided by user. | |

**User's choice:** Full diagnostics  
**Notes:** Later gameplay wrappers can derive simpler answers from the richer engine output.

---

## Solved-board strictness

| Option | Description | Selected |
|--------|-------------|----------|
| Fast fail | Stop on the first invalid condition. | |
| Full deterministic assessment | Always compute complete board diagnostics. | |
| Mixed approach | Use simpler gameplay checks with a richer analysis path for tests/tooling. | ✓ |
| Another preference | Custom strictness model provided by user. | |

**User's choice:** Mixed approach  
**Notes:** User then clarified the engine contract further.

| Option | Description | Selected |
|--------|-------------|----------|
| One core full-analysis engine, with simple wrappers for gameplay | One source of truth with lightweight wrappers. | ✓ |
| Two separate paths | Separate lightweight gameplay validator and richer analysis engine. | |
| Another contract | Custom contract provided by user. | |

**User's choice:** One core full-analysis engine, with simple wrappers for gameplay  
**Notes:** Keeps deterministic logic unified.

---

## Rectangle identity contract

| Option | Description | Selected |
|--------|-------------|----------|
| Geometry only | Rectangle API contains only row/col/width/height and the engine infers clue ownership. | |
| Geometry plus originating clue | Placement input always includes geometry plus selected clue coordinates. | ✓ |
| Another contract | Custom contract provided by user. | |

**User's choice:** Geometry plus originating clue  
**Notes:** Matches the future interaction model where the user starts from a selected clue.

---

## Deterministic reason ordering

| Option | Description | Selected |
|--------|-------------|----------|
| Origin clue first | Missing selected-clue relationship is prioritized. | |
| Spatial validity first | Out-of-bounds and overlap come first. | |
| Rule-semantics first | Clue/area semantics come before spatial conflicts. | ✓ |
| Another ordering | Custom priority family provided by user. | |

**User's choice:** Rule-semantics first  
**Notes:** User then locked the exact order.

| Option | Description | Selected |
|--------|-------------|----------|
| `missing_origin_clue` → `contains_other_clue` → `wrong_area` → `out_of_bounds` → `overlap` | Prioritizes clue relationship first, then area, then spatial conflicts. | ✓ |
| `contains_other_clue` → `missing_origin_clue` → `wrong_area` → `out_of_bounds` → `overlap` | Treats violating another clue as strongest signal. | |
| `wrong_area` → `missing_origin_clue` → `contains_other_clue` → `out_of_bounds` → `overlap` | Treats clue-number area promise as the main rule. | |
| Another exact order | Custom exact ordering provided by user. | |

**User's choice:** `missing_origin_clue` → `contains_other_clue` → `wrong_area` → `out_of_bounds` → `overlap`  
**Notes:** Full diagnostics should still include all reasons; this order is for the primary surfaced reason only.

## the agent's Discretion

- Exact function/type naming in the rules engine
- Exact secondary diagnostic metadata shape
- Exact internal analysis data structure

## Deferred Ideas

None.
