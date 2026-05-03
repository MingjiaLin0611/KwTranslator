# M2 功能规格

## 主要功能

KW Translator 在启用状态下读取内置词库和用户导入词库，扫描网页中可处理的英文技术文本，识别关键词或短语，并以内联形式注入中文翻译。

示例：

`React improves Software Engineering workflows.`

注入后：

`React(反应式框架) improves Software Engineering(软件工程) workflows.`

## 次要功能

- popup 显示启用状态、内置词库版本、内置词条数量、用户词条数量和合并后总词条数量。
- popup 支持启用或禁用内联注入。
- popup 支持导入符合 `KeywordDictionary` schema 的 JSON 用户词库。
- popup 支持导出当前用户词库，不导出内置词库。
- 用户词库与内置词库合并时，用户词条优先。

## 非目标

- 真实 AI provider 集成。
- 整句或整页翻译。
- 完整用户词库编辑 UI。
- 云同步。
- Chrome 和 Edge MV3 之外的完整跨浏览器兼容。

## 角色分工

- `planner`：维护 M2 规格、验收标准和测试方向。
- `executor`：审查计划风险后实现词库增强、持久化、content runtime 和 popup。
- `tester`：根据 M2 规格运行单元测试、覆盖率、编译、构建和 E2E。
- `overseer`：在 M2 完成时检查文档、测试和代码同步。
