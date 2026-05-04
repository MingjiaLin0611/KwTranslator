# M2 Handoff

## 新增功能

- 内置词库扩展 `ai` 领域常用术语，覆盖 `Artificial Intelligence`、`Large Language Model`、`Prompt Engineering`、`RAG`、`Agent/Agents` 等关键词。
- popup 启用开关会即时通知当前活动页面：启用时注入翻译，禁用时恢复本次扩展注入前的原文。
- content script 新增运行时消息监听，支持页面内翻译状态的即时切换。
- runtime 从一次性执行扩展为可复用页面翻译控制器，支持启用、禁用和按状态切换。

## 新增数据结构

- `SET_ENABLED_MESSAGE`：popup 与 content script 之间的启用状态消息类型常量。
- `SetEnabledMessage`：携带 `enabled` 状态的运行时消息。
- `SetEnabledResponse`：返回 toggle 是否成功、注入记录或错误信息。
- `PageTranslationController`：封装 `enableTranslation`、`disableTranslation`、`applyEnabledState`。
- runtime 内部维护 `Map<Text, string>`，记录已注入文本节点的原文，用于禁用时恢复。

## 测试流程补充

- 单测补充：AI 内置词库有效性、runtime 禁用恢复/重新启用、popup 当前页消息发送与失败兜底。
- E2E 补充：浏览器 harness 验证 AI 术语注入，以及启用、禁用、重新启用的即时切换。
- 手测补充：`manual-test/run-toggle-verification.mjs` 覆盖静态页面和 Hugging Face 真实页面，并保存三态截图。
- 建议关卡：`npm test`、`npm run test:coverage`、`npm run compile`、`npm run build`、`npm run test:e2e`、`npm run test:e2e:extension`。

## 当前里程碑总结

M2 已完成词库增强、用户词库合并、popup 基础控制、页面内即时启停和文档同步。真实 AI provider、整句/整页翻译、完整词库编辑 UI、云同步仍不属于 M2 范围。
