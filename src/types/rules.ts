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

export interface CandidatePlacement {
  origin: CellCoord;
  rectangle: RectangleBounds;
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
  originClue: PuzzleClue | null;
  coveredCells: CellCoord[];
  coveredCellKeys: string[];
  rectangleArea: number;
  issues: PlacementIssue[];
  issueDetails: PlacementIssueDetail[];
  primaryIssue: PlacementIssue | null;
  isValid: boolean;
}

export type BoardIssue = "invalid_placement" | "uncovered_cell" | "overlap";

export interface BoardIssueDetail {
  issue: BoardIssue;
  cells?: CellCoord[];
  placements?: CandidatePlacement[];
}

export interface BoardAnalysis {
  isSolved: boolean;
  placements: PlacementAnalysis[];
  invalidPlacements: PlacementAnalysis[];
  issues: BoardIssue[];
  issueDetails: BoardIssueDetail[];
  uncoveredCells: CellCoord[];
  uncoveredCellKeys: string[];
  overlappingCells: CellCoord[];
  overlappingCellKeys: string[];
}
