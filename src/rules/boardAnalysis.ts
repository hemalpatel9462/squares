import type { PuzzleClue } from "@/types/puzzle";
import type {
  BoardAnalysis,
  BoardIssue,
  BoardIssueDetail,
  CandidatePlacement,
  CellCoord,
  PlacementAnalysis,
} from "@/types/rules";

import { analyzePlacement } from "./placementAnalysis";

function toCellKey(cell: CellCoord): string {
  return `${cell.row}:${cell.col}`;
}

function isInBounds(size: number, cell: CellCoord): boolean {
  return cell.row >= 0 && cell.col >= 0 && cell.row < size && cell.col < size;
}

function buildBoardCells(size: number): CellCoord[] {
  const cells: CellCoord[] = [];

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      cells.push({ row, col });
    }
  }

  return cells;
}

export function analyzeBoard(
  size: number,
  clues: PuzzleClue[],
  placements: CandidatePlacement[],
): BoardAnalysis {
  const placementAnalyses = placements.map((placement, index) =>
    analyzePlacement(
      size,
      clues,
      placement,
      placements.filter((_, placementIndex) => placementIndex !== index),
    ),
  );
  const invalidPlacements = placementAnalyses.filter(
    (analysis) => !analysis.isValid,
  );
  const coverage = new Map<string, { cell: CellCoord; count: number }>();

  for (const analysis of placementAnalyses) {
    for (const cell of analysis.coveredCells) {
      if (!isInBounds(size, cell)) {
        continue;
      }

      const key = toCellKey(cell);
      const existing = coverage.get(key);

      if (existing) {
        existing.count += 1;
        continue;
      }

      coverage.set(key, { cell, count: 1 });
    }
  }

  const uncoveredCells = buildBoardCells(size).filter(
    (cell) => !coverage.has(toCellKey(cell)),
  );
  const overlappingCells = [...coverage.values()]
    .filter((entry) => entry.count > 1)
    .map((entry) => entry.cell);
  const issues = new Set<BoardIssue>();
  const issueDetails: BoardIssueDetail[] = [];

  if (invalidPlacements.length > 0) {
    issues.add("invalid_placement");
    issueDetails.push({
      issue: "invalid_placement",
      placements: invalidPlacements.map((analysis) => analysis.placement),
    });
  }

  if (uncoveredCells.length > 0) {
    issues.add("uncovered_cell");
    issueDetails.push({
      issue: "uncovered_cell",
      cells: uncoveredCells,
    });
  }

  if (overlappingCells.length > 0) {
    issues.add("overlap");
    issueDetails.push({
      issue: "overlap",
      cells: overlappingCells,
    });
  }

  return {
    isSolved: issues.size === 0,
    placements: placementAnalyses,
    invalidPlacements,
    issues: [...issues],
    issueDetails,
    uncoveredCells,
    uncoveredCellKeys: uncoveredCells.map(toCellKey),
    overlappingCells,
    overlappingCellKeys: overlappingCells.map(toCellKey),
  };
}

export function isBoardSolved(
  analysis: Pick<BoardAnalysis, "isSolved">,
): boolean {
  return analysis.isSolved;
}
