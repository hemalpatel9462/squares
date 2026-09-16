import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import App from "@/App";
import { getPuzzleByIndex } from "@/data/starterPack";
import type { CellCoord, RectangleBounds } from "@/types/rules";

import { mockBoardGeometry } from "./testGeometry";

afterEach(() => {
  vi.restoreAllMocks();
  cleanup();
  window.localStorage.clear();
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

function openPuzzleFromBrowser(puzzleId = "easy-001") {
  // open puzzle from browser before running placement regression checks
  fireEvent.click(screen.getByRole("tab", { name: "Easy" }));
  fireEvent.click(screen.getByRole("button", { name: `Puzzle ${puzzleId}` }));
}

function renderAppInPlay(puzzleId = "easy-001") {
  render(<App />);
  openPuzzleFromBrowser(puzzleId);
}

describe("App placement persistence", () => {
  test("remove click clears a placed rectangle and undo restores it", () => {
    renderAppInPlay();

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
    fireEvent.click(screen.getByRole("button", { name: "Undo last placement" }));

    expect(board.querySelectorAll("[data-placed-cell='true']")).toHaveLength(
      rectangle.width * rectangle.height,
    );
    expect(board.querySelector("[data-placed-rectangle='0']")).not.toBeNull();
  });

  test("remove click event clears one rectangle and undo restores both", () => {
    renderAppInPlay();

    placeFirstRectangle();
    placeRectangle({ row: 1, col: 3 }, { row: 0, col: 2 }, 2);

    const board = screen.getByRole("img", { name: /4 by 4 puzzle board/i });
    const secondRectangleCell = board.querySelector("[data-row='0'][data-col='2'][data-placed-rectangle='1']");

    expect(secondRectangleCell).not.toBeNull();

    fireEvent.click(secondRectangleCell!);

    expect(board.querySelector("[data-placed-rectangle='1']")).toBeNull();
    expect(board.querySelector("[data-placed-rectangle='0']")).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Undo last placement" }));

    expect(board.querySelector("[data-placed-rectangle='1']")).not.toBeNull();
    expect(board.querySelector("[data-placed-rectangle='0']")).not.toBeNull();
  });

  test("places the first valid rectangle without an empty-state block", () => {
    renderAppInPlay();

    const { rectangle } = placeFirstRectangle();

    expect(screen.getByRole("img", { name: /4 by 4 puzzle board/i }).querySelectorAll("[data-placed-cell='true']")).toHaveLength(rectangle.width * rectangle.height);
  });

  test("clears visible placements when navigating to a different puzzle", () => {
    renderAppInPlay();

    placeFirstRectangle();

    const board = screen.getByRole("img", { name: /4 by 4 puzzle board/i });

    expect(board.querySelector("[data-placed-cell='true']")).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Back to Browser" }));
    fireEvent.click(screen.getByRole("button", { name: "Puzzle easy-002" }));

    const nextBoard = screen.getByRole("img", { name: /4 by 4 puzzle board/i });

    expect(nextBoard.querySelector("[data-placed-cell='true']")).toBeNull();
  });

  test("restores saved placements when returning to a puzzle", () => {
    renderAppInPlay();

    const { rectangle } = placeFirstRectangle();

    fireEvent.click(screen.getByRole("button", { name: "Back to Browser" }));
    fireEvent.click(screen.getByRole("button", { name: "Puzzle easy-002" }));

    const nextBoard = screen.getByRole("img", { name: /4 by 4 puzzle board/i });
    expect(nextBoard.querySelector("[data-placed-cell='true']")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Back to Browser" }));
    fireEvent.click(screen.getByRole("button", { name: "Puzzle easy-001" }));

    const restoredBoard = screen.getByRole("img", { name: /4 by 4 puzzle board/i });

    expect(restoredBoard.querySelectorAll("[data-placed-cell='true']")).toHaveLength(
      rectangle.width * rectangle.height,
    );
    expect(restoredBoard.querySelector("[data-placed-rectangle='0']")).not.toBeNull();
  });

  test("undo supports multi-step rollback in order", () => {
    renderAppInPlay();

    const { rectangle } = placeFirstRectangle();
    placeRectangle({ row: 1, col: 3 }, { row: 0, col: 2 }, 2);

    const board = screen.getByRole("img", { name: /4 by 4 puzzle board/i });
    expect(board.querySelector("[data-placed-rectangle='1']")).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Undo last placement" }));

    expect(board.querySelector("[data-placed-rectangle='1']")).toBeNull();
    expect(board.querySelectorAll("[data-placed-cell='true']")).toHaveLength(
      rectangle.width * rectangle.height,
    );

    fireEvent.click(screen.getByRole("button", { name: "Undo last placement" }));

    expect(board.querySelector("[data-placed-cell='true']")).toBeNull();
  });

  test("reset clears placements when confirmed", () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    renderAppInPlay();

    placeFirstRectangle();
    fireEvent.click(screen.getByRole("button", { name: "Reset puzzle" }));

    const board = screen.getByRole("img", { name: /4 by 4 puzzle board/i });

    expect(confirmSpy).toHaveBeenCalledTimes(1);
    expect(board.querySelector("[data-placed-cell='true']")).toBeNull();
  });

  test("reset keeps placements when confirmation is cancelled", () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
    renderAppInPlay();

    placeFirstRectangle();
    fireEvent.click(screen.getByRole("button", { name: "Reset puzzle" }));

    const board = screen.getByRole("img", { name: /4 by 4 puzzle board/i });

    expect(confirmSpy).toHaveBeenCalledTimes(1);
    expect(board.querySelector("[data-placed-cell='true']")).not.toBeNull();
    expect(screen.queryByLabelText("Placement prompt")).not.toBeInTheDocument();
  });

  test("reset on empty board does not ask for confirmation", () => {
    const confirmSpy = vi.spyOn(window, "confirm");
    renderAppInPlay();

    fireEvent.click(screen.getByRole("button", { name: "Reset puzzle" }));

    expect(confirmSpy).not.toHaveBeenCalled();
  });
});
