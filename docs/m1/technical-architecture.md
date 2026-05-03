# M1 Technical Architecture

KW Translator targets Chrome and Edge through Manifest V3. The project uses WXT, React, and TypeScript.

## Architecture

- WXT owns extension entrypoints and manifest generation.
- React is limited to extension-owned UI surfaces such as popup, options, and future debug pages.
- Web page scanning, keyword matching, injection, storage contracts, and AI provider contracts live in independent TypeScript modules.
- Content scripts call the core modules but do not contain matching or injection rules directly.

## Core Modules

- `dictionary`: validates bundled dictionaries and reserves import/export migration boundaries.
- `matcher`: finds keyword matches in plain text.
- `scanner`: collects eligible DOM text nodes and skips unsafe or irrelevant regions.
- `injector`: rewrites eligible text nodes with inline translations and prevents duplicate injection.
- `storage`: reserves persistence boundaries for settings and future user dictionaries.
- `ai-provider`: reserves model provider contracts without binding M1 to a real service.
- `harness`: stores deterministic HTML and dictionary cases for tests.

## Quality Gates

Development uses Spec Driven Development plus Test Driven Development. Specs describe the expected behavior, tests encode the behavior, then implementation follows. Core module coverage must stay at or above 80% line coverage.
