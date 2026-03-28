import type { PuzzleClue, PuzzleRecord, PuzzleSolutionRectangle } from "@/types/puzzle";
import type { CandidatePlacement, CellCoord, RectangleBounds } from "@/types/rules";

const DEFAULT_CLUES: PuzzleClue[] = [
  { row: 0, col: 0, value: 4 },
  { row: 0, col: 2, value: 4 },
  { row: 2, col: 0, value: 2 },
  { row: 2, col: 1, value: 6 },
];

export function createPuzzleFixture(
  overrides: Partial<PuzzleRecord> = {},
): PuzzleRecord {
  return {
    id: "fixture-001",
    size: 4,
    difficulty: "easy",
    clues: overrides.clues ?? DEFAULT_CLUES,
    solution: overrides.solution ?? [],
    ...overrides,
  };
}

export function createPlacement(
  origin: CellCoord,
  rectangle: RectangleBounds,
): CandidatePlacement {
  return {
    origin,
    rectangle,
  };
}

export function createSolvedFixturePlacements(): CandidatePlacement[] {
  return [
    createPlacement({ row: 0, col: 0 }, { row: 0, col: 0, width: 2, height: 2 }),
    createPlacement({ row: 0, col: 2 }, { row: 0, col: 2, width: 2, height: 2 }),
    createPlacement({ row: 2, col: 0 }, { row: 2, col: 0, width: 1, height: 2 }),
    createPlacement({ row: 2, col: 1 }, { row: 2, col: 1, width: 3, height: 2 }),
  ];
}

export function findOriginForSolutionRectangle(
  clues: PuzzleClue[],
  rectangle: PuzzleSolutionRectangle,
): CellCoord {
  const enclosedClues = clues.filter((clue) =>
    clue.row >= rectangle.row &&
    clue.row < rectangle.row + rectangle.height &&
    clue.col >= rectangle.col &&
    clue.col < rectangle.col + rectangle.width,
  );

  if (enclosedClues.length !== 1) {
    throw new Error(
      `Expected exactly one clue inside solution rectangle (${rectangle.row},${rectangle.col},${rectangle.width},${rectangle.height}) but found ${enclosedClues.length}.`,
    );
  }

  return {
    row: enclosedClues[0].row,
    col: enclosedClues[0].col,
  };
}
