interface PuzzleNavigatorProps {
  canGoPrevious: boolean;
  canGoNext: boolean;
  onBackToBrowser?: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function PuzzleNavigator({
  canGoNext,
  canGoPrevious,
  onBackToBrowser,
  onNext,
  onPrevious,
}: PuzzleNavigatorProps) {
  return (
    <nav aria-label="Puzzle navigation" className="puzzle-navigator">
      {onBackToBrowser ? (
        <button
          className="puzzle-navigator__button"
          onClick={onBackToBrowser}
          type="button"
        >
          Back to Browser
        </button>
      ) : null}
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
