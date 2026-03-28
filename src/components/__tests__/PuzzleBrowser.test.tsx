import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { starterPackPuzzles } from "@/data/starterPack";
import type { Difficulty } from "@/types/puzzle";
import { PuzzleBrowser } from "@/components/PuzzleBrowser";

const ORDERED_IDS: Record<Difficulty, string[]> = {
  easy: starterPackPuzzles
    .filter((puzzle) => puzzle.difficulty === "easy")
    .sort((first, second) => first.packIndex - second.packIndex)
    .map((puzzle) => puzzle.id),
  medium: starterPackPuzzles
    .filter((puzzle) => puzzle.difficulty === "medium")
    .sort((first, second) => first.packIndex - second.packIndex)
    .map((puzzle) => puzzle.id),
  hard: starterPackPuzzles
    .filter((puzzle) => puzzle.difficulty === "hard")
    .sort((first, second) => first.packIndex - second.packIndex)
    .map((puzzle) => puzzle.id),
};

function expectOnlyDifficultyVisible(activeDifficulty: Difficulty): void {
  const visibleIds = new Set(ORDERED_IDS[activeDifficulty]);

  for (const puzzleId of starterPackPuzzles.map((puzzle) => puzzle.id)) {
    const button = screen.queryByRole("button", { name: `Puzzle ${puzzleId}` });

    if (visibleIds.has(puzzleId)) {
      expect(button).toBeInTheDocument();
    } else {
      expect(button).not.toBeInTheDocument();
    }
  }
}

afterEach(() => {
  cleanup();
});

describe("PuzzleBrowser", () => {
  it("defaults to the easy tab and renders only easy puzzle buttons", () => {
    render(
      <PuzzleBrowser
        puzzles={starterPackPuzzles}
        selectedDifficulty="easy"
        onSelectDifficulty={vi.fn()}
        onSelectPuzzle={vi.fn()}
      />,
    );

    expect(screen.getByRole("tablist", { name: "Browse by difficulty" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Easy" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Medium" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
    expect(screen.getByRole("tab", { name: "Hard" })).toHaveAttribute("aria-selected", "false");
    expectOnlyDifficultyVisible("easy");
  });

  it("switches to medium and renders only medium puzzle buttons", () => {
    const onSelectPuzzle = vi.fn();

    function TestHarness() {
      const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("easy");

      return (
        <PuzzleBrowser
          puzzles={starterPackPuzzles}
          selectedDifficulty={selectedDifficulty}
          onSelectDifficulty={setSelectedDifficulty}
          onSelectPuzzle={onSelectPuzzle}
        />
      );
    }

    render(<TestHarness />);

    fireEvent.click(screen.getByRole("tab", { name: "Medium" }));

    expect(screen.getByRole("tab", { name: "Easy" })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tab", { name: "Medium" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expectOnlyDifficultyVisible("medium");
  });

  it("sends puzzle id and difficulty when a puzzle button is selected", () => {
    const onSelectPuzzle = vi.fn();

    render(
      <PuzzleBrowser
        puzzles={starterPackPuzzles}
        selectedDifficulty="hard"
        onSelectDifficulty={vi.fn()}
        onSelectPuzzle={onSelectPuzzle}
      />,
    );

    const selectedPuzzleId = ORDERED_IDS.hard[0];
    fireEvent.click(screen.getByRole("button", { name: `Puzzle ${selectedPuzzleId}` }));

    expect(onSelectPuzzle).toHaveBeenCalledWith({
      puzzleId: selectedPuzzleId,
      difficulty: "hard",
    });
  });
});
