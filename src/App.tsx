import { useState } from "react";

import PuzzleShell from "@/components/PuzzleShell";
import { getPuzzleByIndex } from "@/data/starterPack";
import { analyzeBoard, analyzePlacement } from "@/rules";
import type { PlacementSnapshot, PuzzlePlacementHistory } from "@/types/play";
import type { CandidatePlacement } from "@/types/rules";

const EMPTY_PLACEMENT_SNAPSHOT: PlacementSnapshot = [];

function getPuzzleHistory(
  historyByPuzzleId: Record<string, PuzzlePlacementHistory>,
  puzzleId: string,
): PuzzlePlacementHistory {
  return historyByPuzzleId[puzzleId] ?? {
    past: [],
    present: EMPTY_PLACEMENT_SNAPSHOT,
  };
}

function pushPuzzleSnapshot(
  historyByPuzzleId: Record<string, PuzzlePlacementHistory>,
  puzzleId: string,
  nextSnapshot: PlacementSnapshot,
): Record<string, PuzzlePlacementHistory> {
  const currentHistory = getPuzzleHistory(historyByPuzzleId, puzzleId);

  return {
    ...historyByPuzzleId,
    [puzzleId]: {
      past: [...currentHistory.past, currentHistory.present],
      present: nextSnapshot,
    },
  };
}

export default function App() {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [placementHistoryByPuzzleId, setPlacementHistoryByPuzzleId] = useState<
    Record<string, PuzzlePlacementHistory>
  >({});
  const currentPuzzle = getPuzzleByIndex(currentPuzzleIndex);

  if (!currentPuzzle) {
    return (
      <main className="app-shell">
        <section
          aria-label="Starter pack unavailable"
          className="hero-panel"
          style={{ display: "grid", gap: "16px" }}
        >
          <p className="eyebrow">Squares</p>
          <h1>Starter Pack Unavailable</h1>
          <p className="hero-copy">
            No starter-pack puzzles are available yet. Reload the app or restore the bundled
            puzzle file to continue.
          </p>
        </section>
      </main>
    );
  }

  const currentHistory = getPuzzleHistory(placementHistoryByPuzzleId, currentPuzzle.id);
  const currentPlacements = currentHistory.present;
  const currentBoardAnalysis = analyzeBoard(currentPuzzle.size, currentPuzzle.clues, currentPlacements);

  function handlePlaceRectangle(placement: CandidatePlacement) {
    setPlacementHistoryByPuzzleId((currentByPuzzleId) => {
      const currentPlacements = getPuzzleHistory(currentByPuzzleId, currentPuzzle.id).present;
      const nextPlacement = analyzePlacement(
        currentPuzzle.size,
        currentPuzzle.clues,
        placement,
        currentPlacements,
      );

      if (!nextPlacement.isValid) {
        return currentByPuzzleId;
      }

      return pushPuzzleSnapshot(currentByPuzzleId, currentPuzzle.id, [...currentPlacements, placement]);
    });
  }

  const emptyPlacementPrompt = currentPlacements.length === 0
    ? {
        heading: "No rectangles placed yet",
        body: "Drag from a numbered clue to preview a rectangle. Release when the area matches the clue and the outline turns valid.",
      }
    : null;

  return (
    <main className="app-shell">
      <div aria-hidden="true" className="ambient-glow ambient-glow-left" />
      <div aria-hidden="true" className="ambient-glow ambient-glow-right" />
      <PuzzleShell
        canGoNext={getPuzzleByIndex(currentPuzzleIndex + 1) !== undefined}
        canGoPrevious={currentPuzzleIndex > 0}
        onNext={() => {
          setCurrentPuzzleIndex((index) => index + 1);
        }}
        onPrevious={() => {
          setCurrentPuzzleIndex((index) => index - 1);
        }}
        onPlaceRectangle={handlePlaceRectangle}
        placedRectangles={currentPlacements}
        puzzle={currentPuzzle}
        emptyPlacementPrompt={emptyPlacementPrompt}
      />
      <div aria-hidden="true" data-board-solved={currentBoardAnalysis.isSolved} hidden />
    </main>
  );
}
