import { describe, expect, it } from "vitest";

import {
  analyzePlacement,
  getPrimaryPlacementIssue,
  isPlacementValid,
  type PlacementIssue,
} from "@/rules";
import { createPlacement, createPuzzleFixture } from "@/rules/__tests__/ruleTestUtils";

describe("rectangle rules contracts", () => {
  it("exposes the placement-analysis public API", () => {
    expect(analyzePlacement).toBeTypeOf("function");
    expect(getPrimaryPlacementIssue).toBeTypeOf("function");
    expect(isPlacementValid).toBeTypeOf("function");
  });

  it("rejects rectangles missing origin clue", () => {
    const puzzle = createPuzzleFixture({
      clues: [
        { row: 0, col: 0, value: 4 },
        { row: 3, col: 3, value: 1 },
      ],
    });
    const analysis = analyzePlacement(
      puzzle.size,
      puzzle.clues,
      createPlacement(
        { row: 0, col: 0 },
        { row: 0, col: 1, width: 2, height: 2 },
      ),
    );

    expect(analysis.issues).toEqual(["missing_origin_clue"]);
    expect(analysis.primaryIssue).toBe("missing_origin_clue");
    expect(analysis.coveredCellKeys).toEqual(["0:1", "0:2", "1:1", "1:2"]);
    expect(analysis.isValid).toBe(false);
  });

  it("rejects rectangles containing non-origin clues", () => {
    const puzzle = createPuzzleFixture({
      clues: [
        { row: 0, col: 0, value: 6 },
        { row: 1, col: 2, value: 2 },
      ],
    });
    const analysis = analyzePlacement(
      puzzle.size,
      puzzle.clues,
      createPlacement(
        { row: 0, col: 0 },
        { row: 0, col: 0, width: 3, height: 2 },
      ),
    );

    expect(analysis.issues).toEqual(["contains_other_clue"]);
    expect(analysis.issueDetails[0]?.cells).toEqual([{ row: 1, col: 2 }]);
    expect(analysis.primaryIssue).toBe("contains_other_clue");
    expect(analysis.isValid).toBe(false);
  });

  it("rejects rectangles with wrong area", () => {
    const puzzle = createPuzzleFixture({
      clues: [
        { row: 0, col: 0, value: 4 },
        { row: 3, col: 3, value: 1 },
      ],
    });
    const analysis = analyzePlacement(
      puzzle.size,
      puzzle.clues,
      createPlacement(
        { row: 0, col: 0 },
        { row: 0, col: 0, width: 1, height: 2 },
      ),
    );

    expect(analysis.rectangleArea).toBe(2);
    expect(analysis.issues).toEqual(["wrong_area"]);
    expect(analysis.primaryIssue).toBe("wrong_area");
    expect(analysis.isValid).toBe(false);
  });

  it("rejects out-of-bounds rectangles", () => {
    const puzzle = createPuzzleFixture({
      clues: [
        { row: 3, col: 0, value: 4 },
        { row: 0, col: 3, value: 1 },
      ],
    });
    const analysis = analyzePlacement(
      puzzle.size,
      puzzle.clues,
      createPlacement(
        { row: 3, col: 0 },
        { row: 3, col: 0, width: 2, height: 2 },
      ),
    );

    expect(analysis.issues).toEqual(["out_of_bounds"]);
    expect(analysis.primaryIssue).toBe("out_of_bounds");
    expect(analysis.issueDetails[0]?.cells).toEqual([
      { row: 4, col: 0 },
      { row: 4, col: 1 },
    ]);
    expect(analysis.isValid).toBe(false);
  });

  it("rejects overlaps against placed rectangles", () => {
    const puzzle = createPuzzleFixture({
      clues: [
        { row: 0, col: 0, value: 4 },
        { row: 3, col: 3, value: 1 },
      ],
    });
    const analysis = analyzePlacement(
      puzzle.size,
      puzzle.clues,
      createPlacement(
        { row: 0, col: 0 },
        { row: 0, col: 0, width: 2, height: 2 },
      ),
      [
        createPlacement(
          { row: 3, col: 3 },
          { row: 1, col: 1, width: 2, height: 2 },
        ),
      ],
    );

    expect(analysis.issues).toEqual(["overlap"]);
    expect(analysis.primaryIssue).toBe("overlap");
    expect(analysis.issueDetails[0]?.cells).toEqual([{ row: 1, col: 1 }]);
    expect(isPlacementValid(analysis)).toBe(false);
  });

  const priorityCases: Array<[PlacementIssue[], PlacementIssue]> = [
    [["wrong_area", "out_of_bounds", "overlap"], "wrong_area"],
    [["contains_other_clue", "wrong_area", "overlap"], "contains_other_clue"],
    [["missing_origin_clue", "overlap"], "missing_origin_clue"],
    [["out_of_bounds", "overlap"], "out_of_bounds"],
  ];

  it.each(priorityCases)(
    "returns the deterministic primary issue when multiple failures apply",
    (issues, expected) => {
      expect(getPrimaryPlacementIssue(issues)).toBe(expected);
    },
  );

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
