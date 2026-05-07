import type { CustomDictionaryCollection, DictionaryImportResult, KeywordDictionary, KeywordEntry } from "./types";

export const DICTIONARY_SCHEMA_VERSION = 1;
export const CUSTOM_DICTIONARY_SCHEMA_VERSION = 1;
export const DEFAULT_CUSTOM_DICTIONARY_NAME = "我的词汇表";
export const DEFAULT_CUSTOM_DICTIONARY_ID = "default-custom-dictionary";

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
    },
    {
      id: "artificial-intelligence",
      keyword: "Artificial Intelligence",
      translation: "人工智能",
      domain: "ai",
      caseSensitive: false,
      matchStrategy: "phrase",
      enabled: true,
      source: "builtin",
      version: 1
    },
    {
      id: "machine-learning",
      keyword: "Machine Learning",
      translation: "机器学习",
      domain: "ai",
      caseSensitive: false,
      matchStrategy: "phrase",
      enabled: true,
      source: "builtin",
      version: 1
    },
    {
      id: "deep-learning",
      keyword: "Deep Learning",
      translation: "深度学习",
      domain: "ai",
      caseSensitive: false,
      matchStrategy: "phrase",
      enabled: true,
      source: "builtin",
      version: 1
    },
    {
      id: "neural-network",
      keyword: "Neural Network",
      translation: "神经网络",
      domain: "ai",
      caseSensitive: false,
      matchStrategy: "phrase",
      enabled: true,
      source: "builtin",
      version: 1
    },
    {
      id: "large-language-model",
      keyword: "Large Language Model",
      translation: "大语言模型",
      domain: "ai",
      caseSensitive: false,
      matchStrategy: "phrase",
      enabled: true,
      source: "builtin",
      version: 1
    },
    {
      id: "llm",
      keyword: "LLM",
      translation: "大语言模型",
      domain: "ai",
      caseSensitive: false,
      matchStrategy: "word-boundary",
      enabled: true,
      source: "builtin",
      version: 1
    },
    {
      id: "prompt",
      keyword: "Prompt",
      translation: "提示词",
      domain: "ai",
      caseSensitive: false,
      matchStrategy: "word-boundary",
      enabled: true,
      source: "builtin",
      version: 1
    },
    {
      id: "prompt-engineering",
      keyword: "Prompt Engineering",
      translation: "提示词工程",
      domain: "ai",
      caseSensitive: false,
      matchStrategy: "phrase",
      enabled: true,
      source: "builtin",
      version: 1
    },
    {
      id: "agent",
      keyword: "Agent",
      translation: "智能体",
      domain: "ai",
      caseSensitive: false,
      matchStrategy: "word-boundary",
      enabled: true,
      source: "builtin",
      version: 1
    },
    {
      id: "agents",
      keyword: "Agents",
      translation: "智能体",
      domain: "ai",
      caseSensitive: false,
      matchStrategy: "word-boundary",
      enabled: true,
      source: "builtin",
      version: 1
    },
    {
      id: "embedding",
      keyword: "Embedding",
      translation: "嵌入",
      domain: "ai",
      caseSensitive: false,
      matchStrategy: "word-boundary",
      enabled: true,
      source: "builtin",
      version: 1
    },
    {
      id: "vector-database",
      keyword: "Vector Database",
      translation: "向量数据库",
      domain: "ai",
      caseSensitive: false,
      matchStrategy: "phrase",
      enabled: true,
      source: "builtin",
      version: 1
    },
    {
      id: "rag",
      keyword: "RAG",
      translation: "检索增强生成",
      domain: "ai",
      caseSensitive: false,
      matchStrategy: "word-boundary",
      enabled: true,
      source: "builtin",
      version: 1
    },
    {
      id: "retrieval-augmented-generation",
      keyword: "Retrieval Augmented Generation",
      translation: "检索增强生成",
      domain: "ai",
      caseSensitive: false,
      matchStrategy: "phrase",
      enabled: true,
      source: "builtin",
      version: 1
    },
    {
      id: "transformer",
      keyword: "Transformer",
      translation: "Transformer 模型",
      domain: "ai",
      caseSensitive: false,
      matchStrategy: "word-boundary",
      enabled: true,
      source: "builtin",
      version: 1
    },
    {
      id: "token",
      keyword: "Token",
      translation: "词元",
      domain: "ai",
      caseSensitive: false,
      matchStrategy: "word-boundary",
      enabled: true,
      source: "builtin",
      version: 1
    },
    {
      id: "inference",
      keyword: "Inference",
      translation: "推理",
      domain: "ai",
      caseSensitive: false,
      matchStrategy: "word-boundary",
      enabled: true,
      source: "builtin",
      version: 1
    },
    {
      id: "fine-tuning",
      keyword: "Fine-tuning",
      translation: "微调",
      domain: "ai",
      caseSensitive: false,
      matchStrategy: "phrase",
      enabled: true,
      source: "builtin",
      version: 1
    },
    {
      id: "dataset",
      keyword: "Dataset",
      translation: "数据集",
      domain: "ai",
      caseSensitive: false,
      matchStrategy: "word-boundary",
      enabled: true,
      source: "builtin",
      version: 1
    },
    {
      id: "model",
      keyword: "Model",
      translation: "模型",
      domain: "ai",
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

export function createDefaultCustomDictionaryCollection(now = new Date().toISOString()): CustomDictionaryCollection {
  return {
    schemaVersion: CUSTOM_DICTIONARY_SCHEMA_VERSION,
    dictionaries: [
      {
        id: DEFAULT_CUSTOM_DICTIONARY_ID,
        name: DEFAULT_CUSTOM_DICTIONARY_NAME,
        enabled: true,
        order: 0,
        entries: [],
        createdAt: now,
        updatedAt: now
      }
    ],
    activeDictionaryId: DEFAULT_CUSTOM_DICTIONARY_ID,
    updatedAt: now
  };
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
