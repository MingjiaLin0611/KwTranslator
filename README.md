# KW Translator

KW Translator is a Chrome/Edge Manifest V3 extension for inline translation of English technical keywords.

Example output:

`This documentation is focusing on Software Engineering(软件工程).`

## M1 Focus

- WXT + React + TypeScript extension foundation.
- Framework-independent core modules for dictionary, matcher, scanner, and injector.
- Spec Driven Development plus Test Driven Development workflow.
- Unit tests, coverage gate, and E2E harness support.
- AI Coding entry with planner, executor, tester, and overseer roles.

## Commands

```bash
npm test
npm run test:coverage
npm run compile
npm run build
npm run test:e2e
```

The default E2E command runs a browser harness against the built content script. The real extension-loading E2E case is present but skipped unless `KW_E2E_EXTENSION=1` is set and Playwright Chromium is available.
