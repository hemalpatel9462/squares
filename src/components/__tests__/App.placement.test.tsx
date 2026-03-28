import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import App from "@/App";
import { getPuzzleByIndex } from "@/data/starterPack";
import { analyzePlacement } from "@/rules";
import type { CandidatePlacement } from "@/types/rules";

function PlacementScopeHarness() {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [placementsByPuzzleId, setPlacementsByPuzzleId] = useState<Record<string, CandidatePlacement[]>>({});
  const currentPuzzle = getPuzzleByIndex(currentPuzzleIndex);

  if (!currentPuzzle) {
    return null;
  }

  function handlePlaceRectangle(placement: CandidatePlacement) {
    setPlacementsByPuzzleId((currentByPuzzleId) => {
      const currentPlacements = currentByPuzzleId[currentPuzzle.id] ?? [];
      const nextPlacement = analyzePlacement(
        currentPuzzle.size,
        currentPuzzle.clues,
        placement,
        currentPlacements,
      );

      if (!nextPlacement.isValid) {
        return currentByPuzzleId;
      }

      return {
        ...currentByPuzzleId,
        [currentPuzzle.id]: [...currentPlacements, placement],
      };
    });
  }

  const easy001Placement: CandidatePlacement = {
    origin: { row: 0, col: 0 },
    rectangle: { row: 0, col: 0, width: 2, height: 2 },
  };

  const easy002Placement: CandidatePlacement = {
    origin: { row: 0, col: 2 },
    rectangle: { row: 0, col: 2, width: 1, height: 2 },
  };

  return (
    <div>
      <p>{currentPuzzle.id}</p>
      <p data-testid="easy-001-count">{(placementsByPuzzleId["easy-001"] ?? []).length}</p>
      <p data-testid="easy-002-count">{(placementsByPuzzleId["easy-002"] ?? []).length}</p>
      <button onClick={() => handlePlaceRectangle(currentPuzzleIndex === 0 ? easy001Placement : easy002Placement)} type="button">
        Place Rectangle
      </button>
      <button onClick={() => setCurrentPuzzleIndex(1)} type="button">
        Go To easy-002
      </button>
    </div>
  );
}

describe("App placement foundations", () => {
  it("renders the empty placement prompt before the first placement", () => {
    render(<App />);

    expect(screen.getByText("No rectangles placed yet")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Drag from a numbered clue to preview a rectangle. Release when the area matches the clue and the outline turns valid.",
      ),
    ).toBeInTheDocument();
  });

  it("keeps placements scoped by puzzle id", () => {
    render(<PlacementScopeHarness />);

    fireEvent.click(screen.getByRole("button", { name: "Place Rectangle" }));
    fireEvent.click(screen.getByRole("button", { name: "Go To easy-002" }));
    fireEvent.click(screen.getByRole("button", { name: "Place Rectangle" }));

    expect(screen.getByTestId("easy-001-count")).toHaveTextContent("1");
    expect(screen.getByTestId("easy-002-count")).toHaveTextContent("1");
  });
});
