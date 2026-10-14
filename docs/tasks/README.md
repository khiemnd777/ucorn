# Task records

Create one `TASK-ID.md` per actual task only when documentation writes are authorized. The assigned Task Owner maintains that file on their branch. Use the [assignment and state templates](../agent-coordination-templates.md).

Current Agent Kit task: [AGENT-KIT-004 / approved U2](AGENT-KIT-004.md). Completion tasks retain their own scope and owners.
Prior approved correction: [AGENT-POLICY-002 / P1](AGENT-POLICY-002.md).
Historical tasks: [AGENT-KIT-001](AGENT-KIT-001.md) and
[COMPLETION-005](COMPLETION-005.md). Read their dated corrections before using
their authority fields. Historical results or agent-written fields cannot supply
approval for a new task. During Planning, keep the proposed task/plan in chat;
create or update its record only after human approval covers those writes.

A task record contains:
- Goal, plan revision, human approval source and latest stop.
- Developer owner, runtime/role, branch/base commit and exact file ownership.
- Dependencies, agreed contracts and acceptance criteria.
- Model routing intent and observed model/capabilities where available.
- Actual check commands/results, feedback, findings and limits.
- Handoff branch/commit, receiver and concrete next action.

Keep one current task state with traceable history. The coordinator indexes tasks in project-plan and summarizes integration in project-state. Task owners do not edit shared state without assigned ownership.

Example naming: `TASK-001.md`. No example task or approval is pre-created in this template.

- [AGENT-KIT-004](AGENT-KIT-004.md): approved U2 adoption of 8fedcd0; proportionate verification/provenance, preserving completion work; no Git delivery.
