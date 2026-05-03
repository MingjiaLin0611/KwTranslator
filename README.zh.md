# KW Translator

KW Translator 是一个面向 Chrome / Edge Manifest V3 的浏览器扩展，用于把英文技术关键词以内联形式翻译到网页内容中。

示例输出：

`This documentation is focusing on Software Engineering(软件工程).`

## M1 重点

- 建立 WXT + React + TypeScript 扩展工程基础。
- 将词库、匹配、扫描和注入逻辑拆成框架无关的核心模块。
- 采用规格驱动开发（SDD）和测试驱动开发（TDD）。
- 支持单元测试、覆盖率门槛和 E2E harness。
- 建立 AI Coding 入口，强制区分 planner、executor、tester 和 overseer。

## 命令

```bash
npm test
npm run test:coverage
npm run compile
npm run build
npm run test:e2e
npm run test:e2e:extension
```

默认 E2E 命令会在浏览器 harness 中加载构建后的 content script。`npm run test:e2e:extension` 会运行真实扩展加载 E2E，并使用 `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` 或本地 Playwright 浏览器缓存中的 Chromium。
