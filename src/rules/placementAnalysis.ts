import type { PuzzleClue } from "@/types/puzzle";
import {
  type CandidatePlacement,
  type CellCoord,
  type PlacementAnalysis,
  type PlacementIssue,
  type PlacementIssueDetail,
  type RectangleBounds,
} from "@/types/rules";

const PLACEMENT_ISSUE_ORDER = ["missing_origin_clue", "contains_other_clue", "wrong_area", "out_of_bounds", "overlap"] as const satisfies readonly PlacementIssue[];

function toCellKey(cell: CellCoord): string {
  return `${cell.row}:${cell.col}`;
}

function getRectangleArea(rectangle: RectangleBounds): number {
  return rectangle.width * rectangle.height;
}

function getCoveredCells(rectangle: RectangleBounds): CellCoord[] {
  const coveredCells: CellCoord[] = [];

  for (let row = rectangle.row; row < rectangle.row + rectangle.height; row += 1) {
    for (let col = rectangle.col; col < rectangle.col + rectangle.width; col += 1) {
      coveredCells.push({ row, col });
    }
  }

  return coveredCells;
}

function isInBounds(size: number, cell: CellCoord): boolean {
  return cell.row >= 0 && cell.col >= 0 && cell.row < size && cell.col < size;
}

function containsCell(rectangle: RectangleBounds, cell: CellCoord): boolean {
  return (
    cell.row >= rectangle.row &&
    cell.row < rectangle.row + rectangle.height &&
    cell.col >= rectangle.col &&
    cell.col < rectangle.col + rectangle.width
  );
}

function findClue(clues: PuzzleClue[], cell: CellCoord): PuzzleClue | null {
  return clues.find((clue) => clue.row === cell.row && clue.col === cell.col) ?? null;
}

function getPlacementCells(placements: CandidatePlacement[]): Set<string> {
  const occupiedCells = new Set<string>();

  for (const placement of placements) {
    for (const cell of getCoveredCells(placement.rectangle)) {
      occupiedCells.add(toCellKey(cell));
    }
  }

  return occupiedCells;
}

export function getPrimaryPlacementIssue(
  issues: PlacementIssue[],
): PlacementIssue | null {
  return PLACEMENT_ISSUE_ORDER.find((issue) => issues.includes(issue)) ?? null;
}

export function analyzePlacement(
  size: number,
  clues: PuzzleClue[],
  placement: CandidatePlacement,
  placedRectangles: CandidatePlacement[] = [],
): PlacementAnalysis {
  const coveredCells = getCoveredCells(placement.rectangle);
  const coveredCellKeys = coveredCells.map(toCellKey);
  const rectangleArea = getRectangleArea(placement.rectangle);
  const originClue = findClue(clues, placement.origin);
  const foreignClues = clues.filter(
    (clue) =>
      containsCell(placement.rectangle, clue) &&
      (clue.row !== placement.origin.row || clue.col !== placement.origin.col),
  );
  const overlappingCells = coveredCells.filter((cell) =>
    getPlacementCells(placedRectangles).has(toCellKey(cell)),
  );
  const issueDetails = new Map<PlacementIssue, PlacementIssueDetail>();

  if (!originClue || !containsCell(placement.rectangle, placement.origin)) {
    issueDetails.set("missing_origin_clue", {
      issue: "missing_origin_clue",
      cells: [placement.origin],
      clues: originClue ? [originClue] : undefined,
    });
  }

  if (foreignClues.length > 0) {
    issueDetails.set("contains_other_clue", {
      issue: "contains_other_clue",
      clues: foreignClues,
      cells: foreignClues.map((clue) => ({ row: clue.row, col: clue.col })),
    });
  }

  if (originClue && rectangleArea !== originClue.value) {
    issueDetails.set("wrong_area", {
      issue: "wrong_area",
      clues: [originClue],
      cells: coveredCells,
    });
  }

  if (
    placement.rectangle.width <= 0 ||
    placement.rectangle.height <= 0 ||
    coveredCells.some((cell) => !isInBounds(size, cell))
  ) {
    issueDetails.set("out_of_bounds", {
      issue: "out_of_bounds",
      cells: coveredCells.filter((cell) => !isInBounds(size, cell)),
    });
  }

  if (overlappingCells.length > 0) {
    issueDetails.set("overlap", {
      issue: "overlap",
      cells: overlappingCells,
    });
  }

  const issues = PLACEMENT_ISSUE_ORDER.filter((issue) => issueDetails.has(issue));
  const primaryIssue = getPrimaryPlacementIssue(issues);

  return {
    placement,
    originClue,
    coveredCells,
    coveredCellKeys,
    rectangleArea,
    issues,
    issueDetails: issues.map((issue) => issueDetails.get(issue)!),
    primaryIssue,
    isValid: issues.length === 0,
  };
}

export function isPlacementValid(
  analysis: Pick<PlacementAnalysis, "isValid">,
): boolean {
  return analysis.isValid;
}
