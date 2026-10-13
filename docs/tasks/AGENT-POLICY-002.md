# AGENT-POLICY-002 — Restore Agent Kit approval policy

Updated: 2026-10-13. Approved plan: **P1**, revision `agent-policy-p1`.
State: documentation/static acceptance complete locally; fresh-client behavior NOT_RUN.
The later [P1/U1 Git delivery approval](#git-delivery-authorization--2026-10-13)
supersedes this task's earlier no-commit/push restriction for that delivery only.
Owner: current Codex main session, coordinator and sole writer for this task.
Branch/base: `master` / `50f0118b36385816323ace57c8795b075c44c0b1`.
The worktree was clean before execution. Future project ownership is unassigned.

## Assignment and authorization

Goal: restore the original Agent Kit Planning → human approval → execution
boundary across UCORN instructions and records. Preserve autonomous routine
work and repairs within a still-valid approved approach.

Human source: Khiêm reviewed the concrete P1 plan in this chat, then instructed:

> Approve P1. Đưa Agent Kit trong UCORN về đúng policy gốc như kế hoạch, kiểm tra đầy đủ. Chưa commit hay push.

This approval covers the document corrections and local checks below. Latest
restriction: **no commit or push**. No later stop has been received. The written
record refers to that human message; it does not independently create authority.
P1 does not retroactively approve earlier adoption or completion implementation.

Owned files:

- `AGENTS.md`, `README.md`.
- `docs/team-policy.md`, `docs/team-workflow.md`, `docs/verification-guide.md`.
- `docs/project-context.md`, `docs/project-plan.md`, `docs/project-state.md`.
- `docs/agent-kit-adoption.md`, `docs/skills-manifest.json`.
- `docs/tasks/README.md`, `docs/tasks/AGENT-KIT-001.md`,
  `docs/tasks/COMPLETION-005.md`, and this task record.

Allowed: task-local document writes, bounded source/Git inspection, existing
documentation validators, link/anchor and syntax checks, pinned-source comparison,
preservation checks and sequential review. Preserve other work.
Excluded: application/validator code, application tests, samples, dependencies,
domain contracts, all skill packages and native definitions, global configuration,
installations, application execution, external writes, Git mutation and deployment.
No delegation, new chats or messages to other chats are authorized by P1.

## Sources and accepted approach

Agent Kit source: `51b1c810a9920be7fe3957ce454fc25fedf7b155`, the existing
[manifest pin](../skills-manifest.json). No upstream version update is included.
The local Agent Kit checkout supplies Git objects for exact source comparisons.

Verified investigation: `Review agent-kit template` treated “Agent-kit có update
mới.” as maintenance authority. `Tiếp tục danh sách completion` offered to develop
the selected entries into a concrete implementation plan, then treated “Tiến hành
#1 và #2…” as implementation approval without presenting that plan for review.
The agent-written authorization fields are historical interpretations, not proof
of a plan approval. Later explicit commit/push instructions cover their stated
Git scope only. Preserve historical outputs/checks and add dated corrections.

The core policy's approval section and AGENTS.md approval/execution section must
match the pinned source exactly. UCORN-specific domain instructions govern well
meaning and rendering, not an exception to the approval boundary. Engineering
skill examples about saving plans or executing checks yield to that boundary.

## Ordered work and acceptance

1. Restore canonical approval clauses; remove conflicting direct-request/setup
   exemptions and align domain workflow writes/checks with approved scope.
2. Correct current ownership/state; annotate historical authority interpretations
   without deleting historical evidence or inventing retroactive approval.
3. Align README and verification instructions; refresh only changed local hashes
   after source review, retaining original source commit and digests.
4. Run existing validators, syntax, links/anchors, source/preservation/diff checks
   and sequential review. Prepare fresh-client behavior scenarios and report limits.

Acceptance:

- Every current entrypoint starts new work in Planning and waits for human approval
  of the presented current plan/task scope before writes, execution or assignment.
- Selection, update notices, saved records and status labels do not supply missing
  approval. Routine repairs remain autonomous within valid approval.
- Material approach changes and stops retain their original approval boundaries.
- Claude shares AGENTS.md; all 23 skills, six native definitions, role documents,
  coordination templates, domain/application assets and validators retain bytes.
- Only owned documentation/provenance files change; base HEAD and index stay intact.
- Static results and fresh-client behavioral results remain separate.

## Verification and review

Check owner: this session. Checks performed on 2026-10-13:

| Check | Actual result | Evidence and limit |
| --- | --- | --- |
| `PYTHONDONTWRITEBYTECODE=1 python3 docs/validate_agent_setup.py .` | PASS | 23 skills per root, 103 maintained files, 39 mirrors, three native definitions per runtime; static integrity only |
| `PYTHONDONTWRITEBYTECODE=1 python3 docs/well-schematic/validate_docs.py .` | PASS | Six domain skills, 64 component cards, sources and internal links |
| Pinned policy comparison, inline Python using `git show 51b1c810:<path>` from the local Agent Kit checkout | PASS | AGENTS.md Approval and execution and team-policy.md Approval and autonomy sections match the original text exactly |
| Source provenance comparison, inline Python | PASS | Every recorded original kit digest matches the pinned Git object; source commit/history/inventory retained; only five reviewed local hashes/adaptation descriptions changed |
| Complete local Markdown link/anchor check, inline Python | PASS | 556 references across all 114 Markdown documents under docs, .agents, .claude and the three root documents; checks target containment/existence and heading anchors, including duplicate headings; no external HTTP check |
| YAML parsing with `ruby -rpsych` and required identity/interface fields | PASS | 61 unchanged metadata files: 46 skill frontmatters, 12 domain UI metadata files, three Claude agent frontmatters |
| Native syntax with Python `tomllib.loads` | PASS | Three unchanged Codex TOML definitions parse; no invocation/enforcement claim |
| `git diff --check` | PASS | Changed tracked Markdown/JSON has no whitespace errors; new task checked separately |
| Ownership/history/preservation check, inline Python using Git and local files | PASS | Exactly 14 owned files, one new task; historical task bodies retained verbatim from their original Updated field; protected tracked assets unchanged |
| Git boundary check | PASS | HEAD stays at base 50f0118; index empty; no commit/push or other Git mutation performed |

Fresh-client scenarios: [V26–V30](../verification-guide.md#planning-and-approval-regressions-v26v30).
Behavioral replay, child permission enforcement and two-machine checks: NOT_RUN.
P1 prepares those checks; it does not authorize a new chat or native delegation.
Application tests/build: NOT_RUN; application behavior and code are outside P1.
Review: sequential in this session, not independent. No unresolved findings in
the documentation/static scope. Reviewed the canonical section parity, conflicting
authority clauses in current entrypoints, historical corrections, current owner/
scope, preservation, provenance and evidence limits. The original repair/material
change/stop clauses are unchanged. Historical requests/technical checks retain
their meaning and cannot supply missing approval. Engineering skill examples
yield to policy; no keyword parser, runtime gate, dependency or configuration was
added. Security/data checks and actual runtime actors are unchanged. Runtime
performance and application testing are not applicable to document-only edits.
Model/effort inheritance retained; effective runtime model/effort: Unknown.

## Handoff

Result: P1 documentation/static acceptance is complete locally. Khiêm receives
the local diff and evidence. HEAD remains the starting commit; changes are not
staged, committed or pushed. Fresh-client approval behavior is not verified.
Next: human review and, when explicitly authorized, observation of V26–V30 in a
fresh client conversation. Git delivery remains prohibited. No new application
work, chat creation, delegation or external action is pending inside P1.

## Git delivery authorization — 2026-10-13

After both P1 and U1 completed locally, Khiêm directly instructed:

> Commit và push toàn bộ thay đổi P1 và U1 lên origin/master.

This separately authorizes the combined 25-file P1/U1 payload and its delivery
records: stage those exact files, review the staged content, make one ordinary
commit on the existing master branch, push to origin/master, then verify remote
SHA/divergence and final worktree status. No force push, history rewrite, branch
switch, unrelated write or new application/native work is authorized.

The current U1 coordinator performs this combined delivery. Original P1 local
results and its initial no-Git scope remain historical. This later approval does
not retroactively authorize earlier unapproved implementation. Actual delivery
outcomes are established by Git history and the closing report, not this approval
record included in the commit. Delivery authority ends after the scoped checks.
