import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../app/store";
import Home from "./Home";

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
