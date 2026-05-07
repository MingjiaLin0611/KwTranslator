# M3 技术架构

KW Translator 继续使用 WXT、React 和 TypeScript，目标环境仍是 Chrome / Edge Manifest V3。

## 架构

- WXT 负责扩展入口和 manifest 生成。
- Content script 负责初始化页面翻译控制器，并响应 popup 发来的启用状态和词库刷新消息。
- 核心模块继续隔离浏览器 UI：词汇表校验、合并、导入、导出和存储规则不能散落在 React 组件内。
- React popup 暂时承载完整 M3 管理功能，但数据模型和操作边界必须便于后续迁移到 options 页面。
- popup 中的管理结构为“词汇表列表 + 当前词汇表详情面板”。
- 词库变化时，popup 保存数据后通知当前活动 tab；content runtime 先恢复本次注入过的文本，再按最新词库重新注入。

## 核心模块

- `dictionary`：负责内置词库、M3 自定义词汇表创建、词条默认字段生成、导入解析、导出生成、多词汇表合并和冲突优先级。
- `storage`：负责保存和读取设置、自定义词汇表集合；M3 不把旧 `kwTranslator.userDictionary` 自动迁移进新集合。
- `runtime`：连接 storage、dictionary 和 injector，执行页面翻译，并提供启用、禁用和词库刷新控制。
- `messages`：定义 popup 与 content script 之间的启用状态消息和词库刷新消息。
- `popup`：提供总开关、只读统计、自定义词汇表列表和当前词汇表详情面板。
- `matcher`、`scanner`、`injector`：延续 M1/M2 的匹配、扫描和注入职责，不引入词汇表管理状态。

## 质量门槛

M3 继续采用 SDD 和 TDD。每个最小执行单元必须先确认相关规格，再写失败测试，再实现最小代码。每个单元完成后由 overseer 检查范围、文档、测试和代码同步情况，并在用户检查后单独提交。
