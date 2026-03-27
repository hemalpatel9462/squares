import type { CSSProperties } from "react";

import type { PuzzleListItem } from "@/types/puzzle";

interface PuzzleBoardProps {
  puzzle: PuzzleListItem;
}

const boardFrameStyle: CSSProperties = {
  border: "1px solid rgba(49, 61, 64, 0.08)",
  borderRadius: "16px",
  background: "rgba(255, 255, 255, 0.46)",
  padding: "clamp(12px, 2vw, 20px)",
};

const boardStyle: CSSProperties = {
  width: "min(72vh, 640px)",
  maxWidth: "100%",
  aspectRatio: "1",
};

const cellBaseStyle: CSSProperties = {
  display: "grid",
  placeItems: "center",
  aspectRatio: "1",
  minHeight: "40px",
  border: "1px solid rgba(49, 61, 64, 0.08)",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: 600,
  lineHeight: 1.4,
};

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
    <div style={boardFrameStyle}>
      <div
        aria-label={`Read-only ${puzzle.size} by ${puzzle.size} puzzle board`}
        role="img"
        style={{
          ...boardStyle,
          display: "grid",
          gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))`,
          gap: "8px",
        }}
      >
        {cells.map((cell) => {
          const isClue = cell.clueValue !== undefined;

          return (
            <div
              key={`${cell.row}-${cell.col}`}
              data-cell-kind={isClue ? "clue" : "empty"}
              data-col={cell.col}
              data-row={cell.row}
              style={{
                ...cellBaseStyle,
                background: isClue ? "rgba(217, 224, 220, 0.92)" : "#f3eee4",
                color: isClue ? "#1f2a2c" : "rgba(31, 42, 44, 0.35)",
              }}
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
