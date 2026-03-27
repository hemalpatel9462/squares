const placeholderCells = Array.from({ length: 25 }, (_, index) => {
  const clueMap = new Map([
    [0, "4"],
    [8, "6"],
    [12, "3"],
    [18, "5"],
  ]);

  return {
    id: index,
    value: clueMap.get(index) ?? null,
  };
});

export default function App() {
  return (
    <main className="app-shell">
      <div className="ambient-glow ambient-glow-left" aria-hidden="true" />
      <div className="ambient-glow ambient-glow-right" aria-hidden="true" />

      <section className="hero-panel" aria-label="Squares starter pack preview">
        <header className="hero-header">
          <div>
            <p className="eyebrow">Squares</p>
            <h1>Starter Pack Board Shell</h1>
            <p className="hero-copy">
              Phase 1 establishes a read-only puzzle stage, starter-pack data
              contracts, and a verified test harness before gameplay logic
              exists.
            </p>
          </div>

          <div className="meta-strip" aria-label="Puzzle metadata preview">
            <span className="meta-pill meta-pill-accent">Puzzle easy-001</span>
            <span className="meta-pill">Easy</span>
            <span className="meta-pill">Puzzle 1 of 40</span>
          </div>
        </header>

        <div className="hero-body">
          <section className="board-card" aria-label="Read-only puzzle board preview">
            <div className="board-frame">
              <div className="board-grid" role="img" aria-label="Read-only 5 by 5 puzzle preview">
                {placeholderCells.map((cell) => (
                  <div
                    key={cell.id}
                    className={`board-cell${cell.value ? " board-cell-clue" : ""}`}
                  >
                    {cell.value ? <span>{cell.value}</span> : null}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="status-panel" aria-label="Current phase boundaries">
            <h2>Wave 0 baseline</h2>
            <ul>
              <li>React, TypeScript, and Vitest boot cleanly from the repo root.</li>
              <li>The shell is intentionally static: no placement, validation, or drag state.</li>
              <li>Shared puzzle contracts land next so later plans reuse one shape.</li>
            </ul>
          </aside>
        </div>
      </section>
    </main>
  );
}
