import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  test("renders its children", () => {
    render(<Button>Save recipe</Button>);
    expect(
      screen.getByRole("button", { name: /save recipe/i })
    ).toBeInTheDocument();
  });

  test("fires onClick", () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByRole("button", { name: /click/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("is disabled and busy while loading", () => {
    render(<Button loading>Submit</Button>);
    const btn = screen.getByRole("button", { name: /submit/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-busy", "true");
  });
});
