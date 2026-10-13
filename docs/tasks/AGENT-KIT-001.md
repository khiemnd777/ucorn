# AGENT-KIT-001 — Adopt Agent Kit in UCORN

Historical revision: `agent-kit-update-r2`, 2026-10-13. The r1/r2 records below
preserve the earlier agent's interpretations, writes and checks. They do not
grant current authority. See the [approval correction](#approval-correction--2026-10-13)
before relying on any authorization field. Current policy work belongs to
[AGENT-POLICY-002 / approved P1](AGENT-POLICY-002.md).
Git delivery was separately authorized after maintenance; see
[delivery authorization](#git-delivery-authorization--2026-10-13).

## Approval correction — 2026-10-13

Source: read-only audit of `Review agent-kit template` and Khiêm's subsequent
approval of P1 in this chat. The historical adoption changed the original kit's
Planning/approval clauses to treat direct bounded requests as execution authority.
That deviation is superseded by [P1](AGENT-POLICY-002.md).

For the r2 update, the inspected thread shows “Agent-kit có update mới.” followed
by the agent's implementation announcements and writes, without a concrete update
plan presented for human approval. The authorization statement below was the
agent's interpretation; it is not evidence of an approved maintenance plan.
The original “Use this template” request likewise was treated as setup authority;
the inspected adoption turn contains no separate approval of a presented plan.

The later explicit “Commit và push…” instruction authorized its stated Git
delivery only. It does not retroactively approve the earlier edits. Preserve
historical check/output facts; static acceptance does not establish approval
compliance. P1 neither rolls back those assets nor grants new Git authority.

## Historical adoption and maintenance records

Updated: 2026-10-12. Plan: `agent-kit-adoption-r1`.
State: Setup complete locally; static acceptance checks PASS. Working tree: `master`, base
`a9a51fed7210d2f9ffc02ac031b0583a90c35f1c`.

## Assignment and authorization

Goal: make the requested template available in the existing UCORN workspace
without replacing well-domain guidance or changing application behavior.
The direct human source is Khiêm's current-chat request, “Use this template”,
linked to https://github.com/khiemnd777/agent-kit. This is scoped setup authority;
no earlier approval or template status is used as authority.

Owner: current Codex main session, acting as coordinator and setup writer for
this task only. No subagents were assigned. Review is sequential in this session.
Future project-wide ownership is unassigned.

Owned files: `AGENTS.md`, `CLAUDE.md`, `README.md`, task-local `.gitignore` entries,
new kit assets under `.agents`, `.claude` and `.codex/agents`, new shared setup
documents under `docs`, and docs validators. Existing six `.agents/skills/well-*`
packages and `docs/well-schematic` domain content are preserved; only the domain
validator's skill routing changes. Application source, tests, samples and
dependency/lockfiles are outside ownership.

Allowed checks: bounded read-only Git inspection, template download/inspection,
local file edits, static integrity/metadata/link checks and temporary synthetic
negative checks for the validator. No application execution, installations,
Git mutation, global configuration, paid services or deployment. No stop received.

## Inputs and decisions

- Agent Kit v0.1.0 preview, commit `22c2a20359072dcb510f3329b97161b16f947fb2`.
- Current UCORN instructions, package scripts, domain index, source audit and handler boundaries.
- Selected setup workflows: skill-creator, git-workflow and official OpenAI documentation for native agent schema.
- Add 17 kit skills alongside six UCORN domain skills; mirror all 23 for Claude.
- Keep copied skill/reference bytes and MIT notices, with manifest provenance.
- Adapt planning/approval rules to the human task request and UCORN application approval boundaries.
- Native adapters retain model inheritance intent; no model or effort is pinned.

Observed effective model/effort: Unknown; no runtime metadata was inspected.
Authored child restrictions do not prove effective read-only enforcement.

## Acceptance and verification

1. All imported assets match the pinned template except declared local adaptations.
2. All six existing domain skill packages retain their original bytes.
3. Both skill roots contain the same 23 logical skills and matching references.
4. Three Codex and three Claude definitions have valid metadata and model intent.
5. Domain docs checks retain card/source/link coverage and tolerate the kit inventory.
6. Shared context, task index and state describe UCORN and the direct setup source.
7. Product source, tests, samples and dependencies remain unchanged.
8. Native discovery, invocation, permissions and cross-machine checks remain separate from static evidence.

Check owner: the current session. Results and limitations are maintained in the
[adoption record](../agent-kit-adoption.md). Native agents and a second client are
not invoked merely to claim setup completion. Missing runtime checks are NOT_RUN.

## Handoff

No commit or push is authorized. Current result remains local working-tree
changes at the stated base commit. Static package, metadata, mirror, domain,
preservation and eight negative checks passed; see the adoption record for
commands and exact limits. No independent agent reviewer ran.

Next action: use the setup on the next scoped task. Native discovery/invocation,
effective model and permission behavior, and a Claude/two-machine run remain
NOT_RUN. Verify those in a fresh client before claiming runtime compatibility.
No app feature or Git delivery is pending within this setup scope.

## Maintenance update — 2026-10-13

Plan: `agent-kit-update-r2`. Branch/base: `master` /
`5f80b457772b22a1f5fa989e0869cff7927fc0fc`. State: documentation update complete
locally; static checks PASS. The worktree was clean before this update.

Human source: the current-chat follow-up, “Agent-kit có update mới.”, continues
the original template-adoption request. The interpretation is routine local
guidance maintenance; no application, delivery or production authority is inferred.
No later stop received. The current main session continues as AGENT-KIT-001's
coordinator and sole writer; no delegation or independent review ran.

Scope: update `AGENTS.md`, `README.md`, imported policy/workflow/role/coordination/
TechNote/catalog/verification guidance, `docs/skills-manifest.json`, and existing
project/task/adoption records. Skill packages, native adapters, domain documents,
application source, samples, tests, lockfiles, configuration and validator code
are preserved. The direct task permits static verification of these boundaries.

Inputs: old pin `22c2a20359072dcb510f3329b97161b16f947fb2`; current pin
`51b1c810a9920be7fe3957ce454fc25fedf7b155`, including `8b70cd4` adaptive reporting
and `51b1c810` repair/stop/review guidance. All 78 latest template source digests
were checked before merging. Ten imported documents merged without conflicts;
UCORN entrypoint/README reporting links are adapted separately.

Acceptance: include both guidance changes, preserve UCORN's bounded-request and
application-plan approval rules, retain all skills/native definitions and domain
content, and pass the current agent/domain/hash/link/scope checks. Original
upstream verification results remain evidence for Agent Kit, not UCORN authority.

Selected/read workflows: using-agent-skills, documentation-and-adrs and TechNote.
The current session's runtime-provided catalog lists the 23 repository skill
names and paths. Native invocation, effective child models/permissions and
cross-client/machine behavior remain NOT_RUN or Unknown. Static scenario text
does not establish scenario PASS.

Review question: do the merged documents include upstream reporting and recovery
rules while retaining UCORN's authority/domain boundaries? Review is bounded to
the changed guidance and its sources. Findings that change those boundaries
invalidate the conclusion; changed wording alone does not require a new review
chain. The existing static validators check package integrity and domain links.
There is no additional blocking review gate for each file or phase.

Actual evidence: both existing validators PASS; 537 links/anchors across 115
tracked Markdown files PASS; all 23 skill packages, native definitions, domain
rules/docs, application files and validator code are unchanged. The final diff
contains 18 documentation/provenance files, with no staged or untracked changes.
Sequential source review found no unresolved issue. These observations cover
static/documentation acceptance, not native scenario behavior.

At the maintenance handoff, the next action was to use the updated guidance. The
[adoption record](../agent-kit-adoption.md#maintenance-update--2026-10-13) preserves
actual checks and limits. No documentation work remains. Native tests and Git
delivery are outside current authority; no commit/push was performed.

## Git delivery authorization — 2026-10-13

The human directly instructed “Commit và push toàn bộ thay đổi cập nhật Agent
Kit.” in the current chat after the maintenance report. This supersedes the
prior maintenance-phase exclusion of commit/push for this update only. The
current coordinator owns the delivery; no subagent or separate reviewer is used.

Scope: all 18 reviewed Agent Kit documentation/provenance files, including these
current authorization records. Stage the intended files, inspect the staged
diff, make one ordinary commit on `master`, push to `origin/master`, then compare
local and remote SHAs/divergence and inspect final worktree status. Preserve all
skill/domain/application files, history and other work. No force push, reset,
branch switch, deployment or application change is authorized.

The maintenance review remains valid for the unchanged guidance. Only these
delivery records were updated after that review; rerun both documentation
validators and whitespace/scope checks before commit. Record actual delivery
success in Git history and the final report; authorization alone does not prove
push success. Native behavior/scenarios remain NOT_RUN.
