import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import App from "@/App";

afterEach(() => {
  cleanup();
});

describe("App", () => {
  it("advances to the next puzzle and updates pack progress", () => {
    render(<App />);

    expect(screen.getByText("Puzzle easy-001")).toBeInTheDocument();
    expect(screen.getByText("Puzzle 1 of 40")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next Puzzle" }));

    expect(screen.getByText("Puzzle easy-002")).toBeInTheDocument();
    expect(screen.getByText("Puzzle 2 of 40")).toBeInTheDocument();
  });

  it("disables previous on the first puzzle and next on the fortieth puzzle", () => {
    render(<App />);

    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();

    for (let index = 1; index < 40; index += 1) {
      fireEvent.click(screen.getByRole("button", { name: "Next Puzzle" }));
    }

    expect(screen.getByText("Puzzle hard-012")).toBeInTheDocument();
    expect(screen.getByText("Puzzle 40 of 40")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next Puzzle" })).toBeDisabled();
  });

  it("renders metadata and board inside one framed premium shell with the phase tokens", () => {
    render(<App />);

    const shell = screen.getByRole("region", { name: "Puzzle easy-001 board shell" });
    const board = screen.getByRole("img", { name: /4 by 4 puzzle board/i });
    const shellText = shell.textContent ?? "";
    const tokensCss = readFileSync(resolve(process.cwd(), "src/styles/tokens.css"), "utf8");

    expect(shell).toContainElement(board);
    expect(shellText).toContain("Puzzle easy-001");
    expect(shellText).toContain("Easy");
    expect(shellText).toContain("Puzzle 1 of 40");
    expect(shell.className).toContain("puzzle-shell");
    expect(tokensCss).toContain("--color-dominant: #F3EEE4;");
    expect(tokensCss).toContain("--space-md: 16px;");
    expect(tokensCss).toContain("--radius-shell: 20px;");
  });
});
