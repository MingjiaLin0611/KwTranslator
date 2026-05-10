import { describe, expect, it } from "vitest";
import {
  builtinDictionary,
  CUSTOM_DICTIONARY_SCHEMA_VERSION,
  DEFAULT_CUSTOM_DICTIONARY_NAME,
  createManualKeywordEntry,
  createDefaultCustomDictionaryCollection,
  createDictionaryExport,
  hasDuplicateKeywordInDictionary,
  mergeDictionaries,
  moveCustomDictionary,
  normalizeCustomKeyword,
  parseDictionaryImport,
  renameCustomDictionaryCopy,
  sortCustomDictionariesByOrder,
  validateDictionary
} from "@/core/dictionary";
import type { CustomDictionary, CustomDictionaryCollection, KeywordDictionary } from "@/core/types";

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

  it("contains the builtin AI common vocabulary", () => {
    expect(validateDictionary(builtinDictionary).valid).toBe(true);
    expect(builtinDictionary.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          keyword: "Artificial Intelligence",
          translation: "人工智能",
          domain: "ai"
        }),
        expect.objectContaining({
          keyword: "Large Language Model",
          translation: "大语言模型",
          domain: "ai"
        }),
        expect.objectContaining({
          keyword: "Prompt Engineering",
          translation: "提示词工程",
          domain: "ai"
        }),
        expect.objectContaining({
          keyword: "RAG",
          translation: "检索增强生成",
          domain: "ai"
        }),
        expect.objectContaining({
          keyword: "Agent",
          translation: "智能体",
          domain: "ai"
        }),
        expect.objectContaining({
          keyword: "Agents",
          translation: "智能体",
          domain: "ai"
        })
      ])
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

  it("creates the default M3 custom dictionary collection schema", () => {
    const collection: CustomDictionaryCollection = createDefaultCustomDictionaryCollection("2026-05-07T00:00:00.000Z");

    expect(collection).toEqual({
      schemaVersion: CUSTOM_DICTIONARY_SCHEMA_VERSION,
      activeDictionaryId: "default-custom-dictionary",
      updatedAt: "2026-05-07T00:00:00.000Z",
      dictionaries: [
        {
          id: "default-custom-dictionary",
          name: DEFAULT_CUSTOM_DICTIONARY_NAME,
          enabled: true,
          order: 0,
          entries: [],
          createdAt: "2026-05-07T00:00:00.000Z",
          updatedAt: "2026-05-07T00:00:00.000Z"
        }
      ]
    });
  });

  it("normalizes custom keywords by trimming and lowercasing", () => {
    expect(normalizeCustomKeyword("  API  ")).toBe("api");
    expect(normalizeCustomKeyword(" React ")).toBe("react");
  });

  it("creates manual user entries with M3 default fields", () => {
    expect(
      createManualKeywordEntry({
        dictionaryId: "frontend",
        keyword: " React ",
        translation: " React 框架 "
      })
    ).toEqual({
      id: "frontend-react",
      keyword: "React",
      translation: "React 框架",
      domain: "frontend",
      caseSensitive: false,
      matchStrategy: "word-boundary",
      enabled: true,
      source: "user",
      version: 1
    });
  });

  it("detects duplicate normalized keywords inside one custom dictionary", () => {
    const dictionary = customDictionary("frontend", "Frontend", 0, [
      userEntry("react-a", "React", "React 框架"),
      userEntry("react-b", " react ", "重复 React")
    ]);

    expect(hasDuplicateKeywordInDictionary(dictionary, "REACT")).toBe(true);
    expect(hasDuplicateKeywordInDictionary(dictionary, "Vue")).toBe(false);
    expect(hasDuplicateKeywordInDictionary(dictionary, "REACT", "react-a")).toBe(true);
    expect(hasDuplicateKeywordInDictionary(dictionary, "REACT", "react-b")).toBe(true);
  });

  it("sorts and moves custom dictionaries by order", () => {
    const dictionaries = [
      customDictionary("backend", "Backend", 2, []),
      customDictionary("frontend", "Frontend", 0, []),
      customDictionary("ai", "AI", 1, [])
    ];

    expect(sortCustomDictionariesByOrder(dictionaries).map((dictionary) => dictionary.id)).toEqual([
      "frontend",
      "ai",
      "backend"
    ]);

    expect(moveCustomDictionary(dictionaries, "backend", -1).map((dictionary) => [dictionary.id, dictionary.order])).toEqual([
      ["frontend", 0],
      ["backend", 1],
      ["ai", 2]
    ]);

    expect(moveCustomDictionary(dictionaries, "frontend", -1).map((dictionary) => dictionary.id)).toEqual([
      "frontend",
      "ai",
      "backend"
    ]);
  });

  it("renames imported custom dictionaries as copies without mutating the source", () => {
    const imported = customDictionary("ai-import", "AI 词汇表", 0, []);
    const renamed = renameCustomDictionaryCopy(imported, [
      customDictionary("ai-local", "AI 词汇表", 0, []),
      customDictionary("ai-local-2", "AI 词汇表 (2)", 1, [])
    ]);

    expect(renamed).toEqual(expect.objectContaining({ id: "ai-import-copy-3", name: "AI 词汇表 (3)" }));
    expect(imported).toEqual(expect.objectContaining({ id: "ai-import", name: "AI 词汇表" }));
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

function customDictionary(id: string, name: string, order: number, entries: ReturnType<typeof userEntry>[]): CustomDictionary {
  return {
    id,
    name,
    enabled: true,
    order,
    entries,
    createdAt: "2026-05-08T00:00:00.000Z",
    updatedAt: "2026-05-08T00:00:00.000Z"
  };
}
