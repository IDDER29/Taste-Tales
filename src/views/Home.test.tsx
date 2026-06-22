import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../app/store";
import Home from "./Home";

// next-auth/react ships ESM that Jest doesn't transform; the recipe cards in
// Home render SaveButton (which calls useSession), so stub the module.
jest.mock("next-auth/react", () => ({
  __esModule: true,
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
  useSession: () => ({ data: null, status: "unauthenticated" }),
}));

test("renders the hero heading", () => {
  render(
    <Provider store={store}>
      <Home />
    </Provider>
  );
  expect(
    screen.getByText(/Where Every Flavor Tells a Story/i)
  ).toBeInTheDocument();
});
