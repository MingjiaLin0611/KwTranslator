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

export function parseDictionaryImport(input: string): DictionaryImportResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(input);
  } catch {
    return invalidImport(input, "import must be valid JSON");
  }

  if (!isDictionaryShape(parsed)) {
    return invalidImport(parsed, "import must be a dictionary object");
  }

  return validateDictionary(parsed);
}

export function mergeDictionaries(
  builtin: KeywordDictionary,
  user: KeywordDictionary | undefined
): KeywordDictionary {
  if (!user) return builtin;

  const entriesByKeyword = new Map<string, KeywordEntry>();

  for (const entry of builtin.entries) {
    entriesByKeyword.set(normalizeKeyword(entry.keyword), entry);
  }

  for (const entry of user.entries) {
    entriesByKeyword.set(normalizeKeyword(entry.keyword), entry);
  }

  return {
    schemaVersion: builtin.schemaVersion,
    dictionaryVersion: `${builtin.dictionaryVersion}+${user.dictionaryVersion}`,
    name: `${builtin.name} + ${user.name}`,
    entries: [...entriesByKeyword.values()]
  };
}

export function createDictionaryExport(dictionary: KeywordDictionary): string {
  return JSON.stringify(
    {
      ...dictionary,
      exportedAt: new Date().toISOString()
    },
    null,
    2
  );
}

function validateEntry(entry: unknown): string | undefined {
  if (!isRecord(entry)) return "entry must be an object";
  if (typeof entry.id !== "string") return "id is required";
  if (typeof entry.keyword !== "string") return "keyword is required";
  if (typeof entry.translation !== "string") return "translation is required";
  if (typeof entry.domain !== "string") return "domain is required";
  if (typeof entry.caseSensitive !== "boolean") return "caseSensitive is required";
  if (typeof entry.enabled !== "boolean") return "enabled is required";
  if (!entry.id.trim()) return "id is required";
  if (!entry.keyword.trim()) return "keyword is required";
  if (!entry.translation.trim()) return "translation is required";
  if (!entry.domain.trim()) return "domain is required";
  if (!["phrase", "word-boundary"].includes(entry.matchStrategy)) return "matchStrategy is unsupported";
  if (!["builtin", "user", "ai"].includes(entry.source)) return "source is unsupported";
  if (!Number.isInteger(entry.version) || entry.version < 1) return "version must be a positive integer";
  return undefined;
}

function normalizeKeyword(keyword: string): string {
  return keyword.trim().toLocaleLowerCase();
}

function invalidImport(entry: unknown, reason: string): DictionaryImportResult {
  return {
    valid: false,
    accepted: [],
    rejected: [{ entry, reason }],
    conflicts: [],
    schemaCompatible: false
  };
}

function isDictionaryShape(value: unknown): value is KeywordDictionary {
  return (
    isRecord(value) &&
    typeof value.schemaVersion === "number" &&
    typeof value.dictionaryVersion === "string" &&
    typeof value.name === "string" &&
    Array.isArray(value.entries)
  );
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null;
}
