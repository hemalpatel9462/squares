import type { PuzzleListItem } from "@/types/puzzle";

interface PuzzleBoardProps {
  puzzle: PuzzleListItem;
}

export function PuzzleBoard({ puzzle }: PuzzleBoardProps) {
  const clueMap = new Map(
    puzzle.clues.map((clue) => [`${clue.row}:${clue.col}`, clue.value] as const),
  );

  const cells = Array.from({ length: puzzle.size * puzzle.size }, (_, index) => {
    const row = Math.floor(index / puzzle.size);
    const col = index % puzzle.size;
    const clueValue = clueMap.get(`${row}:${col}`);

    return {
      row,
      col,
      clueValue,
    };
  });

  return (
    <div className="board-card">
      <div
        aria-label={`Read-only ${puzzle.size} by ${puzzle.size} puzzle board`}
        role="img"
        className="board-grid"
        style={{ gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))` }}
      >
        {cells.map((cell) => {
          const isClue = cell.clueValue !== undefined;

          return (
            <div
              key={`${cell.row}-${cell.col}`}
              className={`board-cell${isClue ? " board-cell-clue" : ""}`}
              data-cell-kind={isClue ? "clue" : "empty"}
              data-col={cell.col}
              data-row={cell.row}
            >
              {isClue ? cell.clueValue : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PuzzleBoard;
