import { useEffect, useMemo, useRef, useState } from "react";

import { analyzePlacement } from "@/rules";
import type { PuzzleClue, PuzzleListItem } from "@/types/puzzle";
import type { PointerDragSession, ReleaseFeedback } from "@/types/play";
import type {
  CandidatePlacement,
  CellCoord,
  PlacementAnalysis,
  PlacementIssue,
} from "@/types/rules";

export const MOUSE_DRAG_THRESHOLD_PX = 6;
export const TOUCH_DRAG_THRESHOLD_PX = 10;
const VALID_SETTLE_DURATION_MS = 180;
const INVALID_SNAPBACK_DURATION_MS = 220;

interface PuzzleBoardProps {
  puzzle: PuzzleListItem;
  placedRectangles?: CandidatePlacement[];
  onPlaceRectangle?: (placement: CandidatePlacement) => void;
}

function toCellKey(cell: CellCoord): string {
  return `${cell.row}:${cell.col}`;
}

function getPreviewLabel(issue: PlacementIssue | null): string {
  switch (issue) {
    case null:
      return "Valid";
    case "missing_origin_clue":
      return "Missing clue";
    case "contains_other_clue":
      return "Contains another clue";
    case "wrong_area":
      return "Wrong area";
    case "out_of_bounds":
      return "Out of bounds";
    case "overlap":
      return "Overlaps another rectangle";
    default:
      return "Valid";
  }
}

function getDragThreshold(pointerType: string): number {
  return pointerType === "touch" ? TOUCH_DRAG_THRESHOLD_PX : MOUSE_DRAG_THRESHOLD_PX;
}

function isFiniteNumber(value: number | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function resolvePointerId(
  pointerId: number | undefined,
  activeSession: PointerDragSession | null,
): number | undefined {
  if (typeof pointerId === "number" && Number.isFinite(pointerId) && pointerId > 0) {
    return pointerId;
  }

  return activeSession?.pointerId;
}

function pointToCell(clientX: number, clientY: number, rect: DOMRect, size: number): CellCoord {
  const col = Math.max(0, Math.min(size - 1, Math.floor(((clientX - rect.left) / rect.width) * size)));
  const row = Math.max(0, Math.min(size - 1, Math.floor(((clientY - rect.top) / rect.height) * size)));

  return { row, col };
}

function getRectangleCenterDistance(candidate: CandidatePlacement, target: CellCoord): number {
  const centerRow = candidate.rectangle.row + candidate.rectangle.height / 2;
  const centerCol = candidate.rectangle.col + candidate.rectangle.width / 2;
  const targetRow = target.row + 0.5;
  const targetCol = target.col + 0.5;

  return Math.hypot(centerRow - targetRow, centerCol - targetCol);
}

function buildCandidatePlacement(size: number, origin: CellCoord, target: CellCoord): CandidatePlacement {
  const candidates: CandidatePlacement[] = [];
  const minRow = Math.min(origin.row, target.row);
  const maxRow = Math.max(origin.row, target.row);
  const minCol = Math.min(origin.col, target.col);
  const maxCol = Math.max(origin.col, target.col);

  for (let row = 0; row <= minRow; row += 1) {
    for (let bottom = maxRow; bottom < size; bottom += 1) {
      for (let col = 0; col <= minCol; col += 1) {
        for (let right = maxCol; right < size; right += 1) {
          candidates.push({
            origin,
            rectangle: {
              row,
              col,
              width: right - col + 1,
              height: bottom - row + 1,
            },
          });
        }
      }
    }
  }

  return candidates.sort((left, right) => {
    const leftArea = left.rectangle.width * left.rectangle.height;
    const rightArea = right.rectangle.width * right.rectangle.height;

    if (leftArea !== rightArea) {
      return leftArea - rightArea;
    }

    return (
      getRectangleCenterDistance(left, target) - getRectangleCenterDistance(right, target)
    );
  })[0];
}

function createPreview(
  size: number,
  clues: PuzzleClue[],
  origin: CellCoord,
  target: CellCoord,
  placedRectangles: CandidatePlacement[],
): PlacementAnalysis {
  const candidate = buildCandidatePlacement(size, origin, target);

  return analyzePlacement(size, clues, candidate, placedRectangles);
}

export function PuzzleBoard({
  onPlaceRectangle,
  placedRectangles = [],
  puzzle,
}: PuzzleBoardProps) {
  const [session, setSession] = useState<PointerDragSession | null>(null);
  const [releaseFeedback, setReleaseFeedback] = useState<ReleaseFeedback>("none");
  const feedbackTimeoutRef = useRef<number | null>(null);
  const sessionRef = useRef<PointerDragSession | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);

  const clueMap = useMemo(
    () => new Map(puzzle.clues.map((clue) => [`${clue.row}:${clue.col}`, clue.value] as const)),
    [puzzle.clues],
  );

  useEffect(() => {
    if (feedbackTimeoutRef.current !== null) {
      window.clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }

    sessionRef.current = null;
    setSession(null);
    setReleaseFeedback("none");
  }, [puzzle.id]);

  useEffect(() => () => {
    if (feedbackTimeoutRef.current !== null) {
      window.clearTimeout(feedbackTimeoutRef.current);
    }
  }, []);

  const preview = session?.preview ?? null;
  const previewCellKeys = new Set(preview?.coveredCellKeys ?? []);
  const placedCellMap = new Map<string, number>();

  placedRectangles.forEach((placement, index) => {
    for (
      let row = placement.rectangle.row;
      row < placement.rectangle.row + placement.rectangle.height;
      row += 1
    ) {
      for (
        let col = placement.rectangle.col;
        col < placement.rectangle.col + placement.rectangle.width;
        col += 1
      ) {
        placedCellMap.set(`${row}:${col}`, index);
      }
    }
  });

  const cells = Array.from({ length: puzzle.size * puzzle.size }, (_, index) => {
    const row = Math.floor(index / puzzle.size);
    const col = index % puzzle.size;
    const key = `${row}:${col}`;
    const clueValue = clueMap.get(key);

    return {
      row,
      col,
      key,
      clueValue,
      placedRectangleIndex: placedCellMap.get(key) ?? null,
      isPreviewed: previewCellKeys.has(key),
      isPreviewOrigin: session?.origin.row === row && session.origin.col === col,
    };
  });

  function clearFeedbackTimer() {
    if (feedbackTimeoutRef.current !== null) {
      window.clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }
  }

  function scheduleReleaseFeedback(nextFeedback: ReleaseFeedback, durationMs: number) {
    clearFeedbackTimer();
    setReleaseFeedback(nextFeedback);
    feedbackTimeoutRef.current = window.setTimeout(() => {
      setReleaseFeedback("none");
      feedbackTimeoutRef.current = null;
    }, durationMs);
  }

  function clearInteraction() {
    clearFeedbackTimer();
    sessionRef.current = null;
    setSession(null);
    setReleaseFeedback("none");
  }

  function syncSession(nextSession: PointerDragSession | null) {
    sessionRef.current = nextSession;
    setSession(nextSession);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>, origin: CellCoord) {
    clearFeedbackTimer();
    setReleaseFeedback("none");
    syncSession({
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      origin,
      startClientX: event.clientX ?? 0,
      startClientY: event.clientY ?? 0,
      currentCell: origin,
      phase: "armed",
      preview: null,
    });
  }

  function handlePointerMove(
    pointerId: number | undefined,
    clientX?: number,
    clientY?: number,
    targetCell?: CellCoord,
  ) {
    const boardElement = boardRef.current;
    const current = sessionRef.current;
    const resolvedPointerId = resolvePointerId(pointerId, current);

    if (!boardElement || !current || resolvedPointerId !== current.pointerId) {
      return;
    }

    const nextCell =
      targetCell ??
      (isFiniteNumber(clientX) && isFiniteNumber(clientY)
        ? pointToCell(clientX, clientY, boardElement.getBoundingClientRect(), puzzle.size)
        : null);

    if (!nextCell) {
      return;
    }

    const moved =
      isFiniteNumber(clientX) && isFiniteNumber(clientY)
        ? Math.hypot(clientX - current.startClientX, clientY - current.startClientY)
        : 0;
    const threshold = getDragThreshold(current.pointerType);
    const crossedIntoNewCell =
      nextCell.row !== current.origin.row || nextCell.col !== current.origin.col;
    const shouldDrag = current.phase === "dragging" || moved >= threshold || crossedIntoNewCell;

    if (!shouldDrag) {
      syncSession({
        ...current,
        currentCell: nextCell,
      });
      return;
    }

    if (current.phase === "armed" && "setPointerCapture" in boardElement) {
      try {
        boardElement.setPointerCapture(resolvedPointerId);
      } catch {
        // Native listeners still keep drag tracking alive if pointer capture is unavailable.
      }
    }

    syncSession({
      ...current,
      currentCell: nextCell,
      phase: "dragging",
      preview: createPreview(
        puzzle.size,
        puzzle.clues,
        current.origin,
        nextCell,
        placedRectangles,
      ),
    });
  }

  function releasePointerCapture(pointerId: number) {
    const boardElement = boardRef.current;
    if (
      boardElement &&
      "hasPointerCapture" in boardElement &&
      boardElement.hasPointerCapture(pointerId)
    ) {
      boardElement.releasePointerCapture(pointerId);
    }
  }

  function handlePointerUp(pointerId: number) {
    let nextFeedback: ReleaseFeedback = "none";
    const current = sessionRef.current;
    const resolvedPointerId = resolvePointerId(pointerId, current);

    if (!current || resolvedPointerId !== current.pointerId) {
      return;
    }

    releasePointerCapture(resolvedPointerId);

    if (current.preview?.isValid) {
      onPlaceRectangle?.(current.preview.placement);
      nextFeedback = "valid-settle";
    } else if (current.phase === "dragging") {
      nextFeedback = "invalid-snapback";
    }

    syncSession(null);

    if (nextFeedback === "valid-settle") {
      scheduleReleaseFeedback("valid-settle", VALID_SETTLE_DURATION_MS);
    }

    if (nextFeedback === "invalid-snapback") {
      scheduleReleaseFeedback("invalid-snapback", INVALID_SNAPBACK_DURATION_MS);
    }
  }

  function handlePointerCancel(pointerId?: number) {
    const current = sessionRef.current;
    const resolvedPointerId = resolvePointerId(pointerId, current);

    if (resolvedPointerId !== undefined) {
      releasePointerCapture(resolvedPointerId);
    }

    clearInteraction();
  }

  const previewTone = preview?.isValid ? "valid" : "invalid";
  const previewLabel = preview ? getPreviewLabel(preview.primaryIssue) : null;

  return (
    <div className="board-card">
      <div className="board-card__status" aria-live="polite">
        {preview ? (
          <div className="board-preview-chip" data-tone={previewTone}>
            <span>Area {preview.rectangleArea}</span>
            <span>{previewLabel}</span>
          </div>
        ) : (
          <div className="board-preview-chip board-preview-chip--placeholder" aria-hidden="true" />
        )}
      </div>
      <div
        aria-label={`${puzzle.size} by ${puzzle.size} puzzle board`}
        className="board-grid"
        data-release-feedback={releaseFeedback}
        onPointerCancel={(event) => {
          handlePointerCancel(event.pointerId);
        }}
        onPointerMove={(event) => {
          handlePointerMove(event.pointerId, event.clientX, event.clientY);
        }}
        onPointerUp={(event) => {
          handlePointerUp(event.pointerId);
        }}
        ref={boardRef}
        role="img"
        style={{ gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))` }}
      >
        {cells.map((cell) => {
          const isClue = cell.clueValue !== undefined;
          const previewState = cell.isPreviewed ? (preview?.isValid ? "valid" : "invalid") : undefined;
          const placedRectangleIndex = cell.placedRectangleIndex;

          return (
            <div
              key={cell.key}
              className={`board-cell${isClue ? " board-cell-clue" : ""}`}
              data-cell-kind={isClue ? "clue" : "empty"}
              data-col={cell.col}
              data-placed-cell={placedRectangleIndex !== null ? "true" : undefined}
              data-placed-rectangle={
                placedRectangleIndex !== null ? String(placedRectangleIndex) : undefined
              }
              data-preview-active={cell.isPreviewed ? "true" : undefined}
              data-preview-origin={cell.isPreviewOrigin ? "true" : undefined}
              data-preview-state={previewState}
              data-row={cell.row}
              onPointerEnter={(event) => {
                handlePointerMove(
                  event.pointerId,
                  event.clientX,
                  event.clientY,
                  { row: cell.row, col: cell.col },
                );
              }}
              onPointerMove={(event) => {
                handlePointerMove(
                  event.pointerId,
                  event.clientX,
                  event.clientY,
                  { row: cell.row, col: cell.col },
                );
              }}
              onPointerDown={
                isClue
                  ? (event) => {
                      handlePointerDown(event, { row: cell.row, col: cell.col });
                    }
                  : undefined
              }
            >
              {isClue ? cell.clueValue : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PuzzleBoard;
