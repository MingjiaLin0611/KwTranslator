# M2 Technical Architecture

KW Translator continues to use WXT, React, and TypeScript, targeting Chrome / Edge Manifest V3.

## Architecture

- WXT owns extension entrypoints and manifest generation.
- The content script only calls the runtime entrypoint. It does not own matching, merging, or injection rules.
- The core runtime reads settings and user dictionaries, merges dictionaries, then calls the injector.
- The core runtime maintains a page-level translation controller and records original text for modified text nodes so disabled state can restore them.
- The React popup owns the basic control panel, import, and export entrypoints.
- The popup writes enabled state to storage and sends `KW_TRANSLATOR_SET_ENABLED` to the current active tab.
- Persistence uses `browser.storage.local` behind the core storage module.

## Core Modules

- `dictionary`: validation, import parsing, export generation, and builtin/user dictionary merging.
- `storage`: settings and user dictionary persistence.
- `runtime`: connects storage, dictionary, and injector, then provides enable, disable, and apply-state controls.
- `matcher`: keeps M1 keyword matching rules.
- `scanner`: keeps M1 DOM text-node filtering rules.
- `injector`: keeps M1 inline injection and duplicate prevention.

## Quality Gate

M2 continues to use SDD and TDD. New behavior must start with a failing test before minimal implementation. Core module coverage must remain above the M1 threshold.
