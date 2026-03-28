import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import PuzzleBoard from "@/components/PuzzleBoard";
import { createPuzzleFixture } from "@/rules/__tests__/ruleTestUtils";

import { mockBoardGeometry } from "./testGeometry";

afterEach(() => {
  cleanup();
});

describe("PuzzleBoard live rectangle placement", () => {
  test("arms from clue cell", () => {
    const puzzle = createPuzzleFixture();

    render(<PuzzleBoard puzzle={puzzle} />);

    const board = screen.getByRole("img", { name: /4 by 4 puzzle board/i });
    const originCell = board.querySelector("[data-row='0'][data-col='0'][data-cell-kind='clue']");

    expect(originCell).not.toBeNull();

    const geometry = mockBoardGeometry(board, puzzle.size);
    const origin = geometry.cellCenter({ row: 0, col: 0 });

    fireEvent.pointerDown(originCell!, {
      pointerId: 1,
      pointerType: "mouse",
      clientX: origin.clientX,
      clientY: origin.clientY,
    });

    fireEvent.pointerMove(board, {
      pointerId: 1,
      pointerType: "mouse",
      clientX: origin.clientX + 4,
      clientY: origin.clientY + 4,
    });

    expect(screen.queryByText(/^Area /)).not.toBeInTheDocument();
    expect(board.querySelector("[data-preview-active='true']")).toBeNull();

    geometry.restore();
  });

  test("updates preview during drag", () => {
    const puzzle = createPuzzleFixture();

    render(<PuzzleBoard puzzle={puzzle} />);

    const board = screen.getByRole("img", { name: /4 by 4 puzzle board/i });
    const originCell = board.querySelector("[data-row='0'][data-col='0'][data-cell-kind='clue']");

    expect(originCell).not.toBeNull();

    const geometry = mockBoardGeometry(board, puzzle.size);
    const origin = geometry.cellCenter({ row: 0, col: 0 });
    const target = geometry.cellCenter({ row: 1, col: 1 });
    const targetCell = board.querySelector("[data-row='1'][data-col='1']");

    fireEvent.pointerDown(originCell!, {
      pointerId: 1,
      pointerType: "mouse",
      clientX: origin.clientX,
      clientY: origin.clientY,
    });

    fireEvent.pointerMove(targetCell!, {
      pointerId: 1,
      pointerType: "mouse",
      clientX: target.clientX,
      clientY: target.clientY,
    });

    expect(screen.getByText("Area 4")).toBeInTheDocument();
    expect(screen.getByText("Valid")).toBeInTheDocument();
    expect(board.querySelectorAll("[data-preview-active='true']")).toHaveLength(4);
    expect(
      board.querySelector("[data-row='0'][data-col='0']")?.getAttribute("data-preview-origin"),
    ).toBe("true");

    geometry.restore();
  });

  test("shows validity state", () => {
    const puzzle = createPuzzleFixture();

    render(<PuzzleBoard puzzle={puzzle} />);

    const board = screen.getByRole("img", { name: /4 by 4 puzzle board/i });
    const originCell = board.querySelector("[data-row='0'][data-col='0'][data-cell-kind='clue']");

    expect(originCell).not.toBeNull();

    const geometry = mockBoardGeometry(board, puzzle.size);
    const origin = geometry.cellCenter({ row: 0, col: 0 });
    const target = geometry.cellCenter({ row: 0, col: 1 });
    const targetCell = board.querySelector("[data-row='0'][data-col='1']");

    fireEvent.pointerDown(originCell!, {
      pointerId: 1,
      pointerType: "mouse",
      clientX: origin.clientX,
      clientY: origin.clientY,
    });

    fireEvent.pointerMove(targetCell!, {
      pointerId: 1,
      pointerType: "mouse",
      clientX: target.clientX,
      clientY: target.clientY,
    });

    expect(screen.getByText("Wrong area")).toBeInTheDocument();
    expect(board.querySelector("[data-preview-state='invalid']")).not.toBeNull();

    geometry.restore();
  });

  test("updates without debounce", () => {
    const puzzle = createPuzzleFixture();

    render(<PuzzleBoard puzzle={puzzle} />);

    const board = screen.getByRole("img", { name: /4 by 4 puzzle board/i });
    const originCell = board.querySelector("[data-row='0'][data-col='0'][data-cell-kind='clue']");

    expect(originCell).not.toBeNull();

    const geometry = mockBoardGeometry(board, puzzle.size);
    const origin = geometry.cellCenter({ row: 0, col: 0 });
    const invalidTarget = geometry.cellCenter({ row: 0, col: 1 });
    const validTarget = geometry.cellCenter({ row: 1, col: 1 });
    const invalidTargetCell = board.querySelector("[data-row='0'][data-col='1']");
    const validTargetCell = board.querySelector("[data-row='1'][data-col='1']");

    fireEvent.pointerDown(originCell!, {
      pointerId: 1,
      pointerType: "mouse",
      clientX: origin.clientX,
      clientY: origin.clientY,
    });

    fireEvent.pointerMove(invalidTargetCell!, {
      pointerId: 1,
      pointerType: "mouse",
      clientX: invalidTarget.clientX,
      clientY: invalidTarget.clientY,
    });

    expect(screen.getByText("Wrong area")).toBeInTheDocument();

    fireEvent.pointerMove(validTargetCell!, {
      pointerId: 1,
      pointerType: "mouse",
      clientX: validTarget.clientX,
      clientY: validTarget.clientY,
    });

    expect(screen.getByText("Area 4")).toBeInTheDocument();
    expect(screen.getByText("Valid")).toBeInTheDocument();

    geometry.restore();
  });

  test("commits on valid release", () => {
    const puzzle = createPuzzleFixture();
    const onPlaceRectangle = vi.fn();

    render(<PuzzleBoard onPlaceRectangle={onPlaceRectangle} puzzle={puzzle} />);

    const board = screen.getByRole("img", { name: /4 by 4 puzzle board/i });
    const originCell = board.querySelector("[data-row='0'][data-col='0'][data-cell-kind='clue']");

    expect(originCell).not.toBeNull();

    const geometry = mockBoardGeometry(board, puzzle.size);
    const origin = geometry.cellCenter({ row: 0, col: 0 });
    const target = geometry.cellCenter({ row: 1, col: 1 });
    const targetCell = board.querySelector("[data-row='1'][data-col='1']");

    fireEvent.pointerDown(originCell!, {
      pointerId: 1,
      pointerType: "mouse",
      clientX: origin.clientX,
      clientY: origin.clientY,
    });

    fireEvent.pointerMove(targetCell!, {
      pointerId: 1,
      pointerType: "mouse",
      clientX: target.clientX,
      clientY: target.clientY,
    });

    fireEvent.pointerUp(targetCell!, {
      pointerId: 1,
      pointerType: "mouse",
      clientX: target.clientX,
      clientY: target.clientY,
    });

    expect(onPlaceRectangle).toHaveBeenCalledWith({
      origin: { row: 0, col: 0 },
      rectangle: { row: 0, col: 0, width: 2, height: 2 },
    });

    geometry.restore();
  });

  test("shows area cue and release feedback", () => {
    vi.useFakeTimers();

    try {
      const puzzle = createPuzzleFixture();
      const { rerender } = render(<PuzzleBoard puzzle={puzzle} />);

      const board = screen.getByRole("img", { name: /4 by 4 puzzle board/i });
      const geometry = mockBoardGeometry(board, puzzle.size);
      const originCell = board.querySelector("[data-row='0'][data-col='0'][data-cell-kind='clue']");

      expect(originCell).not.toBeNull();

      const origin = geometry.cellCenter({ row: 0, col: 0 });
      const validTarget = geometry.cellCenter({ row: 1, col: 1 });
      const validTargetCell = board.querySelector("[data-row='1'][data-col='1']");

      fireEvent.pointerDown(originCell!, {
        pointerId: 1,
        pointerType: "mouse",
        clientX: origin.clientX,
        clientY: origin.clientY,
      });

      fireEvent.pointerMove(validTargetCell!, {
        pointerId: 1,
        pointerType: "mouse",
        clientX: validTarget.clientX,
        clientY: validTarget.clientY,
      });

      expect(screen.getByText("Area 4")).toBeInTheDocument();

      fireEvent.pointerUp(validTargetCell!, {
        pointerId: 1,
        pointerType: "mouse",
        clientX: validTarget.clientX,
        clientY: validTarget.clientY,
      });

      expect(board).toHaveAttribute("data-release-feedback", "valid-settle");

      act(() => {
        vi.advanceTimersByTime(181);
      });

      expect(board).toHaveAttribute("data-release-feedback", "none");

      geometry.restore();

      rerender(<PuzzleBoard puzzle={puzzle} />);

      const nextBoard = screen.getByRole("img", { name: /4 by 4 puzzle board/i });
      const nextGeometry = mockBoardGeometry(nextBoard, puzzle.size);
      const nextOriginCell = nextBoard.querySelector("[data-row='0'][data-col='0'][data-cell-kind='clue']");
      const invalidTarget = nextGeometry.cellCenter({ row: 0, col: 1 });
      const invalidTargetCell = nextBoard.querySelector("[data-row='0'][data-col='1']");

      fireEvent.pointerDown(nextOriginCell!, {
        pointerId: 2,
        pointerType: "mouse",
        clientX: origin.clientX,
        clientY: origin.clientY,
      });

      fireEvent.pointerMove(invalidTargetCell!, {
        pointerId: 2,
        pointerType: "mouse",
        clientX: invalidTarget.clientX,
        clientY: invalidTarget.clientY,
      });

      fireEvent.pointerUp(invalidTargetCell!, {
        pointerId: 2,
        pointerType: "mouse",
        clientX: invalidTarget.clientX,
        clientY: invalidTarget.clientY,
      });

      expect(nextBoard).toHaveAttribute("data-release-feedback", "invalid-snapback");

      act(() => {
        vi.advanceTimersByTime(221);
      });

      expect(nextBoard).toHaveAttribute("data-release-feedback", "none");

      nextGeometry.restore();
    } finally {
      vi.useRealTimers();
    }
  });
});
