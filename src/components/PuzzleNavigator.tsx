import { ArrowLeft } from "lucide-react";

interface PuzzleNavigatorProps {
  onBackToBrowser?: () => void;
}

export function PuzzleNavigator({
  onBackToBrowser,
}: PuzzleNavigatorProps) {
  return (
    <nav aria-label="Puzzle navigation" className="puzzle-navigator">
      {onBackToBrowser ? (
        <button
          className="puzzle-navigator__button"
          aria-label="Back to Browser"
          title="Back to Browser"
          onClick={onBackToBrowser}
          type="button"
        >
          <ArrowLeft aria-hidden="true" className="icon" />
        </button>
      ) : null}
    </nav>
  );
}

export default PuzzleNavigator;
