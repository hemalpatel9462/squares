import type { PuzzleListItem } from "@/types/puzzle";

interface PuzzleMetaProps {
  puzzle: PuzzleListItem;
}

export function PuzzleMeta({ puzzle }: PuzzleMetaProps) {
  return (
    <div aria-label="Puzzle details" className="meta-strip">
      <span className="meta-pill meta-pill-accent">{puzzle.difficultyLabel}</span>
      <span
        aria-label={`Puzzle progress: ${puzzle.packIndex + 1} of ${puzzle.packTotal}`}
        className="meta-pill"
      >
        {`${puzzle.packIndex + 1} of ${puzzle.packTotal}`}
      </span>
    </div>
  );
}

export default PuzzleMeta;
