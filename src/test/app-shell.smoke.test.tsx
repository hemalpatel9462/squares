import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "@/App";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe("App shell", () => {
  it("renders the initial starter-pack puzzle shell", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Puzzle easy-001" }));

    expect(screen.getByText("Puzzle easy-001")).toBeInTheDocument();
    expect(screen.getByText("Easy")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /4 by 4 puzzle board/i }),
    ).toBeInTheDocument();
  });
});
