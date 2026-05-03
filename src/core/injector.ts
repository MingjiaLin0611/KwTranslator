import { findKeywordMatches } from "./matcher";
import { collectEligibleTextNodes } from "./scanner";
import type { InjectionRecord, KeywordEntry, MatchResult } from "./types";

export function injectInlineTranslations(root: ParentNode, entries: KeywordEntry[]): InjectionRecord[] {
  return collectEligibleTextNodes(root).flatMap((node) => injectIntoTextNode(node, entries));
}

function injectIntoTextNode(node: Text, entries: KeywordEntry[]): InjectionRecord[] {
  const before = node.textContent ?? "";
  const matches = findKeywordMatches(before, entries);

  if (matches.length === 0) return [];

  const { text: after, duplicatePrevented, changed } = renderInlineTranslations(before, matches);

  if (changed) {
    node.textContent = after;
  }

  return [
    {
      before,
      after,
      success: changed,
      duplicatePrevented,
      skipReason: changed ? undefined : "already-injected"
    }
  ];
}

function renderInlineTranslations(text: string, matches: MatchResult[]) {
  let cursor = 0;
  let changed = false;
  let duplicatePrevented = false;
  let output = "";

  for (const match of matches) {
    if (match.start < cursor) continue;

    output += text.slice(cursor, match.start);
    const suffix = `(${match.translation})`;

    if (text.slice(match.end, match.end + suffix.length) === suffix) {
      duplicatePrevented = true;
      output += text.slice(match.start, match.end + suffix.length);
      cursor = match.end + suffix.length;
      continue;
    }

    output += `${match.matchedText}${suffix}`;
    cursor = match.end;
    changed = true;
  }

  output += text.slice(cursor);

  return { text: output, duplicatePrevented, changed };
}
