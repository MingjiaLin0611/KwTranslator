# M2 Data Structures

M2 keeps the M1 `KeywordEntry`, `KeywordDictionary`, `DictionaryImportResult`, `MatchResult`, and `InjectionRecord` contracts.

## TranslatorSettings

Represents extension runtime settings.

- `enabled`: whether the extension is enabled.
- `inlineInjection`: whether inline injection should run.
- `dictionaryVersion`: dictionary version associated with the settings.

## TranslatorStorage

Represents the persistence boundary.

- `getSettings()`: reads settings and returns defaults when missing.
- `saveSettings(settings)`: saves settings.
- `getUserDictionary()`: reads the user dictionary and returns `undefined` when missing or invalid.
- `saveUserDictionary(dictionary)`: saves the user dictionary.

## Dictionary Merge Rules

- The merged result contains builtin and user entries.
- Normalized keywords use `trim().toLocaleLowerCase()`.
- When the same normalized keyword appears in both dictionaries, the user entry overrides the builtin entry.
- Merged dictionary versions use `<builtinVersion>+<userVersion>`.

## Import and Export Rules

- Imports must be valid JSON.
- Imports must match the basic `KeywordDictionary` shape.
- Incompatible schema, missing fields, invalid fields, or duplicate keywords make the import invalid.
- Export adds an `exportedAt` ISO timestamp to the user dictionary.
