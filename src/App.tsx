import { useState } from "react";

import PuzzleShell from "@/components/PuzzleShell";
import { getPuzzleByIndex } from "@/data/starterPack";

export default function App() {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const currentPuzzle = getPuzzleByIndex(currentPuzzleIndex);

  if (!currentPuzzle) {
    return (
      <main className="app-shell">
        <section
          aria-label="Starter pack unavailable"
          className="hero-panel"
          style={{ display: "grid", gap: "16px" }}
        >
          <p className="eyebrow">Squares</p>
          <h1>Starter Pack Unavailable</h1>
          <p className="hero-copy">
            No starter-pack puzzles are available yet. Reload the app or restore the bundled
            puzzle file to continue.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <div aria-hidden="true" className="ambient-glow ambient-glow-left" />
      <div aria-hidden="true" className="ambient-glow ambient-glow-right" />
      <PuzzleShell
        canGoNext={getPuzzleByIndex(currentPuzzleIndex + 1) !== undefined}
        canGoPrevious={currentPuzzleIndex > 0}
        onNext={() => {
          setCurrentPuzzleIndex((index) => index + 1);
        }}
        onPrevious={() => {
          setCurrentPuzzleIndex((index) => index - 1);
        }}
        puzzle={currentPuzzle}
      />
    </main>
  );
}
