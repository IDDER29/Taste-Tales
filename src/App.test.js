import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";

test("renders the hero heading", () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(
    screen.getByText(/Where Every Flavor Tells a Story/i)
  ).toBeInTheDocument();
});
