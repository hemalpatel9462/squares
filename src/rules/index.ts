import type { PuzzleClue } from "@/types/puzzle";
import type {
  BoardAnalysis,
  CandidatePlacement,
  PlacementAnalysis,
  PlacementIssue,
} from "@/types/rules";

export {
  PLACEMENT_ISSUE_PRIORITY,
  type BoardAnalysis,
  type BoardIssue,
  type BoardIssueDetail,
  type CandidatePlacement,
  type CellCoord,
  type PlacementAnalysis,
  type PlacementIssue,
  type PlacementIssueDetail,
  type RectangleBounds,
} from "@/types/rules";

function notImplemented(functionName: string): never {
  throw new Error(`@/rules ${functionName} is not implemented yet.`);
}

export function analyzePlacement(
  _size: number,
  _clues: PuzzleClue[],
  _placement: CandidatePlacement,
  _placedRectangles: CandidatePlacement[] = [],
): PlacementAnalysis {
  return notImplemented("analyzePlacement");
}

export function getPrimaryPlacementIssue(
  _analysis: Pick<PlacementAnalysis, "issues" | "primaryIssue">,
): PlacementIssue | null {
  return notImplemented("getPrimaryPlacementIssue");
}

export function isPlacementValid(
  _analysis: Pick<PlacementAnalysis, "isValid">,
): boolean {
  return notImplemented("isPlacementValid");
}

export function analyzeBoard(
  _size: number,
  _clues: PuzzleClue[],
  _placements: CandidatePlacement[],
): BoardAnalysis {
  return notImplemented("analyzeBoard");
}

export function isBoardSolved(
  _analysis: Pick<BoardAnalysis, "isSolved">,
): boolean {
  return notImplemented("isBoardSolved");
}

export { analyzePlacement, getPrimaryPlacementIssue, isPlacementValid, analyzeBoard, isBoardSolved };
