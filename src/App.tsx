import { useEffect, useState } from "react";

import PuzzleBrowser from "@/components/PuzzleBrowser";
import PuzzleShell from "@/components/PuzzleShell";
import { getPuzzleById, getPuzzleByIndex, starterPackPuzzles } from "@/data/starterPack";
import { analyzeBoard, analyzePlacement } from "@/rules";
import type { PlacementSnapshot, PuzzlePlacementHistory } from "@/types/play";
import type { Difficulty } from "@/types/puzzle";
import type { CandidatePlacement } from "@/types/rules";

const EMPTY_PLACEMENT_SNAPSHOT: PlacementSnapshot = [];
const SELECTED_DIFFICULTY_STORAGE_KEY = "squares.selectedDifficulty.v1";

function isDifficulty(value: string | null): value is Difficulty {
  return value === "easy" || value === "medium" || value === "hard";
}

function resolveInitialDifficulty(fallbackDifficulty: Difficulty): Difficulty {
  try {
    const storedDifficulty = window.localStorage.getItem(SELECTED_DIFFICULTY_STORAGE_KEY);

    if (isDifficulty(storedDifficulty)) {
      return storedDifficulty;
    }
  } catch {
    return fallbackDifficulty;
  }

  return fallbackDifficulty;
}

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
  const [activeView, setActiveView] = useState<"browser" | "play">("browser");
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [placementHistoryByPuzzleId, setPlacementHistoryByPuzzleId] = useState<
    Record<string, PuzzlePlacementHistory>
  >({});
  const currentPuzzle = getPuzzleByIndex(currentPuzzleIndex);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(() =>
    resolveInitialDifficulty(currentPuzzle?.difficulty ?? "easy")
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(SELECTED_DIFFICULTY_STORAGE_KEY, selectedDifficulty);
    } catch {
      // Ignore persistence errors to keep play flow working.
    }
  }, [selectedDifficulty]);

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

  function handleSelectPuzzle(selection: { puzzleId: string; difficulty: Difficulty }) {
    const selectedPuzzle = getPuzzleById(selection.puzzleId);

    if (!selectedPuzzle) {
      return;
    }

    setCurrentPuzzleIndex(selectedPuzzle.packIndex);
    setSelectedDifficulty(selectedPuzzle.difficulty);
    setActiveView("play");
  }

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

  function handleNextPuzzle() {
    setCurrentPuzzleIndex((index) => {
      const nextIndex = index + 1;
      const nextPuzzle = getPuzzleByIndex(nextIndex);

      if (!nextPuzzle) {
        return index;
      }

      setSelectedDifficulty(nextPuzzle.difficulty);
      return nextIndex;
    });
  }

  function handlePreviousPuzzle() {
    setCurrentPuzzleIndex((index) => {
      const previousIndex = index - 1;
      const previousPuzzle = getPuzzleByIndex(previousIndex);

      if (!previousPuzzle) {
        return index;
      }

      setSelectedDifficulty(previousPuzzle.difficulty);
      return previousIndex;
    });
  }

  function handleUndo() {
    setPlacementHistoryByPuzzleId((currentByPuzzleId) => {
      const currentHistory = getPuzzleHistory(currentByPuzzleId, currentPuzzle.id);

      if (currentHistory.past.length === 0) {
        return currentByPuzzleId;
      }

      const nextPast = currentHistory.past.slice(0, -1);
      const nextPresent = currentHistory.past[currentHistory.past.length - 1];

      return {
        ...currentByPuzzleId,
        [currentPuzzle.id]: {
          past: nextPast,
          present: nextPresent,
        },
      };
    });
  }

  function handleRemoveRectangle(rectangleIndex: number) {
    setPlacementHistoryByPuzzleId((currentByPuzzleId) => {
      const currentHistory = getPuzzleHistory(currentByPuzzleId, currentPuzzle.id);

      if (rectangleIndex < 0 || rectangleIndex >= currentHistory.present.length) {
        return currentByPuzzleId;
      }

      const nextSnapshot = currentHistory.present.filter((_, index) => index !== rectangleIndex);
      return pushPuzzleSnapshot(currentByPuzzleId, currentPuzzle.id, nextSnapshot);
    });
  }

  function handleReset() {
    setPlacementHistoryByPuzzleId((currentByPuzzleId) => {
      const currentHistory = getPuzzleHistory(currentByPuzzleId, currentPuzzle.id);

      if (currentHistory.present.length === 0) {
        return currentByPuzzleId;
      }

      const shouldReset = window.confirm("Reset this puzzle and clear all placed rectangles?");

      if (!shouldReset) {
        return currentByPuzzleId;
      }

      return pushPuzzleSnapshot(currentByPuzzleId, currentPuzzle.id, []);
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
      {activeView === "browser" ? (
        <PuzzleBrowser
          puzzles={starterPackPuzzles}
          selectedDifficulty={selectedDifficulty}
          onSelectDifficulty={setSelectedDifficulty}
          onSelectPuzzle={handleSelectPuzzle}
        />
      ) : (
        <>
          <PuzzleShell
            canUndo={currentHistory.past.length > 0}
            canGoNext={getPuzzleByIndex(currentPuzzleIndex + 1) !== undefined}
            canGoPrevious={currentPuzzleIndex > 0}
            onBackToBrowser={() => {
              setActiveView("browser");
            }}
            onNext={handleNextPuzzle}
            onReset={handleReset}
            onRemoveRectangle={handleRemoveRectangle}
            onUndo={handleUndo}
            onPrevious={handlePreviousPuzzle}
            onPlaceRectangle={handlePlaceRectangle}
            placedRectangles={currentPlacements}
            puzzle={currentPuzzle}
            emptyPlacementPrompt={emptyPlacementPrompt}
          />
          <div aria-hidden="true" data-board-solved={currentBoardAnalysis.isSolved} hidden />
        </>
      )}
    </main>
  );
}
