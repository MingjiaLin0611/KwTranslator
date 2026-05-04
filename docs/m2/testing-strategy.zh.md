# M2 测试策略

## 单元测试

单元测试覆盖以下行为：

- 词库导入：合法 JSON、无效 JSON、schema 不兼容、缺字段、重复 keyword。
- 词库合并：用户词条覆盖同 keyword 的内置词条。
- 词库导出：导出 JSON 带 `exportedAt`。
- storage：默认设置、保存设置、保存和读取用户词库。
- runtime：禁用时不注入，启用时使用合并词库注入，无 `body` 时安全退出，禁用时还原已注入文本，再启用时可重新注入。
- popup：状态和数量展示、启用切换、向当前标签页发送启用状态消息、消息失败时仍保存设置、合法导入、非法导入不覆盖原词库。

## E2E 测试

默认 E2E 继续通过浏览器 harness 验证构建后的 content script。E2E 覆盖启用翻译、禁用还原、重新启用翻译。真实扩展 E2E 可在 Chromium 可用时运行。

## 手动页面验证

`manual-test/run-toggle-verification.mjs` 会验证静态 HTML 页面和真实网页 `https://huggingface.co/blog/sensenova/neo-unify`，并保存启用、禁用、重新启用三组截图。

## 门禁命令

```bash
npm test
npm run test:coverage
npm run compile
npm run build
npm run test:e2e
npm run test:e2e:extension
```

`npm run test:e2e:extension` 依赖本机可用 Chromium 或 `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`。
