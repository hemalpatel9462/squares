import type { CellCoord } from "@/types/rules";

const DEFAULT_BOARD_SIZE = 240;

export interface MockBoardGeometry {
  cellCenter(cell: CellCoord): { clientX: number; clientY: number };
  restore(): void;
}

export function mockBoardGeometry(
  element: HTMLElement,
  size: number,
  boardSize = DEFAULT_BOARD_SIZE,
): MockBoardGeometry {
  const original = element.getBoundingClientRect.bind(element);
  const rect = DOMRect.fromRect({
    x: 0,
    y: 0,
    width: boardSize,
    height: boardSize,
  });

  Object.defineProperty(element, "getBoundingClientRect", {
    configurable: true,
    value: () => rect,
  });

  return {
    cellCenter(cell) {
      const cellSize = boardSize / size;

      return {
        clientX: cell.col * cellSize + cellSize / 2,
        clientY: cell.row * cellSize + cellSize / 2,
      };
    },
    restore() {
      Object.defineProperty(element, "getBoundingClientRect", {
        configurable: true,
        value: original,
      });
    },
  };
}
