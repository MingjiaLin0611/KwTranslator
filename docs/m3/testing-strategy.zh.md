# M3 测试策略

## 单元测试

单元测试覆盖以下行为：

- 词汇表集合初始化：首次读取时创建“我的词汇表”，默认启用且为空。
- 数据结构和工具函数：手动词条只需要原文和翻译，其余字段自动生成。
- 工具函数：normalized keyword、同表重复检查、同名导入改名、词表排序。
- storage：保存和读取自定义词汇表集合，不迁移旧 M2 用户词库。
- 词汇表合并：多个启用词汇表按优先级覆盖，禁用词汇表不参与合并，自定义词条覆盖内置词条。
- 导入导出：单个词汇表 JSON 导出带 `exportedAt`；非法 JSON、缺字段和重复 keyword 会被拒绝；同名导入自动改名。
- runtime：词库变化刷新时先恢复旧注入，再按最新词库重新注入。
- popup 词汇表管理：显示默认词汇表，创建、选择、重命名、删除、启停、上移、下移词汇表。
- popup 词条管理：新增、编辑、删除词条，同一词汇表内重复 keyword 时提示并阻止保存。

## E2E 测试

默认 E2E 继续通过浏览器 harness 验证构建后的 content script。M3 E2E 覆盖：

- 启用的多个自定义词汇表按优先级注入翻译。
- 词库变化消息触发当前页恢复并重新注入。
- M2 已有启用、禁用和重新启用即时切换仍然有效。

真实扩展 E2E 继续验证构建后的 MV3 扩展可以在 Chromium 中加载并注入翻译。

## 手动页面验证

M3 可以继续使用 `manual-test/run-toggle-verification.mjs` 检查启用、禁用、重新启用三态。后续如添加 options 页面，需要补充独立页面的手动验证脚本。

## 门禁命令

```bash
npm test
npm run test:coverage
npm run compile
npm run build
npm run test:e2e
npm run test:e2e:extension
```

`npm run test:e2e:extension` 依赖本机可用 Chromium 或 `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`。默认 E2E 和真实扩展 E2E 应按顺序运行，避免 Playwright trace 目录竞争。
