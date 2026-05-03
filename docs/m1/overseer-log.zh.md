# Overseer 日志

## M1 初始实现

- 状态：已实现。
- 预期检查：文档、测试、代码模块、覆盖率门槛、扩展构建、E2E 支持。
- 已知约束：AI provider 在 M1 仅提供接口；词库导入/导出仅提供 schema 和模块边界。

## 已记录问题与恢复动作

- 修正测试配置后，初始 TDD 红灯失败在缺少核心模块上。这是预期的实现前红灯状态。
- `tsconfig` 最初继承了 WXT 生成配置，但当时 `.wxt` 尚不存在。已改为独立的根 TypeScript 配置。
- Vitest alias 需要使用 Windows 安全的 `fileURLToPath` 处理。
- WXT content 构建在 Windows 上未能稳定解析 entrypoints 中的 `@` alias。扩展入口现在使用相对导入，测试仍保留 alias。
- Playwright Chromium 最初因 `ECONNRESET` 下载失败。扩展 E2E 现在使用 `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` 或本地 Playwright 浏览器缓存中已有的 Chromium。
- `fs.cpSync` 在 Windows 上从当前工作区路径复制扩展产物时可能异常终止。扩展 E2E 现在使用显式递归目录复制。
- 默认 E2E 通过浏览器 harness 验证构建后的 content script。当 Playwright Chromium 可用时，真实扩展加载 E2E 可通过 `npm run test:e2e:extension` 通过。
- SSH remote 仍因当前网络路径关闭 22 端口而失败。M1 提交和推送使用 HTTPS remote `origin-https`。

## 同步检查

- 已更新规格：技术架构、数据结构、功能、测试策略、AI coding 入口。
- 已更新测试：dictionary、matcher、scanner、injector 的单元测试；E2E harness 和真实扩展 E2E 入口。
- 已更新代码：核心模块、WXT content 入口、React popup、storage 和 AI provider 边界。
