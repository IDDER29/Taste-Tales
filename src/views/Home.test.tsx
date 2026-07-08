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

// The landing page (shown to logged-out visitors) uses the App Router hooks.
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

test("renders the hero heading", () => {
  render(
    <Provider store={store}>
      <Home />
    </Provider>
  );
  // The hero heading is split across elements ("Where every flavor" + a
  // gradient "tells a story"); assert on the distinctive gradient fragment.
  expect(screen.getByText(/tells a story/i)).toBeInTheDocument();
});
