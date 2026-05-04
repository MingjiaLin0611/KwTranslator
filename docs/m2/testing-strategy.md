# M2 Testing Strategy

## Unit Tests

Unit tests cover:

- Dictionary import: valid JSON, invalid JSON, incompatible schema, missing fields, duplicate keywords.
- Dictionary merge: user entries override builtin entries with the same keyword.
- Dictionary export: exported JSON includes `exportedAt`.
- Storage: default settings, saved settings, saved and loaded user dictionary.
- Runtime: disabled state skips injection, enabled state injects with merged dictionaries, missing `body` exits safely, disabled state restores injected text, and re-enabled state injects again.
- Popup: status/count rendering, enabled toggle, current-tab enabled-state message, saved settings when messaging fails, valid import, invalid import does not replace the existing dictionary.

## E2E Tests

The default E2E test continues to use the browser harness with the built content script. E2E covers translation enabled, disabled restoration, and re-enabled translation. Real extension E2E can run when Chromium is available.

## Manual Page Verification

`manual-test/run-toggle-verification.mjs` verifies the static HTML page and the real webpage `https://huggingface.co/blog/sensenova/neo-unify`, saving screenshots for enabled, disabled, and re-enabled states.

## Gate Commands

```bash
npm test
npm run test:coverage
npm run compile
npm run build
npm run test:e2e
npm run test:e2e:extension
```

`npm run test:e2e:extension` requires local Chromium or `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.
