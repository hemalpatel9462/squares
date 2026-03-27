import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "@/App";

describe("App shell", () => {
  it("renders the initial starter-pack puzzle shell", () => {
    render(<App />);

    expect(screen.getByText("Puzzle easy-001")).toBeInTheDocument();
    expect(screen.getByText("Easy")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /read-only 4 by 4 puzzle board/i }),
    ).toBeInTheDocument();
  });
});
