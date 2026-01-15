import { render, screen } from "@testing-library/react";
import App from "./App";

it("shows the sign in form by default", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
});
