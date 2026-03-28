import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import App from "@/App";
import { getPuzzleByIndex } from "@/data/starterPack";
import type { CellCoord, RectangleBounds } from "@/types/rules";

import { mockBoardGeometry } from "./testGeometry";

afterEach(() => {
  vi.restoreAllMocks();
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

function placeRectangle(origin: CellCoord, target: CellCoord, pointerId = 1) {
  const puzzle = getPuzzleByIndex(0);

  if (!puzzle) {
    throw new Error("Starter-pack puzzle 0 is unavailable");
  }

  const board = screen.getByRole("img", { name: new RegExp(`${puzzle.size} by ${puzzle.size} puzzle board`, "i") });
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
    pointerId,
    pointerType: "mouse",
    clientX: start.clientX,
    clientY: start.clientY,
  });

  fireEvent.pointerMove(targetCell!, {
    pointerId,
    pointerType: "mouse",
    clientX: end.clientX,
    clientY: end.clientY,
  });

  fireEvent.pointerUp(targetCell!, {
    pointerId,
    pointerType: "mouse",
    clientX: end.clientX,
    clientY: end.clientY,
  });

  geometry.restore();
}

function placeFirstRectangle() {
  const { origin, rectangle, target } = getPlacementTarget();

  placeRectangle(origin, target, 1);
  return { rectangle };
}

describe("App placement persistence", () => {
  test("remove click clears a placed rectangle and undo restores it", () => {
    render(<App />);

    const { rectangle } = placeFirstRectangle();
    const board = screen.getByRole("img", { name: /4 by 4 puzzle board/i });
    const placedCell = board.querySelector("[data-row='0'][data-col='0'][data-placed-rectangle='0']");

    expect(placedCell).not.toBeNull();

    fireEvent.pointerDown(placedCell!, {
      pointerId: 5,
      pointerType: "mouse",
      clientX: 10,
      clientY: 10,
    });
    fireEvent.pointerUp(placedCell!, {
      pointerId: 5,
      pointerType: "mouse",
      clientX: 10,
      clientY: 10,
    });

    expect(board.querySelector("[data-placed-cell='true']")).toBeNull();
    expect(screen.getByLabelText("Placement prompt")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Undo" }));

    expect(board.querySelectorAll("[data-placed-cell='true']")).toHaveLength(
      rectangle.width * rectangle.height,
    );
    expect(board.querySelector("[data-placed-rectangle='0']")).not.toBeNull();
  });

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

  test("undo supports multi-step rollback in order", () => {
    render(<App />);

    const { rectangle } = placeFirstRectangle();
    placeRectangle({ row: 1, col: 3 }, { row: 0, col: 2 }, 2);

    const board = screen.getByRole("img", { name: /4 by 4 puzzle board/i });
    expect(board.querySelector("[data-placed-rectangle='1']")).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Undo" }));

    expect(board.querySelector("[data-placed-rectangle='1']")).toBeNull();
    expect(board.querySelectorAll("[data-placed-cell='true']")).toHaveLength(
      rectangle.width * rectangle.height,
    );

    fireEvent.click(screen.getByRole("button", { name: "Undo" }));

    expect(board.querySelector("[data-placed-cell='true']")).toBeNull();
    expect(screen.getByLabelText("Placement prompt")).toBeInTheDocument();
  });

  test("reset clears placements when confirmed", () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<App />);

    placeFirstRectangle();
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));

    const board = screen.getByRole("img", { name: /4 by 4 puzzle board/i });

    expect(confirmSpy).toHaveBeenCalledTimes(1);
    expect(board.querySelector("[data-placed-cell='true']")).toBeNull();
    expect(screen.getByLabelText("Placement prompt")).toBeInTheDocument();
  });

  test("reset keeps placements when confirmation is cancelled", () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
    render(<App />);

    placeFirstRectangle();
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));

    const board = screen.getByRole("img", { name: /4 by 4 puzzle board/i });

    expect(confirmSpy).toHaveBeenCalledTimes(1);
    expect(board.querySelector("[data-placed-cell='true']")).not.toBeNull();
    expect(screen.queryByLabelText("Placement prompt")).not.toBeInTheDocument();
  });

  test("reset on empty board does not ask for confirmation", () => {
    const confirmSpy = vi.spyOn(window, "confirm");
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));

    expect(confirmSpy).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Placement prompt")).toBeInTheDocument();
  });
});
