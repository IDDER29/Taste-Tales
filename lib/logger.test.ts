import { logger } from "./logger";

describe("logger", () => {
  test("emits one structured JSON line with the message + context", () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => {});
    logger.info("hello", { foo: "bar" });
    expect(spy).toHaveBeenCalledTimes(1);
    const parsed = JSON.parse(spy.mock.calls[0][0] as string);
    expect(parsed).toMatchObject({ level: "info", message: "hello", foo: "bar" });
    expect(typeof parsed.time).toBe("string");
    spy.mockRestore();
  });

  test("error level writes to console.error", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    logger.error("boom");
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });
});
