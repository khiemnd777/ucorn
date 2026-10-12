# UCORN project plan

Plan revision: `agent-kit-adoption-r1`, 2026-10-12.
Mode: authorized documentation and agent setup only.

The direct human request is: “Use this template” with the Agent Kit repository
link. The current main session owns this setup slice. Future application work
requires its own task scope and owner.

| Task | Owner / runtime | Branch / base commit | Ownership | Dependencies | Task record |
| --- | --- | --- | --- | --- | --- |
| AGENT-KIT-001: adopt Agent Kit | Current Codex main session; coordinator and setup writer | master / a9a51fed7210d2f9ffc02ac031b0583a90c35f1c | Agent instructions, skill/reference imports, native adapters, shared setup docs, README, local-state ignores and docs validators | Agent Kit 22c2a20359072dcb510f3329b97161b16f947fb2; existing UCORN instructions and six domain skills | [AGENT-KIT-001](tasks/AGENT-KIT-001.md) |

Shared contracts: UCORN domain documents and application contracts remain the
current product sources. Skills are mirrored byte-for-byte between `.agents`
and `.claude`. Native adapters use each runtime's own format and inherited model
intent. The manifest records imported provenance and intentional local adaptations.

No runtime feature, dependency, migration, Git delivery, global configuration,
paid service or deployment task is authorized by this plan.
