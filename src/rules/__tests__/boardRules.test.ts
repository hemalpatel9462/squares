import { describe, expect, it } from "vitest";

import { analyzeBoard, isBoardSolved } from "@/rules";
import {
  createPlacement,
  createPuzzleFixture,
  createSolvedFixturePlacements,
} from "@/rules/__tests__/ruleTestUtils";

describe("board rules contracts", () => {
  it("exposes the board-analysis public API", () => {
    expect(analyzeBoard).toBeTypeOf("function");
    expect(isBoardSolved).toBeTypeOf("function");
  });

  it("marks a fully covered valid board as solved", () => {
    const puzzle = createPuzzleFixture();
    const analysis = analyzeBoard(
      puzzle.size,
      puzzle.clues,
      createSolvedFixturePlacements(),
    );

    expect(analysis.isSolved).toBe(true);
    expect(analysis.issues).toEqual([]);
    expect(analysis.invalidPlacements).toEqual([]);
    expect(analysis.uncoveredCells).toEqual([]);
    expect(isBoardSolved(analysis)).toBe(true);
  });

  it("reports uncovered cells when the board is not fully covered", () => {
    const puzzle = createPuzzleFixture();
    const analysis = analyzeBoard(
      puzzle.size,
      puzzle.clues,
      createSolvedFixturePlacements().slice(0, 3),
    );

    expect(analysis.isSolved).toBe(false);
    expect(analysis.issues).toContain("uncovered_cell");
    expect(analysis.uncoveredCellKeys).toEqual([
      "2:1",
      "2:2",
      "2:3",
      "3:1",
      "3:2",
      "3:3",
    ]);
  });

  it("propagates invalid placement diagnostics into board analysis", () => {
    const puzzle = createPuzzleFixture();
    const analysis = analyzeBoard(puzzle.size, puzzle.clues, [
      createPlacement(
        { row: 0, col: 0 },
        { row: 0, col: 0, width: 1, height: 2 },
      ),
      ...createSolvedFixturePlacements().slice(1),
    ]);

    expect(analysis.isSolved).toBe(false);
    expect(analysis.issues).toContain("invalid_placement");
    expect(analysis.invalidPlacements).toHaveLength(1);
    expect(analysis.invalidPlacements[0]?.issues).toContain("wrong_area");
  });

  it("provides solved-fixture builders for later board tests", () => {
    const puzzle = createPuzzleFixture();
    const placements = createSolvedFixturePlacements();

    expect(puzzle.size).toBe(4);
    expect(placements).toHaveLength(4);
  });
});
