# M2 Feature Specification

## Primary Feature

When KW Translator is enabled, it reads the builtin dictionary and imported user dictionary, scans eligible English technical text on the page, recognizes keywords or phrases, and injects Chinese translations inline. The builtin dictionary covers foundational software engineering terms and common AI terminology.

Example:

`React improves Software Engineering workflows.`

After injection:

`React(反应式框架) improves Software Engineering(软件工程) workflows.`

AI example:

`Prompt Engineering helps Agents use RAG with a Large Language Model.`

After injection:

`Prompt Engineering(提示词工程) helps Agents(智能体) use RAG(检索增强生成) with a Large Language Model(大语言模型).`

## Secondary Features

- The popup shows enabled state, builtin dictionary version, builtin entry count, user entry count, and merged entry count.
- The popup can enable or disable inline injection.
- The popup toggle immediately notifies the current page: enabling translates immediately, and disabling restores text injected by this extension run.
- The popup can import JSON user dictionaries that match the `KeywordDictionary` schema.
- The popup can export the current user dictionary. It does not export the builtin dictionary.
- User dictionary entries take precedence when merged with builtin entries.

## Non-Goals

- Real AI provider integration.
- Sentence or full-page translation.
- Full user dictionary editing UI.
- Cloud sync.
- Full cross-browser compatibility beyond Chrome and Edge MV3.

## Role Split

- `planner`: maintains M2 specs, acceptance criteria, and test direction.
- `executor`: reviews risks, then implements dictionary enhancement, persistence, content runtime, and popup.
- `tester`: validates against M2 specs with unit tests, coverage, compile, build, and E2E.
- `overseer`: checks docs, tests, and code synchronization at M2 completion.
