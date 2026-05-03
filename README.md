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
npm run test:e2e:extension
```

The default E2E command runs a browser harness against the built content script. `npm run test:e2e:extension` runs the real extension-loading E2E test and uses Playwright Chromium from `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` or the local Playwright browser cache.
