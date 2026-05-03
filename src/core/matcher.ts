import type { KeywordEntry, MatchResult } from "./types";

export function findKeywordMatches(text: string, entries: KeywordEntry[]): MatchResult[] {
  const matches: MatchResult[] = [];

  for (const entry of entries) {
    if (!entry.enabled || !entry.keyword.trim()) continue;

    const flags = entry.caseSensitive ? "g" : "gi";
    const pattern = new RegExp(escapeRegExp(entry.keyword), flags);

    for (const match of text.matchAll(pattern)) {
      const start = match.index;
      if (start === undefined) continue;

      const end = start + match[0].length;
      if (!hasKeywordBoundary(text, start, end)) continue;

      matches.push({
        entryId: entry.id,
        keyword: entry.keyword,
        translation: entry.translation,
        matchedText: match[0],
        start,
        end
      });
    }
  }

  return matches.sort((a, b) => a.start - b.start || b.end - a.end);
}

function hasKeywordBoundary(text: string, start: number, end: number): boolean {
  return !isAsciiWord(text[start - 1]) && !isAsciiWord(text[end]);
}

function isAsciiWord(char: string | undefined): boolean {
  return !!char && /[A-Za-z0-9_]/.test(char);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
