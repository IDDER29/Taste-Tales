import { slugify } from "./slug";

describe("slugify", () => {
  test("lowercases and hyphenates", () => {
    expect(slugify("Spicy Thai Basil Chicken")).toBe("spicy-thai-basil-chicken");
  });
  test("strips punctuation and collapses separators", () => {
    expect(slugify("Grandma's  Apple Pie!!")).toBe("grandma-s-apple-pie");
  });
  test("trims leading/trailing separators", () => {
    expect(slugify("  -- Hello -- ")).toBe("hello");
  });
  test("falls back to 'recipe' for empty/symbol-only input", () => {
    expect(slugify("!!!")).toBe("recipe");
    expect(slugify("")).toBe("recipe");
  });
});
