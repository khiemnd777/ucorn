# AGENT-KIT-003 — Update role responsibilities to ea72429

Updated: 2026-10-13. Approved plan: **U1**, revision `agent-kit-update-u1`.
State: local package acceptance complete; native behavior NOT_RUN.
Git delivery of the combined P1/U1 payload was subsequently approved; see the
[delivery authorization](#git-delivery-authorization--2026-10-13).
Owner: current Codex main session, coordinator and sole writer for U1.
Branch/HEAD: `master` / `50f0118b36385816323ace57c8795b075c44c0b1`.
Starting worktree: all 14 approved P1 documentation/provenance changes present,
unstaged and uncommitted. Preserve their policy corrections and historical notes.
Future project ownership is unassigned. No subagents are assigned.

## Assignment and authorization

Goal: adopt Agent Kit `ea72429b4c3cd80296b7ad75139431eb944aa319`, separating
Explorer/Reviewer responsibilities from runtime permissions while retaining
Planning → human approval → execution and the P1 corrections.

Human source: after the read-only comparison and concrete U1 plan, Khiêm wrote
**“Approve option 1.”** Option 1 was “Approve U1” for the update, four adapters,
documentation, validator change with isolated negative fixtures, provenance and
local checks. The previous **no commit/push** restriction remains in effect.
No later stop has been received. This record refers to the human approval; it
cannot create authority. Upstream task approvals do not authorize UCORN work.

Owned files:

- `.codex/agents/kit-explorer.toml`, `.codex/agents/kit-reviewer.toml`.
- `.claude/agents/kit-explorer.md`, `.claude/agents/kit-reviewer.md`.
- `AGENTS.md`, `README.md`, `docs/team-policy.md`.
- `docs/roles/explorer.md`, `docs/roles/reviewer.md`.
- `docs/agent-coordination-templates.md`, `docs/agent-compatibility.md`,
  `docs/model-routing.md`, `docs/verification-guide.md`.
- `docs/validate_agent_setup.py`, `docs/skills-manifest.json`,
  `docs/agent-kit-adoption.md`.
- `docs/project-context.md`, `docs/project-plan.md`, `docs/project-state.md`,
  `docs/tasks/README.md`, and this task record.

Allowed: scoped writes above; temporary document/agent snapshots and synthetic
validator fixtures under `/private/tmp`; local validators, negative tests, syntax,
source/hash/mirror/link/preservation checks and sequential review. Preserve actual
runtime approvals/permissions. No application code/tests/build/runtime, domain
contract/sample/dependency/skill/implementer changes, global configuration,
installation, Git mutation, new chats, delegation, external writes or deployment.
Native agent invocation and behavior tests are outside U1.

## Sources and accepted approach

GitHub comparison verified main at `ea72429` and two commits ahead of UCORN's
`51b1c810`: `adba3ee` README setup prompts/logo and `ea72429` role/permission
separation. The local Agent Kit Git objects provide the pinned source bytes.
The approval sections and skills/implementer definitions are unchanged upstream.

Copy the four changed native definitions and two common roles from the new pin.
Merge affected policy/coordination/compatibility/model-routing/verification text
without removing P1's approval clauses, V26–V30 or historical corrections. Keep
UCORN's product README; adopt relevant planning/setup and role guidance, not the
template's logo or its fresh-project/task records as UCORN facts.

Validator: replace forced role sandbox/tool expectations with absence checks for
the upstream omitted fields; retain metadata/model, inventory/hash/path/mirror
checks and explicit responsibility/task-scope instructions. Verify omission and
responsibility failures independently of hashes in a synthetic fixture.
The native field changes do not modify the calling session or managed settings.

## Work and acceptance

1. Capture the existing P1 state and reproduce old-validator incompatibility with
   the new definitions in an isolated fixture before changing validator logic.
2. Apply the approved adapters/docs and validator change; run fixture regression
   cases, including forbidden fields and missing responsibility/scope instructions.
3. Update source pin/digests and current task ownership/state. Preserve previous
   source provenance and all historical task records; keep source evidence distinct
   from UCORN runtime observations.
4. Run both existing validators, YAML/TOML, complete local links/anchors, exact
   source/approval parity, mirrors/preservation, scope/whitespace and final review.

Acceptance: all four adapters match the new source; they omit Codex sandbox and
Claude tool/permission overrides, retain model inheritance and prohibit application
code changes/implementation/deployment. Approved checks/evidence stay within actual
runtime/parent permissions, side effects, fixtures and destinations. Planning stays
read-only. Only the 21 owned files change relative to the pre-U1 snapshot; prior
P1-only files, all skills/implementers and application/domain assets retain bytes.
HEAD and index remain unchanged. Static and native behavior evidence stay separate.

## Verification and review

Check owner: this session. Actual results on 2026-10-13:

| Check | Result | Evidence and limit |
| --- | --- | --- |
| Baseline snapshot and RED fixture | EXPECTED FAIL | Old coherent package accepted; four source-new adapters with coherent hashes rejected solely by the old read-only field expectations before validator edits |
| `PYTHONDONTWRITEBYTECODE=1 python3 /private/tmp/ucorn-u1-validator-regressions.py` | PASS | Coherent new adapters accepted before/after 30 semantic negative cases plus three retained path/mirror/hash negative cases; fixture trees removed automatically |
| `PYTHONDONTWRITEBYTECODE=1 python3 docs/validate_agent_setup.py .` | PASS | 23 skills per root, 103 maintained files, 39 mirror pairs, three native definitions per runtime; static package checks |
| `PYTHONDONTWRITEBYTECODE=1 python3 docs/well-schematic/validate_docs.py .` | PASS | Six domain skills, 64 component cards, sources and internal links |
| YAML parsing using `ruby -rpsych` | PASS | 61 metadata files parsed; Explorer/Reviewer omit tool/permission/effort fields and retain model inheritance |
| Python `tomllib.loads` and `ast.parse` | PASS | Three TOML definitions parse with omitted model fields; Explorer/Reviewer omit sandbox override; validator syntax valid |
| Exact source comparison using local `git show ea72429:<path>` | PASS | Four adapters, two roles and coordination templates match source bytes; both canonical approval sections match ea72429 and the P1 snapshot exactly |
| Source/inventory comparison, inline Python | PASS | All 78 upstream digests checked before editing provenance; 103 local entries retained, all source digests match ea72429; previous 22c2a203/51b1c810 history preserved |
| Complete Markdown links/anchors, inline Python | PASS | 561 local references across all 115 project/skill Markdown documents; target containment/existence and heading anchors checked; external HTTP links not checked |
| Scope/P1 preservation comparison, inline Python | PASS | Exactly 21 U1-owned files changed relative to the captured P1 baseline; P1-only task/history/workflow records and V26–V30 procedure retained verbatim; all skills, implementers and application/domain assets unchanged |
| `git diff --check` and task whitespace checks | PASS | Local tracked diff and new task whitespace valid |
| Git boundary | PASS | HEAD remains 50f0118 and index empty; only the P1 and U1 task records are untracked; no commit or push |

The temporary regression runner is a local check artifact, not a new distributed
skill or application test suite. It builds isolated synthetic packages from the
captured maintained assets and fills referenced application targets with empty
stubs; no application code is executed. For semantic cases, it refreshes only
the fixture's local digest so checksum rejection cannot substitute for the
intended guard. Cases cover both roles' sandbox values, Claude inline/block/quoted
permission fields, missing responsibility/scope clauses, model pins, missing or
non-string metadata, plus retained path, mirror and hash failures. The live
checkout is never mutated by the runner. Static text checks are not a full YAML
parser or semantic/native enforcement; full YAML parsing was checked separately.

The seven source-exact copies used the environment's approved access mechanism
after the sandbox rejected a write to protected `.codex`. No managed/global
permission setting or current-session sandbox was changed. Document merges
resolved only the local source-review provenance and UCORN validator description;
they retain source review as upstream evidence rather than claiming a new UCORN
official-source/runtime verification.

Sequential review completed in this session; no unresolved finding in the local
package scope. Reviewed role responsibility/permission separation, canonical
approval and stop boundaries, omitted fields and metadata failure paths, source
and P1 preservation, ownership/history, recorded results and native limits.
No independent reviewer ran. The validator expectations concern authored metadata,
not application runtime conditions or a new permission gate. No dependency,
global setting, runtime installation or unrelated cleanup was introduced.
Native discovery/invocation, effective permission observation, V18/V26–V30 replay,
Claude/two-machine behavior: NOT_RUN. Model/effort intent remains inherited;
runtime-observed values: Unknown. Application checks: NOT_RUN, outside U1.

## Handoff

Result: U1 package acceptance is complete locally at source ea72429; P1's approval
corrections are preserved. Changes remain unstaged and uncommitted on master,
with HEAD unchanged. Khiêm receives the local result and verification limits.
No required local package work remains. Native behavior is unverified; a future
V18/V26–V30 observation needs its own client/fixture scope and human approval.
No commit, push, native invocation, new chat or delegation is authorized.

## Git delivery authorization — 2026-10-13

Human source after the local handoff:

> Commit và push toàn bộ thay đổi P1 và U1 lên origin/master.

This supersedes the prior no-commit/push restriction for the reviewed combined
25-file P1/U1 payload only, including these delivery records. The current session
owns the ordinary staging/commit/push and final verification on master. No reset,
force push, rebase, amend, branch switch or unrelated change is authorized.

Preflight: HEAD and live origin/master both equal 50f0118; index empty, exactly
23 modified tracked files and the two task records untracked; no active Git hooks
or unrelated changes. Recheck validators, complete links/anchors, source/inventory
and staged ownership/whitespace before committing. Earlier semantic/YAML/TOML
checks remain valid while their inspected inputs are unchanged.

Delivery recheck: both documentation validators PASS; complete local references
PASS with 564 links/anchors across 115 Markdown documents; exact 25-file payload,
branch/base/index and whitespace checks PASS. Native behavior remains NOT_RUN.

The payload is the union of the P1 and U1 ownership lists. P1-only workflow and
historical corrections remain part of delivery; native behavior remains NOT_RUN.
This record captures pre-delivery authorization and is included in the commit.
The resulting SHA, push result, remote comparison, divergence and final status
are verified from Git and reported in the closing chat; this record cannot prove
push success. This delivery approval grants no future Git or application authority.
