import type { PuzzleClue } from "@/types/puzzle";
import type {
  BoardAnalysis,
  CandidatePlacement,
  PlacementAnalysis,
  PlacementIssue,
} from "@/types/rules";
import {
  analyzePlacement,
  getPrimaryPlacementIssue,
  isPlacementValid,
} from "./placementAnalysis";

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

function analyzeBoard(
  _size: number,
  _clues: PuzzleClue[],
  _placements: CandidatePlacement[],
): BoardAnalysis {
  return notImplemented("analyzeBoard");
}

function isBoardSolved(
  _analysis: Pick<BoardAnalysis, "isSolved">,
): boolean {
  return notImplemented("isBoardSolved");
}

export { analyzePlacement, getPrimaryPlacementIssue, isPlacementValid, analyzeBoard, isBoardSolved };
