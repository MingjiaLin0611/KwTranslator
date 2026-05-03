import { describe, expect, it } from "vitest";
import {
  builtinDictionary,
  createDictionaryExport,
  mergeDictionaries,
  parseDictionaryImport,
  validateDictionary
} from "@/core/dictionary";
import type { KeywordDictionary } from "@/core/types";

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

  it("parses a valid user dictionary import", () => {
    const result = parseDictionaryImport(
      JSON.stringify({
        schemaVersion: 1,
        dictionaryVersion: "user.1",
        name: "User Dictionary",
        entries: [userEntry("react", "React", "反应式框架")]
      })
    );

    expect(result.valid).toBe(true);
    expect(result.accepted).toContainEqual(expect.objectContaining({ id: "react", source: "user" }));
  });

  it("rejects malformed dictionary JSON without replacing entries", () => {
    const result = parseDictionaryImport("{not json");

    expect(result.valid).toBe(false);
    expect(result.accepted).toEqual([]);
    expect(result.rejected[0]?.reason).toContain("valid JSON");
  });

  it("marks incompatible schemas as invalid imports", () => {
    const result = parseDictionaryImport(
      JSON.stringify({
        schemaVersion: 99,
        dictionaryVersion: "future",
        name: "Future Dictionary",
        entries: [userEntry("future", "Future", "未来")]
      })
    );

    expect(result.valid).toBe(false);
    expect(result.schemaCompatible).toBe(false);
  });

  it("rejects entries with missing required fields instead of throwing", () => {
    const result = parseDictionaryImport(
      JSON.stringify({
        schemaVersion: 1,
        dictionaryVersion: "missing-fields",
        name: "Missing Fields",
        entries: [{ id: "broken" }]
      })
    );

    expect(result.valid).toBe(false);
    expect(result.rejected[0]?.reason).toContain("keyword");
  });

  it("reports duplicate normalized keywords as conflicts", () => {
    const result = parseDictionaryImport(
      JSON.stringify({
        schemaVersion: 1,
        dictionaryVersion: "duplicates",
        name: "Duplicates",
        entries: [
          userEntry("api-1", "API", "应用程序接口"),
          userEntry("api-2", "api", "接口")
        ]
      })
    );

    expect(result.valid).toBe(false);
    expect(result.conflicts).toEqual([{ keyword: "api", entryIds: ["api-1", "api-2"] }]);
  });

  it("lets user dictionary entries override builtin keyword translations", () => {
    const userDictionary: KeywordDictionary = {
      schemaVersion: 1,
      dictionaryVersion: "user.1",
      name: "User Dictionary",
      entries: [userEntry("custom-api", "api", "接口")]
    };

    const merged = mergeDictionaries(builtinDictionary, userDictionary);

    expect(merged.entries.find((entry) => entry.keyword.toLowerCase() === "api")).toEqual(
      expect.objectContaining({ id: "custom-api", translation: "接口", source: "user" })
    );
    expect(merged.dictionaryVersion).toBe("m1.0.0+user.1");
  });

  it("exports a user dictionary with an exported timestamp", () => {
    const exported = createDictionaryExport({
      schemaVersion: 1,
      dictionaryVersion: "user.1",
      name: "User Dictionary",
      entries: [userEntry("react", "React", "反应式框架")]
    });

    const parsed = JSON.parse(exported) as KeywordDictionary;

    expect(parsed.exportedAt).toEqual(expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/));
    expect(parsed.entries).toHaveLength(1);
  });
});

function userEntry(id: string, keyword: string, translation: string) {
  return {
    id,
    keyword,
    translation,
    domain: "software",
    caseSensitive: false,
    matchStrategy: "word-boundary" as const,
    enabled: true,
    source: "user" as const,
    version: 1
  };
}
