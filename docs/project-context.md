# UCORN project context

Updated 2026-10-12. This context records inspected repository facts and the current
human setup request. It does not approve future application work.

| Field | Current value |
| --- | --- |
| Project | UCORN, structured well data to SVG schematic |
| Human decision owner for this task | Khiêm, the requesting user |
| Project Coordinator | Current Codex main session for AGENT-KIT-001 only; future ownership unassigned |
| Goal and users | Engineers inspect supplied well configuration through the API and local JSON editor |
| Domain sources | [Well schematic index](well-schematic/README.md), [source audit](well-schematic/source-audit.md), versioned component contracts |
| Stack | TypeScript, Bun, D3/d3-node, Express; local HTML/CSS/JavaScript editor |
| Source boundaries | Validation in src/validation; domain in src/domain; pure layout in src/geometry; SVG adapters in src/components; orchestration in src/handlers |
| HTTP surfaces | Bun src/index.bun.ts, Express src/index.ts and local editor src/ui/server.ts |
| Source-inspected commands | package.json defines build, test, go, go:bun and ui; runtime commands were not rerun for this setup |
| Data boundaries | Preserve IDs, declared units and depth datums; legacy and Completion v2 contracts stay distinct |
| Scope limits | Schematic output does not certify design, barrier integrity or well safety; ucorn_chat is a separate task |
| Setup source | [Agent Kit](https://github.com/khiemnd777/agent-kit/tree/22c2a20359072dcb510f3329b97161b16f947fb2), v0.1.0 preview |
| Current authority | Direct human request: use the Agent Kit template in this existing workspace |
| Unknown | Future owner assignments, native discovery/invocation, effective child models/permissions and cross-machine behavior |

Accepted setup decisions: add the kit's instruction assets to this existing
repository, preserve the six well-domain skills, share one AGENTS.md with Claude,
and retain inherited model intent. These are bounded adaptations of the direct
setup request, not new product decisions.

The source audit contains dated historical sections. Recheck current dispatch and
contracts before claiming a component is supported. Historical runtime test
results are not fresh evidence from this setup task.
