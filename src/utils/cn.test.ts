import { cn } from "./cn";

describe("cn", () => {
  test("joins class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  test("drops falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  test("resolves conflicting tailwind utilities (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-sm text-gray-500", "text-gray-900")).toBe(
      "text-sm text-gray-900"
    );
  });
});
