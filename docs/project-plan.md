# UCORN project plan

Plan revision: `agent-kit-update-r2`, 2026-10-13.
Mode: authorized documentation and agent setup only.

The original human request was “Use this template” with the Agent Kit repository
link. The current follow-up, “Agent-kit có update mới.”, steers that adoption to
the latest upstream guidance. The current main session continues AGENT-KIT-001
as a bounded documentation update. Future application work requires its own scope
and owner.

| Task | Owner / runtime | Branch / base commit | Ownership | Dependencies | Task record |
| --- | --- | --- | --- | --- | --- |
| AGENT-KIT-001 / r2: refresh Agent Kit guidance | Current Codex main session; coordinator and sole document writer | master / 5f80b457772b22a1f5fa989e0869cff7927fc0fc | AGENTS.md, README, affected imported guidance documents, manifest and existing setup records | Agent Kit 51b1c810a9920be7fe3957ce454fc25fedf7b155; existing UCORN adaptations | [AGENT-KIT-001](tasks/AGENT-KIT-001.md) |

Shared contracts: UCORN domain documents and application contracts remain the
current product sources. Skills are mirrored byte-for-byte between `.agents`
and `.claude`. Native adapters use each runtime's own format and inherited model
intent. The manifest records imported provenance and intentional local adaptations.

The maintenance plan authorizes no runtime feature, dependency, migration,
global configuration, paid service or deployment task. Git delivery was
authorized separately by the human after the maintenance checks passed.

Execution order: compare the pinned sources, merge affected guidance while
preserving UCORN rules, refresh source provenance, then run the existing agent
and domain validators plus link and preservation checks. Acceptance: both
upstream guidance changes are incorporated, all 23 skill packages and native
adapters retain their bytes, and domain/application files remain unchanged.

The r1 setup is historical and was included in repository commit `5f80b457`.
Its original source, authority and checks remain in the task/adoption records.

Delivery authorization, 2026-10-13: the human directly instructed “Commit và push
toàn bộ thay đổi cập nhật Agent Kit.” This covers all 18 reviewed update files,
one ordinary commit on the existing `master` branch, push to `origin/master`,
and remote SHA/divergence plus final worktree checks. It adds no application,
deployment, destructive-history or global-configuration authority.
