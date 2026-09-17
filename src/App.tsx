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

interface PuzzleTimerState {
  elapsedMs: number;
  startedAtMs: number | null;
}

function getElapsedMilliseconds(timer: PuzzleTimerState, now: number): number {
  if (timer.startedAtMs === null) {
    return timer.elapsedMs;
  }

  return timer.elapsedMs + Math.max(0, now - timer.startedAtMs);
}

function formatElapsedTime(elapsedMs: number): string {
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

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
  const [timerByPuzzleId, setTimerByPuzzleId] = useState<Record<string, PuzzleTimerState>>({});
  const [timerNow, setTimerNow] = useState(() => Date.now());
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
  const currentTimer = currentPuzzle ? timerByPuzzleId[currentPuzzle.id] : undefined;
  const currentElapsedMs = currentTimer ? getElapsedMilliseconds(currentTimer, timerNow) : 0;
  const currentElapsedTime = formatElapsedTime(currentElapsedMs);

  useEffect(() => {
    try {
      window.localStorage.setItem(SELECTED_DIFFICULTY_STORAGE_KEY, selectedDifficulty);
    } catch {
      // Ignore persistence errors to keep play flow working.
    }
  }, [selectedDifficulty]);

  useEffect(() => {
    if (!currentPuzzle) {
      return;
    }

    const now = Date.now();
    const shouldRun = activeView === "play" && !currentBoardAnalysis?.isSolved;
    setTimerNow(now);

    setTimerByPuzzleId((currentTimers) => {
      const currentTimer = currentTimers[currentPuzzle.id];

      if (!currentTimer) {
        return shouldRun
          ? {
              ...currentTimers,
              [currentPuzzle.id]: { elapsedMs: 0, startedAtMs: now },
            }
          : currentTimers;
      }

      if (shouldRun) {
        return currentTimer.startedAtMs === null
          ? {
              ...currentTimers,
              [currentPuzzle.id]: { ...currentTimer, startedAtMs: now },
            }
          : currentTimers;
      }

      if (currentTimer.startedAtMs === null) {
        return currentTimers;
      }

      return {
        ...currentTimers,
        [currentPuzzle.id]: {
          elapsedMs: getElapsedMilliseconds(currentTimer, now),
          startedAtMs: null,
        },
      };
    });
  }, [activeView, currentBoardAnalysis?.isSolved, currentPuzzle?.id]);

  useEffect(() => {
    if (activeView !== "play" || !currentPuzzle || currentBoardAnalysis?.isSolved) {
      return;
    }

    const timerInterval = window.setInterval(() => {
      setTimerNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timerInterval);
  }, [activeView, currentBoardAnalysis?.isSolved, currentPuzzle?.id]);

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

    pausePuzzleTimer(puzzle.id);
    setCurrentPuzzleIndex(selectedPuzzle.packIndex);
    setSelectedDifficulty(selectedPuzzle.difficulty);
    setActiveView("play");
  }

  function pausePuzzleTimer(puzzleId: string) {
    const now = Date.now();
    setTimerNow(now);
    setTimerByPuzzleId((currentTimers) => {
      const currentTimer = currentTimers[puzzleId];

      if (!currentTimer || currentTimer.startedAtMs === null) {
        return currentTimers;
      }

      return {
        ...currentTimers,
        [puzzleId]: {
          elapsedMs: getElapsedMilliseconds(currentTimer, now),
          startedAtMs: null,
        },
      };
    });
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
    const currentHistory = getPuzzleHistory(placementHistoryByPuzzleId, puzzle.id);

    if (currentHistory.present.length === 0) {
      return;
    }

    setPlacementHistoryByPuzzleId((currentByPuzzleId) => {
      return pushPuzzleSnapshot(currentByPuzzleId, puzzle.id, EMPTY_PLACEMENT_SNAPSHOT);
    });

    const now = Date.now();
    setTimerNow(now);
    setTimerByPuzzleId((currentTimers) => ({
      ...currentTimers,
      [puzzle.id]: { elapsedMs: 0, startedAtMs: now },
    }));
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
              pausePuzzleTimer(puzzle.id);
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
            elapsedTime={currentElapsedTime}
            isComplete={currentBoardAnalysis?.isSolved ?? false}
          />
          <div aria-hidden="true" data-board-solved={currentBoardAnalysis?.isSolved ?? false} hidden />
        </>
      )}
      <GameTour isOpen={isTourOpen && activeView !== "start"} onClose={handleCloseTour} />
    </main>
  );
}
