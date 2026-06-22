import { sanitizeHtml } from "./sanitize";

describe("sanitizeHtml", () => {
  test("returns empty string for nullish input", () => {
    expect(sanitizeHtml(undefined)).toBe("");
    expect(sanitizeHtml(null)).toBe("");
    expect(sanitizeHtml("")).toBe("");
  });

  test("preserves safe formatting tags", () => {
    const clean = sanitizeHtml("<h2>Title</h2><p>Some <strong>bold</strong> text</p><ul><li>one</li></ul>");
    expect(clean).toContain("<h2>Title</h2>");
    expect(clean).toContain("<strong>bold</strong>");
    expect(clean).toContain("<li>one</li>");
  });

  test("strips <script> tags", () => {
    const clean = sanitizeHtml('<p>hi</p><script>alert("xss")</script>');
    expect(clean).toContain("<p>hi</p>");
    expect(clean.toLowerCase()).not.toContain("<script");
    expect(clean).not.toContain("alert(");
  });

  test("strips inline event handlers", () => {
    const clean = sanitizeHtml('<img src="x" onerror="alert(1)">');
    expect(clean).not.toContain("onerror");
    expect(clean).not.toContain("alert(1)");
  });

  test("removes javascript: URIs from links", () => {
    const clean = sanitizeHtml('<a href="javascript:alert(1)">click</a>');
    expect(clean).not.toContain("javascript:");
  });

  test("keeps safe http links", () => {
    const clean = sanitizeHtml('<a href="https://example.com">link</a>');
    expect(clean).toContain('href="https://example.com"');
  });
});
