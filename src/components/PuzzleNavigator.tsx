interface PuzzleNavigatorProps {
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function PuzzleNavigator({
  canGoNext,
  canGoPrevious,
  onNext,
  onPrevious,
}: PuzzleNavigatorProps) {
  return (
    <nav aria-label="Puzzle navigation" className="puzzle-navigator">
      <button
        className="puzzle-navigator__button"
        disabled={!canGoPrevious}
        onClick={onPrevious}
        type="button"
      >
        Previous
      </button>
      <button
        className="puzzle-navigator__button puzzle-navigator__button--primary"
        disabled={!canGoNext}
        onClick={onNext}
        type="button"
      >
        Next Puzzle
      </button>
    </nav>
  );
}

export default PuzzleNavigator;
