import type { PuzzleClue } from "@/types/puzzle";

export interface CellCoord {
  row: number;
  col: number;
}

export interface RectangleBounds {
  row: number;
  col: number;
  width: number;
  height: number;
}

export interface CandidatePlacement extends RectangleBounds {
  origin: CellCoord;
}

export type PlacementIssue = "missing_origin_clue" | "contains_other_clue" | "wrong_area" | "out_of_bounds" | "overlap";

export const PLACEMENT_ISSUE_PRIORITY = [
  "missing_origin_clue",
  "contains_other_clue",
  "wrong_area",
  "out_of_bounds",
  "overlap",
] as const satisfies readonly PlacementIssue[];

export interface PlacementIssueDetail {
  issue: PlacementIssue;
  cells?: CellCoord[];
  clues?: PuzzleClue[];
}

export interface PlacementAnalysis {
  placement: CandidatePlacement;
  isValid: boolean;
  issues: PlacementIssue[];
  issueDetails: PlacementIssueDetail[];
  coveredCells: CellCoord[];
  primaryIssue: PlacementIssue | null;
}

export type BoardIssue =
  | "invalid_placement"
  | "overlap"
  | "uncovered_cell"
  | "missing_clue_coverage"
  | "foreign_clue_coverage";

export interface BoardIssueDetail {
  issue: BoardIssue;
  cells?: CellCoord[];
  clues?: PuzzleClue[];
  placements?: CandidatePlacement[];
}

export interface BoardAnalysis {
  isSolved: boolean;
  placements: PlacementAnalysis[];
  issues: BoardIssue[];
  issueDetails: BoardIssueDetail[];
  uncoveredCells: CellCoord[];
  overlappingCells: CellCoord[];
  missingClueCoverage: PuzzleClue[];
  foreignClueCoverage: PuzzleClue[];
}
