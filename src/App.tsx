import { useEffect, useState } from "react";

import PuzzleBrowser from "@/components/PuzzleBrowser";
import GameTour from "@/components/GameTour";
import PuzzleShell from "@/components/PuzzleShell";
import StartScreen from "@/components/StartScreen";
import { getPuzzleById, getPuzzleByIndex, starterPackPuzzles } from "@/data/starterPack";
import { analyzeBoard, analyzePlacement } from "@/rules";
import type { PlacementSnapshot, PuzzlePlacementHistory } from "@/types/play";
import type { Difficulty } from "@/types/puzzle";
import type { CandidatePlacement } from "@/types/rules";

const EMPTY_PLACEMENT_SNAPSHOT: PlacementSnapshot = [];
const SELECTED_DIFFICULTY_STORAGE_KEY = "squares.selectedDifficulty.v1";
const COMPLETED_PUZZLES_STORAGE_KEY = "squares.completedPuzzleIds.v1";
const HAS_SEEN_TOUR_STORAGE_KEY = "squares.hasSeenTour.v1";

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

function resolveInitialCompletedPuzzleIds(): string[] {
  try {
    const storedValue = window.localStorage.getItem(COMPLETED_PUZZLES_STORAGE_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    const knownPuzzleIds = new Set(starterPackPuzzles.map((puzzle) => puzzle.id));
    return parsedValue.filter(
      (value): value is string => typeof value === "string" && knownPuzzleIds.has(value),
    );
  } catch {
    return [];
  }
}

function hasSeenTour(): boolean {
  try {
    return window.localStorage.getItem(HAS_SEEN_TOUR_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
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
  const [activeView, setActiveView] = useState<"start" | "browser" | "play">("start");
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [placementHistoryByPuzzleId, setPlacementHistoryByPuzzleId] = useState<
    Record<string, PuzzlePlacementHistory>
  >({});
  const [completedPuzzleIds, setCompletedPuzzleIds] = useState<Set<string>>(
    () => new Set(resolveInitialCompletedPuzzleIds()),
  );
  const [isTourOpen, setIsTourOpen] = useState(() => !hasSeenTour());
  const currentPuzzle = getPuzzleByIndex(currentPuzzleIndex);
  const currentHistory = currentPuzzle
    ? getPuzzleHistory(placementHistoryByPuzzleId, currentPuzzle.id)
    : { past: [], present: EMPTY_PLACEMENT_SNAPSHOT };
  const currentPlacements = currentHistory.present;
  const currentBoardAnalysis = currentPuzzle
    ? analyzeBoard(currentPuzzle.size, currentPuzzle.clues, currentPlacements)
    : null;
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

  useEffect(() => {
    if (!currentPuzzle || !currentBoardAnalysis?.isSolved || completedPuzzleIds.has(currentPuzzle.id)) {
      return;
    }

    setCompletedPuzzleIds((currentIds) => {
      if (currentIds.has(currentPuzzle.id)) {
        return currentIds;
      }

      return new Set(currentIds).add(currentPuzzle.id);
    });
  }, [completedPuzzleIds, currentBoardAnalysis?.isSolved, currentPuzzle]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        COMPLETED_PUZZLES_STORAGE_KEY,
        JSON.stringify([...completedPuzzleIds]),
      );
    } catch {
      // Ignore persistence errors to keep play flow working.
    }
  }, [completedPuzzleIds]);

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

  const puzzle = currentPuzzle;

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
      const currentPlacements = getPuzzleHistory(currentByPuzzleId, puzzle.id).present;
      const nextPlacement = analyzePlacement(
        puzzle.size,
        puzzle.clues,
        placement,
        currentPlacements,
      );

      if (!nextPlacement.isValid) {
        return currentByPuzzleId;
      }

      return pushPuzzleSnapshot(currentByPuzzleId, puzzle.id, [...currentPlacements, placement]);
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

  function handleUndo() {
    setPlacementHistoryByPuzzleId((currentByPuzzleId) => {
      const currentHistory = getPuzzleHistory(currentByPuzzleId, puzzle.id);

      if (currentHistory.past.length === 0) {
        return currentByPuzzleId;
      }

      const nextPast = currentHistory.past.slice(0, -1);
      const nextPresent = currentHistory.past[currentHistory.past.length - 1];

      return {
        ...currentByPuzzleId,
        [puzzle.id]: {
          past: nextPast,
          present: nextPresent,
        },
      };
    });
  }

  function handleRemoveRectangle(rectangleIndex: number) {
    setPlacementHistoryByPuzzleId((currentByPuzzleId) => {
      const currentHistory = getPuzzleHistory(currentByPuzzleId, puzzle.id);

      if (rectangleIndex < 0 || rectangleIndex >= currentHistory.present.length) {
        return currentByPuzzleId;
      }

      const nextSnapshot = currentHistory.present.filter((_, index) => index !== rectangleIndex);
      return pushPuzzleSnapshot(currentByPuzzleId, puzzle.id, nextSnapshot);
    });
  }

  function handleReset() {
    setPlacementHistoryByPuzzleId((currentByPuzzleId) => {
      const currentHistory = getPuzzleHistory(currentByPuzzleId, puzzle.id);

      if (currentHistory.present.length === 0) {
        return currentByPuzzleId;
      }

      const shouldReset = window.confirm("Reset this puzzle and clear all placed rectangles?");

      if (!shouldReset) {
        return currentByPuzzleId;
      }

      return pushPuzzleSnapshot(currentByPuzzleId, puzzle.id, []);
    });
  }

  function handleReplay() {
    setPlacementHistoryByPuzzleId((currentByPuzzleId) => {
      const currentHistory = getPuzzleHistory(currentByPuzzleId, puzzle.id);

      if (currentHistory.present.length === 0) {
        return currentByPuzzleId;
      }

      return pushPuzzleSnapshot(currentByPuzzleId, puzzle.id, EMPTY_PLACEMENT_SNAPSHOT);
    });
  }

  function handleCloseTour() {
    setIsTourOpen(false);

    try {
      window.localStorage.setItem(HAS_SEEN_TOUR_STORAGE_KEY, "true");
    } catch {
      // Ignore persistence errors so the tour can still be dismissed.
    }
  }

  return (
    <main className={`app-shell${activeView === "play" ? " app-shell--play" : ""}`}>
      <div aria-hidden="true" className="ambient-glow ambient-glow-left" />
      <div aria-hidden="true" className="ambient-glow ambient-glow-right" />
      {activeView === "start" ? (
        <StartScreen onStart={() => setActiveView("browser")} />
      ) : activeView === "browser" ? (
          <PuzzleBrowser
          completedPuzzleIds={completedPuzzleIds}
          puzzles={starterPackPuzzles}
          selectedDifficulty={selectedDifficulty}
          onSelectDifficulty={setSelectedDifficulty}
          onSelectPuzzle={handleSelectPuzzle}
          onStartTour={() => setIsTourOpen(true)}
          onBackToStart={() => setActiveView("start")}
        />
      ) : (
        <>
          <PuzzleShell
            canUndo={currentHistory.past.length > 0}
            canGoNext={getPuzzleByIndex(currentPuzzleIndex + 1) !== undefined}
            onBackToBrowser={() => {
              setActiveView("browser");
            }}
            onNext={handleNextPuzzle}
            onReset={handleReset}
            onRemoveRectangle={handleRemoveRectangle}
            onUndo={handleUndo}
            onPlaceRectangle={handlePlaceRectangle}
            onReplay={handleReplay}
            placedRectangles={currentPlacements}
            puzzle={puzzle}
            isComplete={currentBoardAnalysis?.isSolved ?? false}
          />
          <div aria-hidden="true" data-board-solved={currentBoardAnalysis?.isSolved ?? false} hidden />
        </>
      )}
      <GameTour isOpen={isTourOpen && activeView !== "start"} onClose={handleCloseTour} />
    </main>
  );
}
