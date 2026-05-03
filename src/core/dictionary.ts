import type { DictionaryImportResult, KeywordDictionary, KeywordEntry } from "./types";

export const DICTIONARY_SCHEMA_VERSION = 1;

export const builtinDictionary: KeywordDictionary = {
  schemaVersion: DICTIONARY_SCHEMA_VERSION,
  dictionaryVersion: "m1.0.0",
  name: "KW Translator Builtin Technical Dictionary",
  entries: [
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
    },
    {
      id: "documentation",
      keyword: "documentation",
      translation: "文档",
      domain: "software",
      caseSensitive: false,
      matchStrategy: "word-boundary",
      enabled: true,
      source: "builtin",
      version: 1
    }
  ]
};

export function validateDictionary(dictionary: KeywordDictionary): DictionaryImportResult {
  const accepted: KeywordEntry[] = [];
  const rejected: DictionaryImportResult["rejected"] = [];
  const keywordToIds = new Map<string, string[]>();
  const schemaCompatible = dictionary.schemaVersion === DICTIONARY_SCHEMA_VERSION;

  for (const entry of dictionary.entries ?? []) {
    const reason = validateEntry(entry);

    if (reason) {
      rejected.push({ entry, reason });
      continue;
    }

    accepted.push(entry);
    const key = entry.keyword.toLocaleLowerCase();
    keywordToIds.set(key, [...(keywordToIds.get(key) ?? []), entry.id]);
  }

  const conflicts = [...keywordToIds.entries()]
    .filter(([, ids]) => ids.length > 1)
    .map(([keyword, entryIds]) => ({ keyword, entryIds }));

  return {
    valid: schemaCompatible && rejected.length === 0 && conflicts.length === 0,
    accepted,
    rejected,
    conflicts,
    schemaCompatible
  };
}

function validateEntry(entry: KeywordEntry): string | undefined {
  if (!entry.id.trim()) return "id is required";
  if (!entry.keyword.trim()) return "keyword is required";
  if (!entry.translation.trim()) return "translation is required";
  if (!entry.domain.trim()) return "domain is required";
  if (!["phrase", "word-boundary"].includes(entry.matchStrategy)) return "matchStrategy is unsupported";
  if (!["builtin", "user", "ai"].includes(entry.source)) return "source is unsupported";
  if (!Number.isInteger(entry.version) || entry.version < 1) return "version must be a positive integer";
  return undefined;
}
