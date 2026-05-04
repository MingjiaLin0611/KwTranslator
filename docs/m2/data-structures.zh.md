# M2 数据结构

M2 沿用 M1 的 `KeywordEntry`、`KeywordDictionary`、`DictionaryImportResult`、`MatchResult` 和 `InjectionRecord`。

## 内置词库领域

- `software`：基础软件工程词汇，例如 `Software Engineering`、`API`、`documentation`。
- `ai`：常用 AI 术语，例如 `Artificial Intelligence`、`Large Language Model`、`Prompt Engineering`、`RAG`、`Agent` 和 `Agents`。

## TranslatorSettings

表示扩展运行设置。

- `enabled`：扩展是否启用。
- `inlineInjection`：是否执行内联注入。
- `dictionaryVersion`：当前设置关联的词库版本。

## TranslatorStorage

表示持久化边界。

- `getSettings()`：读取设置，缺失时返回默认设置。
- `saveSettings(settings)`：保存设置。
- `getUserDictionary()`：读取用户词库，缺失或无效时返回 `undefined`。
- `saveUserDictionary(dictionary)`：保存用户词库。

## 词库合并规则

- 合并结果包含所有内置词条和用户词条。
- normalized keyword 使用 `trim().toLocaleLowerCase()`。
- 同一 normalized keyword 冲突时，用户词条覆盖内置词条。
- 合并词库版本格式为 `<builtinVersion>+<userVersion>`。

## 导入和导出规则

- 导入必须是合法 JSON。
- 导入对象必须符合 `KeywordDictionary` 基本结构。
- schema 不兼容、缺字段、无效字段或重复 keyword 会使导入无效。
- 导出会在用户词库上补充 `exportedAt` ISO 时间戳。
