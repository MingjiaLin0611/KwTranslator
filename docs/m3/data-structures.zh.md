# M3 数据结构

M3 沿用 `KeywordEntry` 作为词条结构，并新增自定义词汇表集合模型。

## CustomDictionaryCollection

表示所有用户自定义词汇表。

- `schemaVersion`：集合 schema 版本。
- `dictionaries`：自定义词汇表数组。
- `activeDictionaryId`：popup 当前选中的词汇表。
- `updatedAt`：集合更新时间。

## CustomDictionary

表示一个可导入、导出和管理的自定义词汇表。

- `id`：词汇表唯一标识。
- `name`：用户自定义名称。
- `enabled`：该词汇表是否参与翻译。
- `order`：优先级顺序，数字越小优先级越高。
- `entries`：该词汇表内的 `KeywordEntry`。
- `createdAt`：创建时间。
- `updatedAt`：更新时间。
- `exportedAt`：导出时补充的时间戳。

## 手动词条默认规则

用户手动添加词条时只填写原文和翻译。系统自动生成：

- `id`：由词汇表 id 和原文 slug 组成。
- `domain`：使用词汇表 id。
- `caseSensitive`：默认 `false`。
- `matchStrategy`：默认 `word-boundary`。
- `enabled`：默认 `true`。
- `source`：默认 `user`。
- `version`：默认 `1`。

## 合并和冲突规则

- normalized keyword 使用 `trim().toLocaleLowerCase()`。
- 同一词汇表内 normalized keyword 必须唯一。
- 不同词汇表之间允许重复 keyword。
- 翻译合并时先放入内置词库，再按自定义词汇表优先级覆盖。
- 只有启用的自定义词汇表参与合并。
- 自定义词汇表优先于内置词库。
- 自定义词汇表之间按 `order` 优先，`order` 更小的词汇表覆盖 `order` 更大的词汇表。

## 导入和导出

- 导入和导出的文件单位是单个 `CustomDictionary` JSON。
- 导出 JSON 会补充 `schemaVersion` 和 `exportedAt`。
- 导出文件名使用词汇表名称和日期。
- 导入文件必须是合法 JSON，并且必须是兼容 schema 的词汇表对象。
- 导入的词汇表内不能有重复 normalized keyword。
- 导入同名词汇表时自动改名为副本，例如 `AI 词汇表 (2)`。

## M2 数据规则

M3 不迁移 M2 体验阶段的 `kwTranslator.userDictionary` 到新集合。首次读取 M3 集合时，如果本地没有 M3 自定义词汇表集合，系统初始化一个空的“我的词汇表”。
