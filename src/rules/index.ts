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
import { analyzeBoard, isBoardSolved } from "./boardAnalysis";

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

export { analyzePlacement, getPrimaryPlacementIssue, isPlacementValid, analyzeBoard, isBoardSolved };
