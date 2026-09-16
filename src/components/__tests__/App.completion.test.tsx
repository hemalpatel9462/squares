import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import App from "@/App";
import { getPuzzleByIndex } from "@/data/starterPack";
import { findOriginForSolutionRectangle } from "@/rules/__tests__/ruleTestUtils";

import { mockBoardGeometry } from "./testGeometry";

const COMPLETED_PUZZLES_STORAGE_KEY = "squares.completedPuzzleIds.v1";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

function openFirstPuzzle() {
  fireEvent.click(screen.getByRole("tab", { name: "Easy" }));
  fireEvent.click(screen.getByRole("button", { name: "Puzzle easy-001" }));
}

function solveFirstPuzzle() {
  const puzzle = getPuzzleByIndex(0);

  if (!puzzle) {
    throw new Error("Starter-pack puzzle 0 is unavailable");
  }

  for (const [index, solutionRectangle] of puzzle.solution.entries()) {
    const board = screen.getByRole("img", {
      name: new RegExp(`${puzzle.size} by ${puzzle.size} puzzle board`, "i"),
    });
    const origin = findOriginForSolutionRectangle(puzzle.clues, solutionRectangle);
    const bottomRow = solutionRectangle.row + solutionRectangle.height - 1;
    const rightCol = solutionRectangle.col + solutionRectangle.width - 1;
    const target = {
      row: origin.row === solutionRectangle.row ? bottomRow : solutionRectangle.row,
      col: origin.col === solutionRectangle.col ? rightCol : solutionRectangle.col,
    };
    const originCell = board.querySelector(
      `[data-row='${origin.row}'][data-col='${origin.col}'][data-cell-kind='clue']`,
    );
    const targetCell = board.querySelector(`[data-row='${target.row}'][data-col='${target.col}']`);

    expect(originCell).not.toBeNull();
    expect(targetCell).not.toBeNull();

    const geometry = mockBoardGeometry(board, puzzle.size);
    const start = geometry.cellCenter(origin);
    const end = geometry.cellCenter(target);

    fireEvent.pointerDown(originCell!, {
      pointerId: index + 1,
      pointerType: "mouse",
      clientX: start.clientX,
      clientY: start.clientY,
    });
    fireEvent.pointerMove(targetCell!, {
      pointerId: index + 1,
      pointerType: "mouse",
      clientX: end.clientX,
      clientY: end.clientY,
    });
    fireEvent.pointerUp(targetCell!, {
      pointerId: index + 1,
      pointerType: "mouse",
      clientX: end.clientX,
      clientY: end.clientY,
    });
    geometry.restore();
  }
}

describe("App completion flow", () => {
  it("PACK-04/PACK-05 marks a solved puzzle complete with replay and next actions", () => {
    render(<App />);
    openFirstPuzzle();
    solveFirstPuzzle();

    const completion = screen.getByRole("dialog", { name: "Puzzle complete" });
    const completionQueries = within(completion);
    expect(completion).toHaveTextContent("Puzzle solved!");
    expect(completion).toHaveTextContent("Every square is covered by a valid rectangle.");
    expect(completionQueries.getByRole("button", { name: "Replay" })).toBeInTheDocument();
    expect(completionQueries.getByRole("button", { name: "Next Puzzle" })).toBeEnabled();
    expect(JSON.parse(window.localStorage.getItem(COMPLETED_PUZZLES_STORAGE_KEY) ?? "[]"))
      .toContain("easy-001");
  });

  it("SAVE-01 restores completed puzzle ids and shows completion in the browser", () => {
    window.localStorage.setItem(COMPLETED_PUZZLES_STORAGE_KEY, JSON.stringify(["easy-001"]));

    render(<App />);

    const puzzleButton = screen.getByRole("button", { name: "Puzzle easy-001" });
    expect(puzzleButton).toHaveAttribute("data-completed", "true");
    expect(puzzleButton).toHaveTextContent("Completed");
  });

  it("replays the current puzzle and advances from the completion panel", () => {
    render(<App />);
    openFirstPuzzle();
    solveFirstPuzzle();

    const completion = screen.getByRole("dialog", { name: "Puzzle complete" });
    fireEvent.click(within(completion).getByRole("button", { name: "Replay" }));

    expect(screen.queryByRole("dialog", { name: "Puzzle complete" })).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: /4 by 4 puzzle board/i })).toBeInTheDocument();

    solveFirstPuzzle();
    fireEvent.click(
      within(screen.getByRole("dialog", { name: "Puzzle complete" })).getByRole("button", {
        name: "Next Puzzle",
      }),
    );

    expect(screen.getByText("Puzzle easy-002")).toBeInTheDocument();
  });
});
