# M1 技术架构

KW Translator 通过 Manifest V3 面向 Chrome 和 Edge。项目使用 WXT、React 和 TypeScript。

## 架构

- WXT 负责扩展入口和 manifest 生成。
- React 只用于扩展自身拥有的 UI，例如 popup、options 和未来的调试页面。
- 网页扫描、关键词匹配、内容注入、存储契约和 AI provider 契约都放在独立的 TypeScript 模块中。
- Content script 调用核心模块，但不直接包含匹配规则或注入规则。

## 核心模块

- `dictionary`：校验内置词库，并为导入、导出和迁移保留边界。
- `matcher`：在纯文本中查找关键词匹配。
- `scanner`：收集可处理的 DOM 文本节点，并跳过不安全或无关区域。
- `injector`：将可处理文本节点重写为内联翻译，并防止重复注入。
- `storage`：为设置和未来用户词库保留持久化边界。
- `ai-provider`：保留模型 provider 契约，M1 不绑定真实服务。
- `harness`：保存用于测试的确定性 HTML 和词库样例。

## 质量门槛

开发流程结合规格驱动开发（SDD）和测试驱动开发（TDD）。规格描述预期行为，测试编码这些行为，然后再实现。核心模块行覆盖率必须保持在 80% 或以上。
