# M1 测试策略

## 单元测试

单元测试覆盖词库校验、匹配、DOM 扫描和内联注入。核心模块必须保持至少 80% 行覆盖率。

必测场景：

- 单关键词注入。
- 多关键词注入。
- 大小写不敏感匹配。
- 短语边界匹配。
- 重复注入防护。
- 跳过代码块、script、style、input 和 textarea。

## E2E 测试

E2E 测试在确定性页面上验证行为，并且不依赖真实 AI provider。默认 E2E 测试会把构建后的 content script 加载进浏览器 harness，因此能在本地和 CI 环境中稳定运行。`npm run test:e2e:extension` 会运行真实扩展加载测试，并使用 `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` 或本地 Playwright 浏览器缓存中的 Chromium。

## SDD 门禁

行为变更必须同步更新规格、测试和实现。overseer 角色会在里程碑完成时检查这一点。
