import { describe, expect, it } from "vitest";

import { analyzeBoard } from "@/rules";
import { starterPackPuzzles } from "@/data/starterPack";
import { findOriginForSolutionRectangle } from "@/rules/__tests__/ruleTestUtils";

describe("starter pack solution fixtures", () => {
  it("exposes the board analyzer for shipped-fixture verification", () => {
    expect(analyzeBoard).toBeTypeOf("function");
    expect(starterPackPuzzles).toHaveLength(40);
  });

  it.todo("accepts shipped starter-pack solution rectangles as solved partitions");

  it("can derive explicit origins from shipped solution rectangles", () => {
    const puzzle = starterPackPuzzles[0];
    const firstOrigin = findOriginForSolutionRectangle(
      puzzle.clues,
      puzzle.solution[0],
    );

    expect(firstOrigin).toEqual({ row: 3, col: 0 });
  });
});
