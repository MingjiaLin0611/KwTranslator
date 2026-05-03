# Overseer Log

## M1 Initial Implementation

- Status: implemented.
- Expected checks: docs, tests, code modules, coverage threshold, extension build, E2E support.
- Known constraints: AI provider is interface-only in M1; dictionary import/export is schema and boundary only.

## Recorded Issues And Recoveries

- Initial TDD red run failed on missing core modules after test configuration was corrected. This was the expected implementation red state.
- `tsconfig` initially extended WXT generated config before `.wxt` existed. Fixed by making the root TypeScript config standalone.
- Vitest alias needed Windows-safe `fileURLToPath` handling.
- WXT content build did not reliably resolve `@` aliases in entrypoints on Windows. Extension entrypoints now use relative imports while tests keep the alias.
- Playwright Chromium download initially failed with `ECONNRESET`. Extension E2E now uses `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` or a Chromium executable already present in the local Playwright browser cache.
- `fs.cpSync` could terminate unexpectedly while copying extension output from the workspace path on Windows. Extension E2E now uses explicit recursive directory copying.
- Default E2E verifies the built content script through a browser harness. Real extension-loading E2E passes through `npm run test:e2e:extension` when a Playwright Chromium executable is available.
- SSH remote access still fails because port 22 is closed by the current network path. M1 commit and push use the HTTPS remote `origin-https`.

## Synchronization Check

- Specs updated: technical architecture, data structures, features, testing strategy, AI coding entry.
- Tests updated: unit tests for dictionary, matcher, scanner, injector; E2E harness plus real extension E2E entry.
- Code updated: core modules, WXT content entry, React popup, storage and AI provider boundaries.
