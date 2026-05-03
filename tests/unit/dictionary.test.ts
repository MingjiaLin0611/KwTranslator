import { describe, expect, it } from "vitest";
import { builtinDictionary, validateDictionary } from "@/core/dictionary";

describe("dictionary", () => {
  it("validates the builtin dictionary and exposes Software Engineering", () => {
    const result = validateDictionary(builtinDictionary);

    expect(result.valid).toBe(true);
    expect(builtinDictionary.entries).toContainEqual(
      expect.objectContaining({
        keyword: "Software Engineering",
        translation: "软件工程",
        source: "builtin"
      })
    );
  });

  it("rejects invalid import entries without accepting the dictionary", () => {
    const result = validateDictionary({
      schemaVersion: 1,
      dictionaryVersion: "bad",
      name: "bad import",
      entries: [
        {
          id: "missing-keyword",
          keyword: "",
          translation: "缺失关键词",
          domain: "software",
          caseSensitive: false,
          matchStrategy: "phrase",
          enabled: true,
          source: "user",
          version: 1
        }
      ]
    });

    expect(result.valid).toBe(false);
    expect(result.rejected[0]?.reason).toContain("keyword");
  });
});
