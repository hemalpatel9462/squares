import PuzzleBoard from "@/components/PuzzleBoard";
import PuzzleMeta from "@/components/PuzzleMeta";
import PuzzleNavigator from "@/components/PuzzleNavigator";
import type { PuzzleListItem } from "@/types/puzzle";

interface PuzzleShellProps {
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  puzzle: PuzzleListItem;
}

export function PuzzleShell({
  canGoNext,
  canGoPrevious,
  onNext,
  onPrevious,
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
          <PuzzleBoard puzzle={puzzle} />
        </div>
      </div>
    </section>
  );
}

export default PuzzleShell;
