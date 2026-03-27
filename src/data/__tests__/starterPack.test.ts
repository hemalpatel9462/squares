import { describe, expect, it } from "vitest";

import {
  getPuzzleByIndex,
  starterPack,
  starterPackPuzzles,
} from "../starterPack";

describe("starterPack", () => {
  it("exposes exactly 40 puzzles with the shipped 14/14/12 difficulty split", () => {
    const counts = starterPackPuzzles.reduce(
      (totals, puzzle) => {
        totals[puzzle.difficulty] += 1;
        return totals;
      },
      { easy: 0, medium: 0, hard: 0 },
    );

    expect(starterPackPuzzles).toHaveLength(40);
    expect(starterPack.counts.total).toBe(40);
    expect(counts.easy).toBe(14);
    expect(counts.medium).toBe(14);
    expect(counts.hard).toBe(12);
  });

  it("keeps puzzle ids and clue coordinates valid within legal board sizes", () => {
    const encounteredSizes = new Set<number>();

    for (const puzzle of starterPackPuzzles) {
      expect(puzzle.id).toMatch(/^(easy|medium|hard)-\d{3}$/);
      expect(puzzle.size).toBeGreaterThanOrEqual(4);
      expect(puzzle.size).toBeLessThanOrEqual(8);

      encounteredSizes.add(puzzle.size);

      for (const clue of puzzle.clues) {
        expect(clue.row).toBeGreaterThanOrEqual(0);
        expect(clue.col).toBeGreaterThanOrEqual(0);
        expect(clue.row).toBeLessThan(puzzle.size);
        expect(clue.col).toBeLessThan(puzzle.size);
      }
    }

    expect([...encounteredSizes].sort((left, right) => left - right)).toEqual([4, 5, 6, 7, 8]);
  });

  it("returns the first and last shipped puzzles by pack index", () => {
    expect(getPuzzleByIndex(0)?.id).toBe("easy-001");
    expect(getPuzzleByIndex(0)?.packIndex).toBe(0);
    expect(getPuzzleByIndex(39)?.id).toBe("hard-012");
    expect(getPuzzleByIndex(39)?.packIndex).toBe(39);
  });
});
