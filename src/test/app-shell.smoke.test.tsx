import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "@/App";

describe("App shell", () => {
  it("renders the placeholder starter pack shell", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /starter pack board shell/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/the shell is intentionally static/i),
    ).toBeInTheDocument();
  });
});
