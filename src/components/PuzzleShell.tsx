import type { CSSProperties } from "react";

import PuzzleBoard from "@/components/PuzzleBoard";
import PuzzleMeta from "@/components/PuzzleMeta";
import type { PuzzleListItem } from "@/types/puzzle";

interface PuzzleShellProps {
  puzzle: PuzzleListItem;
}

const shellStyle: CSSProperties = {
  position: "relative",
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "clamp(16px, 3vw, 48px)",
  border: "1px solid rgba(49, 61, 64, 0.12)",
  borderRadius: "20px",
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0.2) 100%), rgba(243, 238, 228, 0.84)",
  boxShadow: "0 24px 60px rgba(47, 37, 29, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.45)",
  backdropFilter: "blur(14px)",
};

export function PuzzleShell({ puzzle }: PuzzleShellProps) {
  return (
    <section aria-label={`Puzzle ${puzzle.id} board shell`} style={shellStyle}>
      <div
        style={{
          display: "grid",
          gap: "24px",
        }}
      >
        <header style={{ display: "grid", gap: "16px" }}>
          <div style={{ display: "grid", gap: "8px" }}>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                fontWeight: 600,
                lineHeight: 1.4,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(31, 42, 44, 0.7)",
              }}
            >
              Squares
            </p>
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(24px, 4vw, 28px)",
                fontWeight: 600,
                lineHeight: 1.15,
                color: "#1f2a2c",
              }}
            >
              Starter Pack Board
            </h1>
          </div>
          <PuzzleMeta puzzle={puzzle} />
        </header>

        <PuzzleBoard puzzle={puzzle} />
      </div>
    </section>
  );
}

export default PuzzleShell;
