import reducer, {
  toggleSaved,
  clearSaved,
  selectSavedIds,
  selectIsSaved,
  selectSavedCount,
} from "./savedSlice";

describe("savedSlice reducer", () => {
  const base = { items: [], status: "idle" as const };

  test("toggleSaved adds an id when absent", () => {
    const state = reducer({ ids: [], ...base }, toggleSaved("2"));
    expect(state.ids).toEqual(["2"]);
  });

  test("toggleSaved removes an id when present", () => {
    const state = reducer({ ids: ["2", "3"], ...base }, toggleSaved("2"));
    expect(state.ids).toEqual(["3"]);
  });

  test("clearSaved empties the list", () => {
    const state = reducer({ ids: ["2", "3"], ...base }, clearSaved());
    expect(state.ids).toEqual([]);
  });
});

describe("savedSlice selectors", () => {
  const rootState = { saved: { ids: ["2", "10"] } } as any;

  test("selectSavedIds returns the ids", () => {
    expect(selectSavedIds(rootState)).toEqual(["2", "10"]);
  });

  test("selectIsSaved reflects membership", () => {
    expect(selectIsSaved("2")(rootState)).toBe(true);
    expect(selectIsSaved("3")(rootState)).toBe(false);
  });

  test("selectSavedCount counts saved ids", () => {
    expect(selectSavedCount(rootState)).toBe(2);
  });
});
