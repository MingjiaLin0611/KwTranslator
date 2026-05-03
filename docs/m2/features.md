# M2 Feature Specification

## Primary Feature

When KW Translator is enabled, it reads the builtin dictionary and imported user dictionary, scans eligible English technical text on the page, recognizes keywords or phrases, and injects Chinese translations inline.

Example:

`React improves Software Engineering workflows.`

After injection:

`React(反应式框架) improves Software Engineering(软件工程) workflows.`

## Secondary Features

- The popup shows enabled state, builtin dictionary version, builtin entry count, user entry count, and merged entry count.
- The popup can enable or disable inline injection.
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
