# COMPLETION-005 — Seal interfaces and landing nipple

Updated: 2026-10-12. Plan: `completion-seals-r1`.
Owner: current main session, task-local writer and sequential reviewer.

Authorization: Khiêm directly requested “Tiến hành #1 và #2: Seal-Bore / PBR /
Seal Assembly và Landing Nipple / Lock Profile.” This authorizes the two bounded
completion cards, implementation, samples, tests and related documentation.
No stop received. Agent setup edits are preserved. No Git delivery or deployment.
Shared project setup context/plan/state remain outside this task ownership.

Scope: Completion v2 single concentric MD snapshot. Add separate `SealBore`,
`SealAssembly` and `LandingNipple` kinds. Use the existing metadata, diagnostics,
normalization, pure layout, SVG adapters and shared Bun/Express/editor transports.
Files owned: new domain/validation/layout/SVG modules for these kinds; necessary
integration in completion model/validator/layout/handler; one editor sample/button;
focused and transport tests; two catalog cards, tracker, contract, source register,
domain validator and task-local evidence. No dependencies or legacy migration.
The validator's pinned manifest hash is updated to match the two new implemented
catalog cards; all other agent-setup assets and shared project state are preserved.

Plan and acceptance:
1. Define bounded contracts and write failing tests from observable invariants.
2. Implement receptacle and seal engagement without adding tubing length. Validate
   explicit liner/packer owner, host coverage, dimensions, lifecycle and references.
3. Implement the nipple as an owned physical tubing segment with a separate internal
   profile. No insert tool, plug or profile compatibility is inferred.
4. Integrate sample/API/editor and check invalid data, units, exact boundaries,
   repeated components, overlap, unknown data, immutability and component reordering.
5. Run tests, build, typecheck, docs validation and sequential review. Inspect fresh
   desktop/mobile rendered UI and exported SVG. Report each evidence limit.

Engineering unknowns: equipment profiles/mating, ratings, seal compression,
stroke allowance, hydraulic sealing, lock suitability and installed insert state.
Geometry and declared engagement do not establish those facts.

Baseline: typecheck PASS. Sandbox prevents localhost HTTP test servers; the
unrestricted localhost run is recorded separately. No independent agent review.
Model/effort not overridden. Human controls TechNote level progression.

State: VERIFIED_LOCAL; task implementation and applicable local gates complete.
Working tree only. No Git delivery or deployment.

## Verification and handoff

- Baseline unrestricted localhost suite: 197 PASS / 999 assertions.
- RED: new contract tests failed before runtime support.
- Final `bun run test`: 243 PASS / 1209 assertions, 10 files. New focused suite
  has 44 tests; all four HTTP transports use real renderer and structured failures.
- `bun run build`, `./node_modules/.bin/tsc --noEmit`,
  `python3 docs/well-schematic/validate_docs.py .`, `git diff --check`: PASS.
- Previous four completion fixture layouts match pre-change HEAD exactly.
- [Contract](../well-schematic/completion-seals.md) and
  [visual evidence](../well-schematic/evidence/completion-seals/README.md) describe
  fields, sample, main/detail geometry, states, sources and known boundaries.
- Sequential source review found and fixed adjacent coupling occlusion and loss
  of known no-go diameter when bore IDs are absent. Regression tests demonstrate
  both cases. Error feedback now isolates blocking diagnostics from warnings.
- No independent agent review, physical mobile device, operator UAT, production,
  standalone Node server process or browser save-to-file download verification.

Next action: human review of the bounded result. Expansion Joint and Control /
Chemical Line / Gauge Cable remain NOT_SELECTED and outside this task.
