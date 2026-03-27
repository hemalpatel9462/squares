export type Difficulty = "easy" | "medium" | "hard";

export interface PuzzleClue {
  row: number;
  col: number;
  value: number;
}

export interface PuzzleSolutionRectangle {
  row: number;
  col: number;
  width: number;
  height: number;
  area: number;
}

export interface PuzzleRecord {
  id: string;
  size: number;
  difficulty: Difficulty;
  clues: PuzzleClue[];
  solution: PuzzleSolutionRectangle[];
}

export interface StarterPackCounts {
  total: number;
  easy: number;
  medium: number;
  hard: number;
}

export interface StarterPackRecord {
  game: "Squares";
  version: string;
  format: "starter-pack";
  notes: string[];
  counts: StarterPackCounts;
  puzzles: PuzzleRecord[];
}

export interface PuzzleListItem extends PuzzleRecord {
  packIndex: number;
  packTotal: number;
  difficultyLabel: "Easy" | "Medium" | "Hard";
}
