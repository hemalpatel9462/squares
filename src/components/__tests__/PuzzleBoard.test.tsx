import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import App from "@/App";
import PuzzleBoard from "@/components/PuzzleBoard";
import { getPuzzleByIndex } from "@/data/starterPack";

const boardSizes = [4, 6, 8] as const;

describe("PuzzleBoard", () => {
  it.each(boardSizes)("renders the correct number of cells for %ix%i puzzles", (size) => {
    const puzzle = getPuzzleByIndex(
      size === 4 ? 0 : size === 6 ? 16 : 32,
    );

    expect(puzzle).toBeDefined();

    const { container } = render(<PuzzleBoard puzzle={puzzle!} />);
    const cells = container.querySelectorAll("[data-cell-kind]");

    expect(cells).toHaveLength(size * size);
  });

  it("renders clue values in clue cells and leaves empty cells text-empty", () => {
    const puzzle = getPuzzleByIndex(0);

    expect(puzzle).toBeDefined();

    const { container } = render(<PuzzleBoard puzzle={puzzle!} />);

    const clueCell = container.querySelector("[data-row='0'][data-col='0']");
    const emptyCell = container.querySelector("[data-row='0'][data-col='1']");

    expect(clueCell).toHaveAttribute("data-row", "0");
    expect(clueCell).toHaveAttribute("data-col", "0");
    expect(clueCell).toHaveAttribute("data-cell-kind", "clue");
    expect(clueCell).toHaveTextContent("4");
    expect(emptyCell).toHaveAttribute("data-cell-kind", "empty");
    expect(emptyCell).toBeEmptyDOMElement();
  });
});

describe("App", () => {
  it("loads the first starter-pack puzzle into the integrated puzzle shell", () => {
    render(<App />);

    expect(screen.getByRole("region", { name: /puzzle easy-001 board shell/i })).toBeInTheDocument();
    expect(screen.getByText("Puzzle easy-001")).toBeInTheDocument();
    expect(screen.getByText("Easy")).toBeInTheDocument();
    expect(screen.getByText("Puzzle 1 of 40")).toBeInTheDocument();

    const board = screen.getAllByRole("img", { name: /read-only 4 by 4 puzzle board/i }).at(-1);
    expect(board).toBeDefined();

    if (!board) {
      throw new Error("Expected the app board to render");
    }

    const boardCells = board.querySelectorAll("[data-cell-kind]");

    expect(boardCells).toHaveLength(16);
  });
});
