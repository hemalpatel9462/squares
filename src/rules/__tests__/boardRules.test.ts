import { describe, expect, it } from "vitest";

import { analyzeBoard, isBoardSolved } from "@/rules";
import {
  createPuzzleFixture,
  createSolvedFixturePlacements,
} from "@/rules/__tests__/ruleTestUtils";

describe("board rules contracts", () => {
  it("exposes the board-analysis public API", () => {
    expect(analyzeBoard).toBeTypeOf("function");
    expect(isBoardSolved).toBeTypeOf("function");
  });

  it.todo("marks a fully covered valid board as solved");
  it.todo("reports uncovered cells when the board is not fully covered");
  it.todo("propagates invalid placement diagnostics into board analysis");

  it("provides solved-fixture builders for later board tests", () => {
    const puzzle = createPuzzleFixture();
    const placements = createSolvedFixturePlacements();

    expect(puzzle.size).toBe(4);
    expect(placements).toHaveLength(4);
  });
});
