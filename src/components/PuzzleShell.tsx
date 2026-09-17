import { RotateCcw, Undo2 } from "lucide-react";

import PuzzleBoard from "@/components/PuzzleBoard";
import PuzzleMeta from "@/components/PuzzleMeta";
import PuzzleNavigator from "@/components/PuzzleNavigator";
import type { PuzzleListItem } from "@/types/puzzle";
import type { CandidatePlacement } from "@/types/rules";

interface PuzzleShellProps {
  canUndo?: boolean;
  canGoNext: boolean;
  onBackToBrowser?: () => void;
  onNext: () => void;
  onReplay?: () => void;
  isComplete?: boolean;
  onUndo?: () => void;
  onReset?: () => void;
  puzzle: PuzzleListItem;
  placedRectangles?: CandidatePlacement[];
  onPlaceRectangle?: (placement: CandidatePlacement) => void;
  onRemoveRectangle?: (rectangleIndex: number) => void;
  elapsedTime: string;
}

export function PuzzleShell({
  canUndo = false,
  canGoNext,
  onBackToBrowser,
  onNext,
  onReset,
  onUndo,
  onPlaceRectangle,
  onRemoveRectangle,
  onReplay,
  placedRectangles,
  puzzle,
  elapsedTime,
  isComplete = false,
}: PuzzleShellProps) {
  return (
    <section aria-label="Squares puzzle" className="puzzle-shell">
      <div className="puzzle-stage">
        <header className="top-bar">
          <PuzzleNavigator onBackToBrowser={onBackToBrowser} />
          <PuzzleMeta elapsedTime={elapsedTime} puzzle={puzzle} />
          <div aria-label="Puzzle actions" className="puzzle-corrections" role="group">
            <button
              aria-label="Undo last placement"
              className="puzzle-corrections__button"
              disabled={!canUndo}
              title="Undo last placement"
              onClick={onUndo}
              type="button"
            >
              <Undo2 aria-hidden="true" className="icon" />
            </button>
            <button
              aria-label="Reset puzzle"
              className="puzzle-corrections__button"
              onClick={onReset}
              title="Reset puzzle"
              type="button"
            >
              <RotateCcw aria-hidden="true" className="icon" />
            </button>
          </div>
        </header>

        <main className="game-area">
          <div className="puzzle-shell__board">
          {isComplete ? (
            <div className="completion-modal" role="presentation">
              <div
                aria-modal="true"
                aria-label="Puzzle complete"
                className="completion-panel"
                role="dialog"
              >
                <p className="eyebrow">Completed</p>
                <p className="completion-panel__meta">
                  {`${puzzle.difficultyLabel} · Puzzle ${puzzle.packIndex + 1} of ${puzzle.packTotal}`}
                </p>
                <p aria-label={`Completion time: ${elapsedTime}`} className="completion-panel__time">
                  <span>Time</span>
                  <strong>{elapsedTime}</strong>
                </p>
                <h2 className="completion-panel__title" id="completion-modal-title">
                  Puzzle solved!
                </h2>
                <p className="hero-copy">Every square is covered by a valid rectangle.</p>
                <div className="completion-panel__actions">
                  <button className="completion-button" onClick={onReplay} type="button">
                    Replay
                  </button>
                  <button
                    className="completion-button completion-button--primary"
                    disabled={!canGoNext}
                    onClick={onNext}
                    type="button"
                  >
                    Next Puzzle
                  </button>
                  {onBackToBrowser ? (
                    <button
                      className="completion-button"
                      onClick={onBackToBrowser}
                      type="button"
                    >
                      Choose Puzzle
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
          <PuzzleBoard
            onPlaceRectangle={onPlaceRectangle}
            onRemoveRectangle={onRemoveRectangle}
            placedRectangles={placedRectangles}
            puzzle={puzzle}
          />
          </div>
        </main>
      </div>
    </section>
  );
}

export default PuzzleShell;
