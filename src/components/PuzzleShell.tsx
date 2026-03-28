import PuzzleBoard from "@/components/PuzzleBoard";
import PuzzleMeta from "@/components/PuzzleMeta";
import PuzzleNavigator from "@/components/PuzzleNavigator";
import type { PuzzleListItem } from "@/types/puzzle";
import type { CandidatePlacement } from "@/types/rules";

interface PuzzleShellProps {
  canUndo?: boolean;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onUndo?: () => void;
  onReset?: () => void;
  puzzle: PuzzleListItem;
  placedRectangles?: CandidatePlacement[];
  onPlaceRectangle?: (placement: CandidatePlacement) => void;
  onRemoveRectangle?: (rectangleIndex: number) => void;
  emptyPlacementPrompt?: {
    heading: string;
    body: string;
  } | null;
}

export function PuzzleShell({
  canUndo = false,
  canGoNext,
  canGoPrevious,
  emptyPlacementPrompt,
  onNext,
  onPrevious,
  onReset,
  onUndo,
  onPlaceRectangle,
  onRemoveRectangle,
  placedRectangles,
  puzzle,
}: PuzzleShellProps) {
  return (
    <section aria-label={`Puzzle ${puzzle.id} board shell`} className="puzzle-shell">
      <div className="puzzle-shell__content">
        <header className="puzzle-shell__header">
          <div className="puzzle-shell__intro">
            <p className="eyebrow">Squares</p>
            <h1 className="puzzle-shell__title">Starter Pack Board</h1>
          </div>
          <PuzzleMeta puzzle={puzzle} />
          <PuzzleNavigator
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
            onNext={onNext}
            onPrevious={onPrevious}
          />
        </header>

        <div className="puzzle-shell__board">
          <div className="puzzle-corrections" role="group" aria-label="Puzzle corrections">
            <button
              className="puzzle-corrections__button"
              disabled={!canUndo}
              onClick={onUndo}
              type="button"
            >
              Undo
            </button>
            <button className="puzzle-corrections__button" onClick={onReset} type="button">
              Reset
            </button>
          </div>
          {emptyPlacementPrompt ? (
            <div
              aria-label="Placement prompt"
              className="hero-panel"
              style={{ marginBottom: "16px", padding: "16px" }}
            >
              <h2
                className="puzzle-shell__title"
                style={{ fontSize: "20px", marginBottom: "8px" }}
              >
                {emptyPlacementPrompt.heading}
              </h2>
              <p className="hero-copy">{emptyPlacementPrompt.body}</p>
            </div>
          ) : null}
          <PuzzleBoard
            onPlaceRectangle={onPlaceRectangle}
            onRemoveRectangle={onRemoveRectangle}
            placedRectangles={placedRectangles}
            puzzle={puzzle}
          />
        </div>
      </div>
    </section>
  );
}

export default PuzzleShell;
