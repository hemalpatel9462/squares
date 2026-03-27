import type { PuzzleListItem } from "@/types/puzzle";

interface PuzzleMetaProps {
  puzzle: PuzzleListItem;
}

export function PuzzleMeta({ puzzle }: PuzzleMetaProps) {
  return (
    <div className="meta-strip">
      <span className="meta-pill meta-pill-accent">{`Puzzle ${puzzle.id}`}</span>
      <span className="meta-pill">{puzzle.difficultyLabel}</span>
      <span className="meta-pill">{`Puzzle ${puzzle.packIndex + 1} of ${puzzle.packTotal}`}</span>
    </div>
  );
}

export default PuzzleMeta;
