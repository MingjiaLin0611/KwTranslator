# M2 技术架构

KW Translator 继续使用 WXT、React 和 TypeScript，目标环境仍是 Chrome / Edge Manifest V3。

## 架构

- WXT 负责扩展入口和 manifest 生成。
- Content script 只负责调用运行时入口，不直接保存匹配、合并或注入规则。
- 核心运行时读取设置和用户词库，合并词库后调用注入模块。
- React popup 负责基础控制面板、导入和导出入口。
- 持久化通过 `browser.storage.local` 完成，并由核心 storage 模块封装。

## 核心模块

- `dictionary`：校验、导入解析、导出生成和内置/用户词库合并。
- `storage`：保存和读取设置、用户词库。
- `runtime`：连接 storage、dictionary 和 injector，执行一次页面翻译。
- `matcher`：保留 M1 关键词匹配规则。
- `scanner`：保留 M1 DOM 文本节点筛选规则。
- `injector`：保留 M1 内联注入和重复注入防护。

## 质量门槛

M2 继续采用 SDD 和 TDD。新增行为必须先有失败测试，再实现最小代码。核心模块覆盖率必须保持在 M1 门槛以上。
