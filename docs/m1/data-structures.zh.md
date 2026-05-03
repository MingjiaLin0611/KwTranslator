# M1 数据结构

## KeywordEntry

表示一个可翻译的关键词或短语。

- `id`：稳定的唯一标识符。
- `keyword`：英文关键词或短语。
- `translation`：中文翻译。
- `domain`：技术领域标签。
- `caseSensitive`：匹配是否必须保持大小写完全一致。
- `matchStrategy`：`word-boundary` 或 `phrase`。
- `enabled`：该词条是否参与匹配。
- `source`：`builtin`、`user` 或 `ai`。
- `version`：词条 schema 版本。

## KeywordDictionary

表示一个带版本的词库。

- `schemaVersion`：词库 schema 版本。
- `dictionaryVersion`：词库内容版本。
- `name`：词库名称。
- `entries`：关键词词条集合。
- `exportedAt`：导出词库时的可选 ISO 时间戳。

## DictionaryImportResult

表示未来导入校验结果。

- `accepted`：有效词条。
- `rejected`：无效词条及原因。
- `conflicts`：重复或互相竞争的词条。
- `schemaCompatible`：导入的 schema 是否可读取。

## MatchResult

表示一次文本匹配。

- `entryId`、`keyword`、`translation`。
- `start`、`end`。
- `matchedText`。

## InjectionRecord

表示一次 DOM 重写尝试。

- `before`、`after`。
- `success`。
- `duplicatePrevented`。
- `skipReason`。

## AIProviderRequest / AIProviderResponse

为未来 AI 翻译和关键词建议保留。M1 只定义边界，不调用真实 provider。

## HarnessCase

表示一个确定性测试夹具，包含输入 HTML、词库词条、预期输出和禁止修改的选择器。
