import PuzzleBoard from "@/components/PuzzleBoard";
import PuzzleMeta from "@/components/PuzzleMeta";
import PuzzleNavigator from "@/components/PuzzleNavigator";
import type { PuzzleListItem } from "@/types/puzzle";
import type { CandidatePlacement } from "@/types/rules";

interface PuzzleShellProps {
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  puzzle: PuzzleListItem;
  placedRectangles?: CandidatePlacement[];
  onPlaceRectangle?: (placement: CandidatePlacement) => void;
  emptyPlacementPrompt?: {
    heading: string;
    body: string;
  } | null;
}

export function PuzzleShell({
  canGoNext,
  canGoPrevious,
  emptyPlacementPrompt,
  onNext,
  onPrevious,
  onPlaceRectangle,
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
            placedRectangles={placedRectangles}
            puzzle={puzzle}
          />
        </div>
      </div>
    </section>
  );
}

export default PuzzleShell;
