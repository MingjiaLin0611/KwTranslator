import { describe, expect, it } from "vitest";
import { findKeywordMatches } from "@/core/matcher";
import type { KeywordEntry } from "@/core/types";

const entries: KeywordEntry[] = [
  {
    id: "software-engineering",
    keyword: "Software Engineering",
    translation: "软件工程",
    domain: "software",
    caseSensitive: false,
    matchStrategy: "phrase",
    enabled: true,
    source: "builtin",
    version: 1
  },
  {
    id: "api",
    keyword: "API",
    translation: "应用程序接口",
    domain: "software",
    caseSensitive: false,
    matchStrategy: "word-boundary",
    enabled: true,
    source: "builtin",
    version: 1
  }
];

describe("matcher", () => {
  it("matches technical phrases case-insensitively", () => {
    const matches = findKeywordMatches("software engineering documentation", entries);

    expect(matches).toEqual([
      expect.objectContaining({
        entryId: "software-engineering",
        matchedText: "software engineering",
        translation: "软件工程"
      })
    ]);
  });

  it("does not match a word-boundary keyword inside another word", () => {
    const matches = findKeywordMatches("The apiculture page mentions an API.", entries);

    expect(matches).toHaveLength(1);
    expect(matches[0]?.matchedText).toBe("API");
  });

  it("ignores disabled entries", () => {
    const disabled = [{ ...entries[0]!, enabled: false }];

    expect(findKeywordMatches("Software Engineering", disabled)).toEqual([]);
  });
});
