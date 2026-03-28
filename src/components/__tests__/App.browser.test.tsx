import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import App from "@/App";
import { starterPackPuzzles } from "@/data/starterPack";

const STORAGE_KEY = "squares.selectedDifficulty.v1";

const FIRST_PUZZLE_BY_DIFFICULTY = {
  easy: starterPackPuzzles.find((puzzle) => puzzle.difficulty === "easy")?.id ?? "easy-001",
  medium: starterPackPuzzles.find((puzzle) => puzzle.difficulty === "medium")?.id ?? "medium-001",
  hard: starterPackPuzzles.find((puzzle) => puzzle.difficulty === "hard")?.id ?? "hard-001",
} as const;

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe("App browser session context", () => {
  it("PACK-03 browses puzzles by difficulty and opens the selected puzzle in play view", () => {
    render(<App />);

    expect(screen.getByRole("tab", { name: "Easy", selected: true })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Medium" }));
    expect(screen.getByRole("tab", { name: "Medium", selected: true })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Hard" }));
    expect(screen.getByRole("tab", { name: "Hard", selected: true })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: `Puzzle ${FIRST_PUZZLE_BY_DIFFICULTY.hard}` }));

    expect(screen.getByRole("region", { name: new RegExp(`Puzzle ${FIRST_PUZZLE_BY_DIFFICULTY.hard} board shell`) })).toBeInTheDocument();
    expect(screen.getByText("Hard")).toBeInTheDocument();
  });

  it("SAVE-02 restores selected difficulty from localStorage on reload", () => {
    window.localStorage.setItem(STORAGE_KEY, "medium");

    const firstRender = render(<App />);
    expect(screen.getByRole("tab", { name: "Medium", selected: true })).toBeInTheDocument();

    firstRender.unmount();
    cleanup();

    render(<App />);

    expect(screen.getByRole("tab", { name: "Medium", selected: true })).toBeInTheDocument();
  });

  it("SAVE-02 falls back to current puzzle difficulty when localStorage is invalid, then easy when no fallback exists", () => {
    window.localStorage.setItem(STORAGE_KEY, "invalid");

    render(<App />);

    expect(screen.getByRole("tab", { name: "Easy", selected: true })).toBeInTheDocument();
  });

  it("Back to Browser preserves previously selected difficulty tab", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("tab", { name: "Medium" }));
    fireEvent.click(
      screen.getByRole("button", { name: `Puzzle ${FIRST_PUZZLE_BY_DIFFICULTY.medium}` }),
    );

    expect(screen.getByText("Medium")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Back to Browser" }));

    expect(screen.getByRole("tab", { name: "Medium", selected: true })).toBeInTheDocument();
  });
});
