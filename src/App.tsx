import PuzzleShell from "@/components/PuzzleShell";
import { getPuzzleByIndex } from "@/data/starterPack";

const initialPuzzle = getPuzzleByIndex(0);

export default function App() {
  if (!initialPuzzle) {
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
      <PuzzleShell puzzle={initialPuzzle} />
    </main>
  );
}
