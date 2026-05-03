# M1 Feature Specification

## Primary Feature

KW Translator reads eligible web page text and injects Chinese translations inline after matched English technical keywords.

Example:

`This documentation is focusing on Software Engineering(软件工程).`

## Secondary Features

- Extension popup shows enabled status and bundled dictionary version.
- Core modules expose debug records that can be used by a future developer panel.
- Data contracts reserve import and export of dictionaries.
- AI provider contracts reserve future AI keyword translation without making network calls in M1.

## Non Goals

- Full sentence or full page translation.
- Real AI provider integration.
- Cloud sync.
- Full user dictionary editing UI.
- Cross-browser compatibility beyond Chrome and Edge MV3.
