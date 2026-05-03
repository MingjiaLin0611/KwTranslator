# M1 功能规格

## 主要功能

KW Translator 读取网页中可处理的文本，并在匹配到英文技术关键词后以内联形式注入中文翻译。

示例：

`This documentation is focusing on Software Engineering(软件工程).`

## 次要功能

- 扩展 popup 显示启用状态和内置词库版本。
- 核心模块暴露调试记录，供未来开发者面板使用。
- 数据契约为词库导入和导出保留边界。
- AI provider 契约为未来 AI 关键词翻译保留能力，但 M1 不发起网络调用。

## 非目标

- 整句或整页翻译。
- 真实 AI provider 集成。
- 云同步。
- 完整的用户词库编辑 UI。
- Chrome 和 Edge MV3 之外的完整跨浏览器兼容。
