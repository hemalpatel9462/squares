import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import App from "@/App";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

function openPuzzleFromBrowser(puzzleId = "easy-001") {
  // open puzzle from browser before asserting play-shell behavior
  fireEvent.click(screen.getByRole("tab", { name: "Easy" }));
  fireEvent.click(screen.getByRole("button", { name: `Puzzle ${puzzleId}` }));
}

describe("App", () => {
  it("opens another puzzle from the browser and updates pack progress", () => {
    render(<App />);
    openPuzzleFromBrowser();

    expect(screen.getByText("Puzzle easy-001")).toBeInTheDocument();
    expect(screen.getByText("1/40")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Back to Browser" }));
    fireEvent.click(screen.getByRole("button", { name: "Puzzle easy-002" }));

    expect(screen.getByText("Puzzle easy-002")).toBeInTheDocument();
    expect(screen.getByText("2/40")).toBeInTheDocument();
  });

  it("uses compact icon controls on the play screen", () => {
    render(<App />);
    openPuzzleFromBrowser();

    expect(screen.getByRole("button", { name: "Back to Browser" })).toHaveTextContent("←");
    expect(screen.getByRole("button", { name: "Undo last placement" })).toHaveTextContent("↶");
    expect(screen.getByRole("button", { name: "Reset puzzle" })).toHaveTextContent("↺");
    expect(screen.queryByRole("button", { name: "Previous" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next Puzzle" })).not.toBeInTheDocument();
  });

  it("renders metadata and board inside one framed premium shell with the phase tokens", () => {
    render(<App />);
    openPuzzleFromBrowser();

    const shell = screen.getByRole("region", { name: "Puzzle easy-001 board shell" });
    const board = screen.getByRole("img", { name: /4 by 4 puzzle board/i });
    const shellText = shell.textContent ?? "";
    const tokensCss = readFileSync(resolve(process.cwd(), "src/styles/tokens.css"), "utf8");

    expect(shell).toContainElement(board);
    expect(shellText).toContain("Puzzle easy-001");
    expect(shellText).toContain("Easy");
    expect(shellText).toContain("1/40");
    expect(screen.getByRole("button", { name: "Back to Browser" })).toBeInTheDocument();
    expect(shell.className).toContain("puzzle-shell");
    expect(tokensCss).toContain("--color-dominant: #F3EEE4;");
    expect(tokensCss).toContain("--space-md: 16px;");
    expect(tokensCss).toContain("--radius-shell: 20px;");
  });
});
