import type { CellCoord, PlacementAnalysis, PlacementIssue } from "@/types/rules";
import type { CandidatePlacement } from "@/types/rules";

export type DragPhase = "idle" | "armed" | "dragging" | "snapback" | "settle";

export type ReleaseFeedback = "none" | "invalid-snapback" | "valid-settle";

export interface PointerDragSession {
  pointerId: number;
  pointerType: string;
  origin: CellCoord;
  startClientX: number;
  startClientY: number;
  currentCell: CellCoord;
  selectionBounds: {
    minRow: number;
    maxRow: number;
    minCol: number;
    maxCol: number;
  };
  phase: "armed" | "dragging";
  preview: PlacementAnalysis | null;
}

export interface LivePreviewStatus {
  area: number;
  tone: "valid" | "invalid";
  text: string;
  primaryIssue: PlacementIssue | null;
}

export type PlacementSnapshot = CandidatePlacement[];

export interface PuzzlePlacementHistory {
  past: PlacementSnapshot[];
  present: PlacementSnapshot;
}
