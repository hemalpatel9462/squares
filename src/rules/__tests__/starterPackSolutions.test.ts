import { describe, expect, it } from "vitest";

import { analyzeBoard } from "@/rules";
import { starterPackPuzzles } from "@/data/starterPack";
import {
  createPlacement,
  findOriginForSolutionRectangle,
} from "@/rules/__tests__/ruleTestUtils";

describe("starter pack solution fixtures", () => {
  it("exposes the board analyzer for shipped-fixture verification", () => {
    expect(analyzeBoard).toBeTypeOf("function");
    expect(starterPackPuzzles).toHaveLength(40);
  });

  it("accepts shipped starter-pack solution rectangles as solved partitions", () => {
    for (const puzzle of starterPackPuzzles) {
      const placements = puzzle.solution.map((rectangle) =>
        createPlacement(findOriginForSolutionRectangle(puzzle.clues, rectangle), {
          row: rectangle.row,
          col: rectangle.col,
          width: rectangle.width,
          height: rectangle.height,
        }),
      );
      const analysis = analyzeBoard(puzzle.size, puzzle.clues, placements);

      expect(analysis.isSolved).toBe(true);
      expect(analysis.issues).toEqual([]);
      expect(analysis.invalidPlacements).toEqual([]);
    }
  });

  it("can derive explicit origins from shipped solution rectangles", () => {
    const puzzle = starterPackPuzzles[0];
    const firstOrigin = findOriginForSolutionRectangle(
      puzzle.clues,
      puzzle.solution[0],
    );

    expect(firstOrigin).toEqual({ row: 3, col: 0 });
  });
});
