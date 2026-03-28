import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";

import App from "@/App";
import { getPuzzleByIndex } from "@/data/starterPack";
import type { CellCoord, RectangleBounds } from "@/types/rules";

import { mockBoardGeometry } from "./testGeometry";

afterEach(() => {
  cleanup();
});

function getPlacementTarget() {
  const puzzle = getPuzzleByIndex(0);

  if (!puzzle) {
    throw new Error("Starter-pack puzzle 0 is unavailable");
  }

  return {
    puzzle,
    origin: { row: 0, col: 0 } satisfies CellCoord,
    rectangle: {
      row: 0,
      col: 0,
      width: 2,
      height: 2,
    } satisfies RectangleBounds,
    target: {
      row: 1,
      col: 1,
    } satisfies CellCoord,
  };
}

function placeFirstRectangle() {
  const { puzzle, origin, rectangle, target } = getPlacementTarget();
  const board = screen.getByRole("img", { name: new RegExp(`${puzzle.size} by ${puzzle.size} puzzle board`, "i") });
  const originCell = board.querySelector(`[data-row='${origin.row}'][data-col='${origin.col}'][data-cell-kind='clue']`);
  const targetCell = board.querySelector(`[data-row='${target.row}'][data-col='${target.col}']`);

  expect(originCell).not.toBeNull();
  expect(targetCell).not.toBeNull();

  const geometry = mockBoardGeometry(board, puzzle.size);
  const start = geometry.cellCenter(origin);
  const end = geometry.cellCenter(target);

  fireEvent.pointerDown(originCell!, {
    pointerId: 1,
    pointerType: "mouse",
    clientX: start.clientX,
    clientY: start.clientY,
  });

  fireEvent.pointerMove(targetCell!, {
    pointerId: 1,
    pointerType: "mouse",
    clientX: end.clientX,
    clientY: end.clientY,
  });

  fireEvent.pointerUp(targetCell!, {
    pointerId: 1,
    pointerType: "mouse",
    clientX: end.clientX,
    clientY: end.clientY,
  });

  geometry.restore();

  return { rectangle };
}

describe("App placement persistence", () => {
  test("removes the empty-state prompt after the first valid placement", () => {
    render(<App />);

    expect(screen.getByLabelText("Placement prompt")).toBeInTheDocument();

    const { rectangle } = placeFirstRectangle();

    expect(screen.queryByLabelText("Placement prompt")).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: /4 by 4 puzzle board/i }).querySelectorAll("[data-placed-cell='true']")).toHaveLength(rectangle.width * rectangle.height);
  });

  test("clears visible placements when navigating to a different puzzle", () => {
    render(<App />);

    placeFirstRectangle();

    const board = screen.getByRole("img", { name: /4 by 4 puzzle board/i });

    expect(board.querySelector("[data-placed-cell='true']")).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Next Puzzle" }));

    const nextBoard = screen.getByRole("img", { name: /4 by 4 puzzle board/i });

    expect(nextBoard.querySelector("[data-placed-cell='true']")).toBeNull();
    expect(screen.getByLabelText("Placement prompt")).toBeInTheDocument();
  });

  test("restores saved placements when returning to a puzzle", () => {
    render(<App />);

    const { rectangle } = placeFirstRectangle();

    fireEvent.click(screen.getByRole("button", { name: "Next Puzzle" }));

    const nextBoard = screen.getByRole("img", { name: /4 by 4 puzzle board/i });
    expect(nextBoard.querySelector("[data-placed-cell='true']")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Previous" }));

    const restoredBoard = screen.getByRole("img", { name: /4 by 4 puzzle board/i });

    expect(restoredBoard.querySelectorAll("[data-placed-cell='true']")).toHaveLength(
      rectangle.width * rectangle.height,
    );
    expect(restoredBoard.querySelector("[data-placed-rectangle='0']")).not.toBeNull();
    expect(screen.queryByLabelText("Placement prompt")).not.toBeInTheDocument();
  });
});
