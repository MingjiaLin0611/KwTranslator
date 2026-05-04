# M2 Overseer 日志

## M2 词库增强识别翻译

- 状态：已实现。
- 范围：用户词库导入/导出、持久化、运行时启用控制、合并词库注入、popup 基础控制面板。
- 非目标：真实 AI provider、整句或整页翻译、完整词库编辑 UI、云同步。

## 已记录问题与恢复动作

- 当前 worktree 初始没有 `node_modules`，`npm test` 和 `npm run compile` 无法运行。已通过 `npm install` 恢复。
- popup 文件读取不能只依赖 `File.text()`，测试环境和部分运行环境可能缺失。已添加 `FileReader` fallback。
- 根 TypeScript 配置未提供 `browser` 全局。storage 改为显式从 `wxt/browser` 导入。
- 默认 E2E 和真实扩展 E2E 并行运行时，Playwright trace 产物目录出现竞争并导致真实扩展 E2E 在 `context.close()` 后失败。单独重跑 `npm run test:e2e:extension` 通过；后续门禁应避免并行运行两个 Playwright 命令。
- 启用开关升级为立即双向控制。静态页面和真实网页 `https://huggingface.co/blog/sensenova/neo-unify` 均已通过启用、禁用、重新启用验证；截图保存在 `manual-test/screenshots/`。

## 同步检查

- M2 规格、架构、数据结构、测试策略已新增中英文文档。
- M2 行为已新增 dictionary、storage、runtime 和 popup 单元测试。
- 最新 tester 和 overseer 检查包括：单元测试、覆盖率、编译、构建、默认 E2E、真实扩展 E2E、静态页面截图验证和 Hugging Face 真实网页截图验证。
