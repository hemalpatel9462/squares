import { ArrowLeft } from "lucide-react";

import type { Difficulty, PuzzleListItem } from "@/types/puzzle";

interface PuzzleBrowserProps {
  completedPuzzleIds?: ReadonlySet<string>;
  puzzles: PuzzleListItem[];
  selectedDifficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onSelectPuzzle: (selection: { puzzleId: string; difficulty: Difficulty }) => void;
  onStartTour?: () => void;
  onBackToStart?: () => void;
}

const DIFFICULTY_TABS: Array<{ difficulty: Difficulty; label: "Easy" | "Medium" | "Hard" }> = [
  { difficulty: "easy", label: "Easy" },
  { difficulty: "medium", label: "Medium" },
  { difficulty: "hard", label: "Hard" },
];

export function PuzzleBrowser({
  completedPuzzleIds = new Set<string>(),
  puzzles,
  selectedDifficulty,
  onSelectDifficulty,
  onSelectPuzzle,
  onStartTour,
  onBackToStart,
}: PuzzleBrowserProps) {
  const panelId = "puzzle-browser-panel";

  const visiblePuzzles = puzzles
    .filter((puzzle) => puzzle.difficulty === selectedDifficulty)
    .sort((first, second) => first.packIndex - second.packIndex);

  return (
    <section className="puzzle-browser" aria-label="Puzzle browser">
      <header className="puzzle-browser__header">
        <p className="eyebrow">Starter Pack</p>
        <div className="puzzle-browser__title-row">
          <div className="puzzle-browser__title-heading">
            {onBackToStart ? (
              <button
                aria-label="Back to start screen"
                className="puzzle-browser__back-button"
                onClick={onBackToStart}
                title="Back to start screen"
                type="button"
              >
                <ArrowLeft aria-hidden="true" className="icon" />
              </button>
            ) : null}
            <h1 className="puzzle-shell__title">Choose a Puzzle</h1>
          </div>
          {onStartTour ? (
            <button className="puzzle-browser__tour-button" onClick={onStartTour} type="button">
              How to Play
            </button>
          ) : null}
        </div>
      </header>

      <div className="puzzle-browser__tabs" role="tablist" aria-label="Browse by difficulty">
        {DIFFICULTY_TABS.map(({ difficulty, label }) => {
          const isSelected = selectedDifficulty === difficulty;

          return (
            <button
              aria-controls={panelId}
              aria-selected={isSelected}
              className="puzzle-browser__tab"
              data-selected={isSelected ? "true" : "false"}
              id={`puzzle-browser-tab-${difficulty}`}
              key={difficulty}
              onClick={() => onSelectDifficulty(difficulty)}
              role="tab"
              tabIndex={isSelected ? 0 : -1}
              type="button"
            >
              {label}
            </button>
          );
        })}
      </div>

      <div
        aria-labelledby={`puzzle-browser-tab-${selectedDifficulty}`}
        className="puzzle-browser__list"
        id={panelId}
        role="tabpanel"
      >
        {visiblePuzzles.map((puzzle, index) => {
          const puzzleNumber = index + 1;
          const isCompleted = completedPuzzleIds.has(puzzle.id);

          return (
            <button
              aria-label={`${puzzle.difficultyLabel} puzzle ${puzzleNumber}${isCompleted ? ", completed" : ""}`}
              className="puzzle-browser__puzzle-button"
              data-completed={isCompleted ? "true" : "false"}
              key={puzzle.id}
              onClick={() =>
                onSelectPuzzle({ puzzleId: puzzle.id, difficulty: selectedDifficulty })
              }
              type="button"
            >
              {puzzleNumber}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default PuzzleBrowser;
