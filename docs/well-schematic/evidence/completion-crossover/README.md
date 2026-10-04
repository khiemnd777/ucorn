# Crossover evidence — 2026-10-04

Renderer: Completion v2 after component split, bounded point crossover.
Fixture: [synthetic completion crossover](../../../../sample-data/well-completion-crossover.json),
XO-01 / T01-S01→T01-S02 at 2800 m MD @ DEMO-RKB. All sources are synthetic.
Font: Arial/sans-serif, 12 px; local macOS Codex IAB, QA localhost:3002.

- [completion.svg](completion.svg): export 950×1325, seven completion components;
  solid crossover OD/ID walls meet tubing trimmed at the display glyph.
- [unknown.svg](unknown.svg): upper bore/fromConnection omitted; ID transition
  absent, labels/diagnostics explicitly unknown/unverified; [browser render](unknown.jpg).
- [desktop.jpg](desktop.jpg): viewport 1440×1000, Crossover sample success;
  full-page screenshot height reflects scrollable document.
- [mobile.jpg](mobile.jpg): viewport 390×844, toolbar wraps, fit preview.
- [mobile-actual.jpg](mobile-actual.jpg): actual-size preview with internal scroll.
- [detail.jpg](detail.jpg), [export.jpg](export.jpg): standalone SVG viewed at
  actual SVG dimensions; short crossover glyph and labels reviewed.
- [error.jpg](error.jpg): input at 2801 m rejected at `components[19].at`;
  Download disabled. Loading Crossover sample restores success and enables it.

Tests: 142 PASS / 792 assertions, 8 files; build and tsc --noEmit PASS. Structural
checks cover endpoint continuity, no lumen cap, short adjacent glyphs, unknown
bores, metadata, immutable inputs, units and escaped labels. Five prior completion
SVG fragments remain byte-identical; legacy cement random pattern excluded.
Both exported SVGs parse as XML, contain seven groups and finite lines without
dash attributes. Stroke color is not needed to distinguish crossover/unknown:
explicit type labels and connection/length/state text provide the meaning.

Visual review is local browser/export only. No real-device, operator UAT,
manufacturer profile/length validation, production or engineering certification.
IAB Download save-to-file was not exercised; artifacts were exported via handler.
