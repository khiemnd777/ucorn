# UCORN project context

Updated 2026-10-13. Current task: [AGENT-KIT-003 / U1](tasks/AGENT-KIT-003.md).
This context records repository facts and approval provenance; it does not itself
approve work. Historical setup/update authority interpretations are corrected in
the [adoption record](agent-kit-adoption.md#policy-correction--2026-10-13).

| Field | Current value |
| --- | --- |
| Project | UCORN, structured well data to SVG schematic |
| Human decision owner for this task | Khiêm, approver of the presented U1 plan via “Approve option 1.” |
| Project Coordinator | Current Codex main session for AGENT-KIT-003 / U1 only; future ownership unassigned |
| Goal and users | Engineers inspect supplied well configuration through the API and local JSON editor |
| Domain sources | [Well schematic index](well-schematic/README.md), [source audit](well-schematic/source-audit.md), versioned component contracts |
| Stack | TypeScript, Bun, D3/d3-node, Express; local HTML/CSS/JavaScript editor |
| Source boundaries | Validation in src/validation; domain in src/domain; pure layout in src/geometry; SVG adapters in src/components; orchestration in src/handlers |
| HTTP surfaces | Bun src/index.bun.ts, Express src/index.ts and local editor src/ui/server.ts |
| Source-inspected commands | package.json defines build, test, go, go:bun and ui; application tests/build/runtime are outside U1 |
| Data boundaries | Preserve IDs, declared units and depth datums; legacy and Completion v2 contracts stay distinct |
| Scope limits | Schematic output does not certify design, barrier integrity or well safety; ucorn_chat is a separate task |
| Setup source | [Agent Kit](https://github.com/khiemnd777/agent-kit/tree/ea72429b4c3cd80296b7ad75139431eb944aa319), v0.1.0 preview; source history retains 22c2a203 and 51b1c810 |
| Current authority | U1 approval plus later direct “Commit và push toàn bộ thay đổi P1 và U1 lên origin/master.”; combined 25-file ordinary Git delivery and final checks only; no future task authority |
| Discovery scope | Current runtime catalog lists the project skills and kit agent types; U1 changes authored definitions and does not verify native reload/invocation or effective sources/permissions |
| Unknown | Fresh-client approval behavior, effective child models/permissions, Claude/two-machine behavior and future owner assignments |

Historical setup choices: add the kit's instruction assets to this existing
repository, preserve the six well-domain skills, share one AGENTS.md with Claude,
and retain inherited model intent. Preserve these assets in U1, with the four
Explorer/Reviewer adapters updated as approved. The earlier
inference that direct setup requests supplied plan approval is superseded by the
dated correction; retaining assets does not retroactively approve execution.

Maintenance revision `agent-kit-update-r2` incorporates the two upstream commits:
adaptive reports and repair/stop/review guidance. The skill packages, native
definitions, domain documents and application remain outside this document
update's writes. That maintenance revision and its later Git authorization are
historical, not authority for this task. P1 restores the pinned source's approval
boundary without changing the source version at that time. Its local result is
retained in [AGENT-POLICY-002](tasks/AGENT-POLICY-002.md). U1 updates the source pin
and role responsibilities; it does not change the Planning/approval clauses,
stack, well contracts, skills or implementer definitions. Omitted adapter
permission fields inherit runtime settings; they do not grant task authority or
change the calling session's sandbox. Effective child behavior remains Unknown.

The source audit contains dated historical sections. Recheck current dispatch and
contracts before claiming a component is supported. Historical runtime test
results are not fresh evidence from this setup task.
