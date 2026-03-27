import type { CSSProperties } from "react";

import type { PuzzleListItem } from "@/types/puzzle";

interface PuzzleMetaProps {
  puzzle: PuzzleListItem;
}

const metaRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
};

const pillStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: "44px",
  padding: "10px 14px",
  border: "1px solid rgba(49, 61, 64, 0.08)",
  borderRadius: "12px",
  background: "rgba(217, 224, 220, 0.8)",
  fontSize: "14px",
  fontWeight: 600,
  lineHeight: 1.4,
};

export function PuzzleMeta({ puzzle }: PuzzleMetaProps) {
  return (
    <div style={metaRowStyle}>
      <span style={{ ...pillStyle, background: "rgba(197, 109, 61, 0.18)", color: "#8d4725" }}>
        {`Puzzle ${puzzle.id}`}
      </span>
      <span style={pillStyle}>{puzzle.difficultyLabel}</span>
      <span style={pillStyle}>{`Puzzle ${puzzle.packIndex + 1} of ${puzzle.packTotal}`}</span>
    </div>
  );
}

export default PuzzleMeta;
