# M1 Testing Strategy

## Unit Tests

Unit tests cover dictionary validation, matching, DOM scanning, and inline injection. Core modules must maintain at least 80% line coverage.

Required scenarios:

- Single keyword injection.
- Multiple keyword injection.
- Case-insensitive matching.
- Phrase boundary matching.
- Duplicate injection prevention.
- Skipping code blocks, scripts, styles, inputs, and textareas.

## E2E Tests

E2E tests validate behavior on a deterministic page and do not depend on a real AI provider. The default E2E test loads the built content script into a browser harness so it can run reliably in local and CI environments. `npm run test:e2e:extension` runs the real extension-loading test with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` or a Chromium executable found in the local Playwright browser cache.

## SDD Gate

Behavior changes must update specs, tests, and implementation together. The overseer role checks this at milestone completion.
