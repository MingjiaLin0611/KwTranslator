# M1 Data Structures

## KeywordEntry

Represents one translatable keyword or phrase.

- `id`: stable unique identifier.
- `keyword`: English keyword or phrase.
- `translation`: Chinese translation.
- `domain`: technical domain label.
- `caseSensitive`: whether matching must preserve exact case.
- `matchStrategy`: `word-boundary` or `phrase`.
- `enabled`: whether this entry participates in matching.
- `source`: `builtin`, `user`, or `ai`.
- `version`: entry schema version.

## KeywordDictionary

Represents a versioned dictionary.

- `schemaVersion`: dictionary schema version.
- `dictionaryVersion`: content version.
- `name`: dictionary name.
- `entries`: keyword entries.
- `exportedAt`: optional ISO timestamp for exported dictionaries.

## DictionaryImportResult

Represents future import validation.

- `accepted`: valid entries.
- `rejected`: invalid entries with reasons.
- `conflicts`: duplicate or competing entries.
- `schemaCompatible`: whether the imported schema can be read.

## MatchResult

Represents one text match.

- `entryId`, `keyword`, `translation`.
- `start`, `end`.
- `matchedText`.

## InjectionRecord

Represents one attempted DOM rewrite.

- `before`, `after`.
- `success`.
- `duplicatePrevented`.
- `skipReason`.

## AIProviderRequest / AIProviderResponse

Reserved for future AI translation and keyword suggestion. M1 defines the boundary only and does not call a real provider.

## HarnessCase

Represents a deterministic test fixture with input HTML, dictionary entries, expected output, and forbidden selectors.
