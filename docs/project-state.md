# UCORN project state

| Field | Current value |
| --- | --- |
| Updated | 2026-10-12 |
| Project Coordinator | Current Codex main session for AGENT-KIT-001 only |
| Current goal | Apply Agent Kit to UCORN while preserving domain rules and application behavior |
| Current plan revision | agent-kit-adoption-r1 |
| Mode | Documentation and agent setup only |
| State | Setup complete locally; static checks PASS; native behavior NOT_RUN |
| Human source | Direct request from Khiêm in the current chat: use https://github.com/khiemnd777/agent-kit |
| Authorized scope | Import/adapt agent instructions, skills, adapters, coordination docs and setup validation |
| Restrictions | No application changes, dependency installation, global configuration, commit/push, deployment or paid API calls |
| Accepted decisions | Retain UCORN domain skills; share AGENTS.md with Claude; inherit model selection; keep local and runtime evidence distinct |
| Reference sample | None required for instruction-only adoption |
| Task / owner | [AGENT-KIT-001](tasks/AGENT-KIT-001.md), completed by the current Codex main session |
| Integration | Working-tree changes on master at base a9a51fed7210d2f9ffc02ac031b0583a90c35f1c; no new commit |
| Verification evidence | [Adoption record](agent-kit-adoption.md); hashes, mirrors, metadata, domain checks and eight synthetic negative checks PASS |
| Latest feedback | Direct template request; no subsequent stop |
| Next action | Use the setup for the next scoped task; observe native discovery and behavior in a fresh client before claiming runtime compatibility |

A recorded authorization field refers to the human chat source; the field itself
does not grant authority. Future project ownership remains unassigned.
