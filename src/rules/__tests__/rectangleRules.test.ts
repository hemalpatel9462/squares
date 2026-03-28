import { describe, expect, it } from "vitest";

import {
  analyzePlacement,
  getPrimaryPlacementIssue,
  isPlacementValid,
} from "@/rules";
import { createPlacement, createPuzzleFixture } from "@/rules/__tests__/ruleTestUtils";

describe("rectangle rules contracts", () => {
  it("exposes the placement-analysis public API", () => {
    expect(analyzePlacement).toBeTypeOf("function");
    expect(getPrimaryPlacementIssue).toBeTypeOf("function");
    expect(isPlacementValid).toBeTypeOf("function");
  });

  it.todo("rejects rectangles missing origin clue");
  it.todo("rejects rectangles containing non-origin clues");
  it.todo("rejects rectangles with wrong area");
  it.todo("rejects out-of-bounds rectangles");
  it.todo("rejects overlaps against placed rectangles");
  it.todo("returns the deterministic primary issue when multiple failures apply");

  it("keeps fixture helpers aligned with the public placement shape", () => {
    const puzzle = createPuzzleFixture();
    const placement = createPlacement(
      { row: 0, col: 0 },
      { row: 0, col: 0, width: 2, height: 2 },
    );

    expect(puzzle.clues[0]).toEqual({ row: 0, col: 0, value: 4 });
    expect(placement).toEqual({
      origin: { row: 0, col: 0 },
      rectangle: { row: 0, col: 0, width: 2, height: 2 },
    });
  });
});
