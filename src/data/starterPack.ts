import rawStarterPack from "../../Origianl Assets/squares-starter-pack.json";

import type {
  Difficulty,
  PuzzleListItem,
  PuzzleRecord,
  StarterPackRecord,
} from "@/types/puzzle";

const EXPECTED_COUNTS = {
  total: 40,
  easy: 14,
  medium: 14,
  hard: 12,
} as const;

const DIFFICULTY_LABELS: Record<Difficulty, PuzzleListItem["difficultyLabel"]> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

function fail(message: string): never {
  throw new Error(`Invalid starter pack: ${message}`);
}

function assertDifficulty(value: string, puzzleId: string): asserts value is Difficulty {
  if (value !== "easy" && value !== "medium" && value !== "hard") {
    fail(`puzzle "${puzzleId}" has unsupported difficulty "${value}"`);
  }
}

function validateStarterPack(pack: StarterPackRecord): StarterPackRecord {
  if (pack.game !== "Squares") {
    fail(`expected game "Squares" but received "${pack.game}"`);
  }

  if (pack.format !== "starter-pack") {
    fail(`expected format "starter-pack" but received "${pack.format}"`);
  }

  if (pack.counts.total !== EXPECTED_COUNTS.total) {
    fail(`expected total count ${EXPECTED_COUNTS.total} but received ${pack.counts.total}`);
  }

  if (pack.counts.easy !== EXPECTED_COUNTS.easy) {
    fail(`expected easy count ${EXPECTED_COUNTS.easy} but received ${pack.counts.easy}`);
  }

  if (pack.counts.medium !== EXPECTED_COUNTS.medium) {
    fail(
      `expected medium count ${EXPECTED_COUNTS.medium} but received ${pack.counts.medium}`,
    );
  }

  if (pack.counts.hard !== EXPECTED_COUNTS.hard) {
    fail(`expected hard count ${EXPECTED_COUNTS.hard} but received ${pack.counts.hard}`);
  }

  if (pack.puzzles.length !== EXPECTED_COUNTS.total) {
    fail(`expected ${EXPECTED_COUNTS.total} puzzles but received ${pack.puzzles.length}`);
  }

  for (const puzzle of pack.puzzles) {
    if (puzzle.size < 4 || puzzle.size > 8) {
      fail(`puzzle "${puzzle.id}" has unsupported size ${puzzle.size}`);
    }

    assertDifficulty(puzzle.difficulty, puzzle.id);
  }

  return pack;
}

const validatedStarterPack = validateStarterPack(rawStarterPack as StarterPackRecord);

export const starterPack: StarterPackRecord = validatedStarterPack;

export const starterPackMeta = {
  game: starterPack.game,
  version: starterPack.version,
  format: starterPack.format,
  notes: starterPack.notes,
  counts: starterPack.counts,
  total: starterPack.counts.total,
} as const;

export const starterPackPuzzles: PuzzleListItem[] = starterPack.puzzles.map(
  (puzzle: PuzzleRecord, index) => ({
    ...puzzle,
    packIndex: index,
    packTotal: starterPack.counts.total,
    difficultyLabel: DIFFICULTY_LABELS[puzzle.difficulty],
  }),
);

export function getPuzzleById(id: string): PuzzleListItem | undefined {
  return starterPackPuzzles.find((puzzle) => puzzle.id === id);
}

export function getPuzzleByIndex(index: number): PuzzleListItem | undefined {
  return starterPackPuzzles[index];
}
