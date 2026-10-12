# Completion seal interfaces and landing nipple — Phase 5

Date: 2026-10-12. Scope selected directly by Khiêm: `seal-bore` and
`landing-nipple`. Contract revision: `completion-seals-r1`, additive schemaVersion 2.
Actor: existing local JSON/API user. No new persistence, permissions or workflow.

## Bounded contract

All kinds require existing Completion v2 `id`, optional `label`, `lifecycle`,
`verification`, `sources`. Length/depth quantities use m/ft; diameters use in/mm.
The snapshot supplies MD and datum. Unknown dimensions/profiles remain unknown.

| Kind | Fields and meaning |
| --- | --- |
| `SealBore` | `variant`: `seal-bore` or `pbr`; explicit `ownerId` to a liner or non-liner-top CompletionPacker; `top`, `bottom`, supplied body `od`, optional `innerDiameter`, optional `profile` text. |
| `SealAssembly` | `tubingId`, `segmentId` identify an existing physical segment; `receptacleId` references SealBore; `top`, `bottom` describe the seal interval within that segment; `engagement`: `engaged`, `partial`, `disengaged`, `unknown`; optional `profile`. |
| `LandingNipple` | `tubingId`, `segmentId` own one existing physical tubing segment; `profileType`: `selective`, `no-go`, `ported`, `unknown`; optional `profile`, `sealBoreDiameter`, `noGoDiameter`. No insert kind is supplied by this slice. |

A receptacle is bounded to the supplied liner bore or tubing-packer interval and
outer host. Its body is contained in that bore, rather than replacing a casing
interval or constructing a manufacturer assembly. Integral liner-top/PBR geometry,
cross-string assemblies and movement simulation are outside this slice.

Assembly/nipple lengths already belong to tubing. They add no physical length.
Only one physical tool owns each segment, including existing PupJoint. Assembly
seal intervals may be longer than their receptacle. Overlap is derived from the
two intervals. `engaged` requires positive overlap; `partial` requires positive
overlap smaller than the shorter interval; `disengaged` requires no overlap.
`unknown` preserves state uncertainty even when geometric overlap is known.
These are UCORN geometric consistency rules, not operational seal criteria.

## Validation and compatibility

Reject invalid units/numbers, missing version/datum, duplicate IDs, dangling refs,
invalid intervals, owner/host mismatch, impossible supplied fit, lifecycle conflicts,
duplicate segment/receptacle occupancy and unsupported overlapping equipment.
No-go diameter is only accepted for a no-go profile and cannot exceed seal-bore
diameter or supplied segment ID. Profile strings never prove equipment mating.
Missing bore/profile/no-go dimensions produce visible unresolved diagnostics.

Payloads without these kinds keep their existing completion output. Legacy input
semantics remain separate. All four transports use the same validator/handler.

## Rendering and acceptance

Pure layout preserves true MD intervals. Receptacle walls, assembly seal markers
and nipple internal profiles use distinct solid-line conventions and open lumen.
Separate detail insets are labelled **Detail · not MD scale**. Short tools stay at
true MD in the main drawing. Labels identify owner, references, dimensions, datum,
declared state, geometric overlap, lifecycle and unresolved compatibility/insert.
Text is escaped. Input and component order do not change physical results.

Runnable sample: [seal interfaces and nipple](../../sample-data/well-completion-seals.json).
Tests: [domain and layout regression](../../tests/completion-seals.test.ts),
[HTTP transport checks](../../tests/completion-http.test.ts).
[Rendered evidence](evidence/completion-seals/README.md).
Both catalog cards: **implemented / VERIFIED_LOCAL** within this bounded contract.

## Technical sources

Read directly on 2026-10-12: SLB [sealbore](https://glossary.slb.com/en/terms/s/sealbore),
[seal receptacle](https://glossary.slb.com/en/terms/s/seal_receptacle),
[seal assembly](https://glossary.slb.com/en/terms/s/seal_assembly),
[landing nipple](https://glossary.slb.com/en/terms/l/landing_nipple).
These support general function only. The candidate polished-bore URL and product
sheet fetch failed; no model dimensions, stroke or ratings were adopted.
Profile geometry, attachment constraints and overlap checks above are UCORN
conventions. Equipment suitability and hydraulic sealing remain unverified.

## Verification — 2026-10-12

243 tests / 1209 assertions PASS; build/typecheck/docs validation/diff check PASS.
Desktop/mobile, error recovery, exported SVG, unknown data, long labels and
monochrome reviewed locally. Prior fixture layouts remain unchanged against HEAD.
The validator's implemented-card allowlist and pinned manifest hash are updated
together; existing agent-setup assets are preserved. See task/evidence for limits.
