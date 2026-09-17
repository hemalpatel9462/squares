import { Clock3 } from "lucide-react";

import type { PuzzleListItem } from "@/types/puzzle";

interface PuzzleMetaProps {
  elapsedTime: string;
  puzzle: PuzzleListItem;
}

export function PuzzleMeta({ elapsedTime, puzzle }: PuzzleMetaProps) {
  return (
    <div aria-label="Puzzle details" className="meta-strip">
      <span className="meta-pill meta-pill-accent">{puzzle.difficultyLabel}</span>
      <span
        aria-label={`Puzzle progress: ${puzzle.packIndex + 1} of ${puzzle.packTotal}`}
        className="meta-pill"
      >
        {`${puzzle.packIndex + 1} of ${puzzle.packTotal}`}
      </span>
      <span
        aria-label={`Elapsed time: ${elapsedTime}`}
        className="meta-pill meta-pill-timer"
        title="Elapsed time"
      >
        <Clock3 aria-hidden="true" className="icon" />
        <span>{elapsedTime}</span>
      </span>
    </div>
  );
}

export default PuzzleMeta;
