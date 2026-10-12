# Completion seal interfaces / Landing Nipple — local evidence

Date: 2026-10-12. Task: [COMPLETION-005](../../../tasks/COMPLETION-005.md).
Contract: [Phase 5](../../completion-seals.md). Synthetic fixture:
[well-completion-seals.json](../../../../sample-data/well-completion-seals.json).
Platform: Codex IAB on macOS, Arial/sans-serif. Desktop 1440×1000;
mobile viewport 390×844. This is local rendered evidence, not physical-device UAT.

## Checks and results

- Full suite: `bun run test` PASS 243 tests / 1209 assertions across 10 files.
  Focused suite: 44 tests for contracts, graph/fit/state, quantities, ownership,
  adjacent connector profiles, repeated nipples, unknowns and escaped labels.
- Bun root/hole, Express hole and editor hole integration: real rendering 200;
  invalid references/engagement: 400 with field paths. Sample GET/HEAD only.
- Build, no-emit typecheck, domain docs validation and diff check: PASS.
- Four prior fixture layouts compare exactly with pre-change HEAD layout after
  removing the three new empty output arrays. No new components preserves output.
- Six SVG fixtures parse as XML with finite numeric primitives. Completion
  export is 1090×2099. Labels and detail lanes reviewed without clipping.
- Desktop/mobile new sample button loads and generates the intended kinds.
  Mobile page width equals 390 px. Actual size overflows only within preview
  (canvas client width 364 px, scroll width 1126 px), not the page.
- Invalid declared disengagement reports `components[21].engagement`, disables
  download and marks generation failed. Restoring valid input regenerates and
  enables download. Browser errors/warnings log was empty during valid review.
- Partial SVG displays 5 m geometric overlap; disengaged SVG displays 0 m.
  Unknown fields stay unknown, long XML-sensitive labels are escaped/wrapped,
  and monochrome retains distinct open symbols and text states.

## Artifacts

| Artifact | Evidence |
| --- | --- |
| [Desktop](desktop.jpg) / [mobile](mobile.jpg) | Fresh editor rendering and responsive controls |
| [Mobile Actual size](mobile-actual-size.jpg) | Internal preview scroll |
| [Invalid engagement](invalid-engagement.jpg) | Blocking field path and disabled download |
| [Export](completion.svg) / [full render](export.jpg) / [detail](detail.jpg) | Receptacle walls, assembly markers, nipple profile and open lumen |
| [Partial](partial.svg) / [render](partial.jpg) | Explicit partial state and 5 m overlap |
| [Disengaged](disengaged.svg) / [render](disengaged.jpg) | Explicit disengaged state and 0 m overlap |
| [Unknown state](unknown.svg) | Declared uncertainty remains distinct from geometry |
| [Unknown data](unknown-data.svg) / [detail](unknown-detail.jpg) | Missing IDs/profiles and long special-character labels |
| [Monochrome](monochrome.svg) / [detail](monochrome-detail.jpg) | Symbol/label readability without relying on color |

## Limits

HTTP suites need localhost binding outside the restricted sandbox; the original
sandbox baseline failed to bind before changes, then unrestricted baseline passed.
Review was sequential in the main session. No independent agent review ran.
Browser SVG save-to-file download, physical mobile device, operator UAT, production
and a standalone Node process remain NOT_RUN. Legacy random cement patterns mean
whole-SVG byte hashes are not a determinism gate. New normalized model/layout is
tested separately. Equipment mating, stroke, seal compression, hydraulic sealing,
ratings, installed insert state and engineering approval remain unknown.
