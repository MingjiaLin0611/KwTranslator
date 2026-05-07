export type KeywordSource = "builtin" | "user" | "ai";

export type MatchStrategy = "word-boundary" | "phrase";

export interface KeywordEntry {
  id: string;
  keyword: string;
  translation: string;
  domain: string;
  caseSensitive: boolean;
  matchStrategy: MatchStrategy;
  enabled: boolean;
  source: KeywordSource;
  version: number;
}

export interface KeywordDictionary {
  schemaVersion: number;
  dictionaryVersion: string;
  name: string;
  entries: KeywordEntry[];
  exportedAt?: string;
}

export interface CustomDictionary {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
  entries: KeywordEntry[];
  createdAt: string;
  updatedAt: string;
  exportedAt?: string;
}

export interface CustomDictionaryCollection {
  schemaVersion: number;
  dictionaries: CustomDictionary[];
  activeDictionaryId: string;
  updatedAt: string;
}

export interface RejectedDictionaryEntry {
  entry: unknown;
  reason: string;
}

export interface DictionaryConflict {
  keyword: string;
  entryIds: string[];
}

export interface DictionaryImportResult {
  valid: boolean;
  accepted: KeywordEntry[];
  rejected: RejectedDictionaryEntry[];
  conflicts: DictionaryConflict[];
  schemaCompatible: boolean;
}

export interface MatchResult {
  entryId: string;
  keyword: string;
  translation: string;
  matchedText: string;
  start: number;
  end: number;
}

export interface InjectionRecord {
  before: string;
  after: string;
  success: boolean;
  duplicatePrevented: boolean;
  skipReason?: string;
}

export interface AIProviderRequest {
  text: string;
  domain?: string;
  existingDictionaryVersion?: string;
}

export interface AIProviderResponse {
  entries: KeywordEntry[];
  provider: string;
  cached: boolean;
  error?: string;
}

export interface HarnessCase {
  name: string;
  html: string;
  dictionary: KeywordDictionary;
  expectedText: string;
  forbiddenSelectors: string[];
}
