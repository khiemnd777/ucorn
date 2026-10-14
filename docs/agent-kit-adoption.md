# Agent Kit adoption in UCORN

Current source: `8fedcd0b08b256b08e50cfbcd12b3ccc80ed267c`, refreshed under approved U2 on 2026-10-14.

Current owner/scope: [AGENT-KIT-004 / approved U2](tasks/AGENT-KIT-004.md), local package update/checks completed, followed by separate direct U2-only commit/push authority. Preserve all completion work and exclude it from this commit. Local results are recorded below; native/two-machine behavior remains NOT_RUN.

## Prior adoption overview (ea72429)

The following overview and dated evidence describe earlier adoption, not current authority.
All initial adoption, maintenance and P1/U1 Git delivery sections are historical.
Their authority interpretations are superseded by the
[policy correction](#policy-correction--2026-10-13). The prior U1 scope and evidence
belong to [AGENT-KIT-003 / approved U1](tasks/AGENT-KIT-003.md). P1's dated
policy correction and local evidence remain below and in its task record.

Date: 2026-10-12. Source: [Agent Kit v0.1.0 preview](https://github.com/khiemnd777/agent-kit/tree/22c2a20359072dcb510f3329b97161b16f947fb2).
Source commit: `22c2a20359072dcb510f3329b97161b16f947fb2`.
UCORN base: `a9a51fed7210d2f9ffc02ac031b0583a90c35f1c`, branch `master`.
Task: [AGENT-KIT-001](tasks/AGENT-KIT-001.md).

## Scope and adaptations

The human request authorizes adopting the linked template in this existing
workspace. The kit's own fresh-project placeholders and verification results
are not copied as UCORN facts or authority. Shared context, plan and state are
initialized from this request and current source inspection.

Imported: 17 kit skill entrypoints and their references, three native agent
definitions per runtime, coordination/role/TechNote documents, and MIT notices.
Preserved: the original six UCORN domain packages and all domain contracts.
Claude receives byte-identical mirrors of all 23 skills; `CLAUDE.md` imports
the shared `AGENTS.md`. Existing AGENTS.md domain guidance is retained below a
new coordination entrypoint.

Local adaptations: explicit bounded requests authorize ordinary setup work;
significant application changes retain the concrete-plan approval gate. The
catalog and verification guide use 23 project skills. The docs validator keeps
its original six domain checks and validates imported assets separately. Local
agent state and Python caches are ignored. The [manifest](skills-manifest.json)
records original hashes and source paths for adapted files.

The template's root README, CONTRIBUTING, fresh-project documents and historical
verification report are not installed as project documentation. UCORN's README
and ignores are extended in place. The [kit license](agent-kit-LICENSE) applies
to imported kit content; the original Addy Osmani notices remain in both skill
roots. This adoption does not relicense unrelated UCORN content.

## Evidence

| Check | Status | Scope |
| --- | --- | --- |
| Domain docs baseline before adoption | PASS | Six skills, 64 cards, source IDs and internal links |
| Imported file hashes / mirrors / native syntax | PASS | 103 maintained files, 39 mirror pairs, 23 skills per root, three agents per runtime |
| Pinned template preservation | PASS | Original 78-file inventory verified; 67 adopted files keep template bytes, ten adaptations or relocations declared; all 26 canonical Addy assets unchanged |
| YAML metadata | PASS | Ruby/Psych parsed 46 skill frontmatters, 12 domain UI metadata files and three Claude agent definitions; required fields checked |
| Post-adoption domain docs | PASS | Six domain skills, 64 cards, source IDs and internal links; kit inventory also checked |
| Existing domain packages | PASS | All 12 original skill/metadata files are byte-identical to Git base |
| Validator negative checks | PASS | Eight cases in a temporary synthetic checkout; clean fixture passed before and after |
| Application source/tests/samples/locks | PASS | No tracked diff or new untracked files in the protected application scope |
| Final diff checks | PASS | git diff --check; sequential scope review; no staged changes |
| skill-creator quick_validate.py | NOT_RUN | PyYAML is absent from system and bundled Python; no package installed |
| Native discovery / invocation | NOT_RUN | New definitions were not loaded or invoked in a fresh client |
| Effective model / child permissions | Unknown | Native files specify intent only |
| Claude client / two-machine behavior | NOT_RUN | No second client or physical machine used |
| Application tests / build / rendered UI | NOT_RUN | Setup-only change; application files are preserved |

Official [Codex custom-agent documentation](https://learn.chatgpt.com/docs/agent-configuration/subagents#custom-agents)
was fetched on 2026-10-12. It supports project-scoped TOML files with `name`,
`description` and `developer_instructions`, optional sandbox settings and omitted
model/effort inheritance. This establishes authoring syntax, not installed-client
discovery or enforcement. The kit's Claude source references remain in
[compatibility](agent-compatibility.md); Claude sources were not rechecked and
no new Claude runtime claim is made.

Local reproducible checks:

```sh
python3 docs/validate_agent_setup.py .
python3 docs/well-schematic/validate_docs.py .
git diff --check
```

YAML parsing used the existing Ruby/Psych 3.1.0 parser; Python 3.13.3 ran the
manifest and domain validators. No dependencies were installed. The separate
skill-creator validator could not start because PyYAML was absent; its result
is not counted as PASS.

Synthetic negative cases: changed file digest, mismatched Claude mirror, missing
MIT notice, extra skill, missing reviewer read-only intent, path traversal,
symlink escape and missing required UCORN domain skill. Read guards confirmed
that escaped paths were rejected before file content was read. The first fixture
attempt omitted referenced application/test files and failed baseline links;
the complete synthetic checkout then passed its baseline and all eight cases.
Temporary fixtures were removed through their task-owned temporary lifecycle.

No independent agent review ran. The coordinator reviews and validates this
instruction-only change sequentially. Native verification follows the
[verification guide](verification-guide.md) when separately requested.

## Maintenance update — 2026-10-13

Task/plan: `AGENT-KIT-001` / `agent-kit-update-r2`. UCORN branch/base:
`master` / `5f80b457772b22a1f5fa989e0869cff7927fc0fc`. The worktree was clean;
the original adoption is present in this commit. This update remains local.

The user's current-chat notice, “Agent-kit có update mới.”, steers the existing
template-adoption request to the latest guidance. The scope is documentation
maintenance and its static checks. No application, external delivery, global
configuration, paid service or native/fixture scenario run is authorized here.

Upstream source moved from `22c2a20359072dcb510f3329b97161b16f947fb2` to
[51b1c810](https://github.com/khiemnd777/agent-kit/tree/51b1c810a9920be7fe3957ce454fc25fedf7b155)
through two commits: adaptive reporting and repair/stop/review boundaries. Version
remains `0.1.0 preview`. The changes add opening/closing report formats, explicit
material-approach and stop boundaries, valid review reuse, blocking-gate reasons,
acceptance-focused progress and written verification scenarios V20–V25 / A–G.

Ten guidance documents were merged against the original pinned source without
conflicts. UCORN's direct bounded-request authority, concrete application-plan
approval rule, 23-skill catalog and local validator commands are retained.
The application/domain rules are preserved in `AGENTS.md`; the entrypoint and
README link to adaptive reports. Original template release approvals/results
are not copied into project state or counted as UCORN observations.

| Check | Current result | Evidence and limit |
| --- | --- | --- |
| Current template source inventory | PASS | All 78 original source digests matched the new template manifest before merging |
| UCORN pre-update baseline | PASS | Agent validator: 23 skills/root, 103 files, 39 mirrors, 3 agents/runtime; domain validator: 6 skills and 64 cards |
| Updated agent/domain validators | PASS | Agent: 23 skills/root, 103 hashes, 39 mirrors, 3 agents/runtime; domain: 6 skills, 64 cards, source IDs and links |
| Current Markdown links/anchors | PASS | 537 local references across 115 tracked Markdown files, including new adaptive-report/review/task anchors; external URLs not fetched |
| Skills/native/domain/application preservation | PASS | No diff in .agents, .claude, .codex, src, tests, sample-data, package/locks/config, validator code or domain docs; AGENTS.md domain body is byte-identical |
| Guidance review | PASS | Sequential coordinator review; all six non-adapted guidance files match the new source bytes, four merged guides preserve UCORN changes; no independent agent |
| Provenance and diff scope | PASS | New source pin/history and original digests recorded; 77 adopted paths, 67 exact copies, 10 declared adaptations/relocations; 18 owned files changed, no staged/untracked files |
| Skill discovery in this session | Discovered | Runtime-provided catalog lists all 23 names and repository source paths |
| Native invocation / new scenarios / two-machine checks | NOT_RUN | No clients, delegated agents, application or scenario fixtures were started |
| Effective child model / permissions | Unknown | Unchanged definitions express intent; behavior was not observed |
| Application tests / build / rendered UI | NOT_RUN | Instruction-only maintenance; application behavior is outside the writes |

Reproducible local checks remain:

```sh
python3 docs/validate_agent_setup.py .
python3 docs/well-schematic/validate_docs.py .
git diff --check
```

No dependency installation is needed. Skill-creator's PyYAML-dependent validator
was not rerun; no skill/metadata files changed. Native metadata checks remain in
the package validator. The new scenario definitions are Written guidance only.

Static/documentation acceptance is complete. The 17 imported plus six domain
skills and three adapters per tool retain their prior bytes. No application,
dependency, global configuration, commit/push, deployment or native/fixture run
was performed. Use the updated reporting and repair/review guidance for the next
scoped task. Further native tests or Git delivery require their own scope.

## Git delivery authorization — 2026-10-13

After the maintenance report, the human directly instructed “Commit và push
toàn bộ thay đổi cập nhật Agent Kit.” This authorizes the complete 18-file
Agent Kit update and its current coordination records for an ordinary commit
on `master` and push to `origin/master`. The previous maintenance-phase Git
restriction is historical. No application/deployment or history rewrite is added.

The delivery owner reruns the existing validators, inspects staged scope and
whitespace, and verifies the resulting local/remote SHA, divergence and clean
worktree. Git history and the final delivery report carry the actual commit and
remote evidence; this pre-delivery authorization record cannot establish success.
Native execution and scenario evidence remain NOT_RUN.

## Policy correction — 2026-10-13

Human source: Khiêm approved the concrete P1 correction plan in the current chat:
“Approve P1. Đưa Agent Kit trong UCORN về đúng policy gốc như kế hoạch, kiểm tra
đầy đủ. Chưa commit hay push.” [Task and exact scope](tasks/AGENT-POLICY-002.md).

The earlier adaptation replaced the source's Planning-first and direct approval
clauses with direct-request/setup authority and a significant-application-only
gate. This was a policy deviation, not merely a UCORN domain adaptation. P1
restores the pinned approval clauses and removes conflicting domain/workflow
exemptions. Stack, well semantics, 23 skills, native definitions and original
source commit/digests remain preserved.

The reviewed update exchange supplied no approval of a presented update plan.
The reviewed completion exchange selected two entries after an offer to develop
their implementation plan; the agent then implemented without presenting it for
approval. The dated [setup correction](tasks/AGENT-KIT-001.md#approval-correction--2026-10-13)
and [completion correction](tasks/COMPLETION-005.md#approval-correction--2026-10-13)
preserve those findings. The agent-written authority fields are historical
interpretations. Later scoped Git approval and historical technical PASS results
do not retroactively establish earlier plan approval.

Local verification is recorded in the [P1 task](tasks/AGENT-POLICY-002.md#verification-and-review).
Status: documentation/static acceptance complete locally. Both validators, exact
canonical section comparisons, 556 local links/anchors, YAML/TOML, provenance,
protected-asset preservation, exact 14-file ownership and whitespace checks PASS.
HEAD and the empty index are unchanged. [Fresh-client regressions](verification-guide.md#planning-and-approval-regressions-v26v30)
remain Written / NOT_RUN until observed; static package checks cannot prove them.
P1 changes remain local. No commit, push, new chat or native delegation is authorized.

## Role responsibility update — 2026-10-13

Plan U1 / [AGENT-KIT-003](tasks/AGENT-KIT-003.md) was approved by Khiêm with
“Approve option 1.” after the concrete plan. This approval covers local package
edits and checks; no commit/push, new chat or native invocation is authorized.
The starting worktree contained all 14 uncommitted P1 files, preserved as the
baseline rather than reset or treated as source-template bytes.

Source: `ea72429b4c3cd80296b7ad75139431eb944aa319`, two commits after `51b1c810`:
`adba3ee` setup prompts/logo and `ea72429` role/permission separation. The approval
clauses, imported skills and implementer adapters are unchanged upstream. U1
adopts the relevant existing-project planning guidance into UCORN's README; the
template logo, project placeholders, task approvals and release results are not
installed as UCORN facts or authority.

The four Explorer/Reviewer adapters omit Codex sandbox and Claude tool/permission
overrides and retain model intent and no-code-change/implementation/deployment
instructions. They inherit runtime limits; the omission does not modify the
calling session's sandbox or grant task authority. Common roles, coordination,
policy, compatibility, model routing and V18 guidance are aligned. U1's source
references retain upstream review provenance; UCORN did not rerun a fresh official
schema/source review or native permission test in this update.

The validator now checks omitted fields and authored responsibility/scope text,
including CamelCase, empty/block and quoted Claude permission keys. Metadata,
model, inventory, mirror, path and hash guards remain. A coherent synthetic
fixture first reproduced the old four read-only errors; after the change it
passed alongside 33 negative cases. Semantic cases refreshed fixture hashes to
ensure rejection came from the relevant guard, not checksum mismatch.

Local package results: complete, maintained in the U1 task. Both validators,
33 negative cases, YAML/TOML/AST, 561 local links/anchors, exact source/approval
parity, provenance, P1/ownership preservation and whitespace PASS. HEAD and the
empty index are unchanged. Native
invocation, effective permission observation, V18/V26–V30 and two-machine behavior
remain NOT_RUN. Earlier rows about read-only adapters describe the previous pin;
they are historical, not the current authored configuration. P1's historical
corrections and Planning/approval clauses remain unchanged in meaning.

## P1/U1 Git delivery authorization — 2026-10-13

After both local results, Khiêm directly instructed “Commit và push toàn bộ thay
đổi P1 và U1 lên origin/master.” The combined reviewed payload is 25 files; no
unrelated changes or active Git hooks are present. This later instruction covers
ordinary staging, one commit on master, push to origin/master and final remote/
divergence/worktree verification. The implementation-phase no-Git statements
above remain historical; native/runtime work remains outside scope.

The live remote preflight and local HEAD both equal 50f0118. Actual delivery
results belong to Git history and the closing report. These authorization records
are included in the delivery commit and do not claim a completed push in advance
or provide authority for future Git work.

## U2 proportionate verification — 2026-10-14

Human source: direct approval of U2 option 1, recorded in
[AGENT-KIT-004](tasks/AGENT-KIT-004.md). Source moved from ea72429 to 8fedcd0.
Eight changed skill/reference assets are copied exactly. Affected guidance now
selects verification by deliverable/risk, pauses an API/UI/library error flow for
a focused repair plan and separates code integration, verified behavior and human
acceptance. Coordination approval delegation requires a scoped direct human
instruction; U2 supplies none. Planning remains read-only until human approval.

Twenty-two of 26 canonical Addy files remain original; four adaptations retain
original commit/blob provenance and explicit source/reason/local record metadata.
Mirrors retain the same bytes and provenance. The validator adds original-blob,
adaptation/count/path and mirror-provenance checks while retaining prior guards.
Original provenance is not a claim of byte identity for adapted files.

UCORN V26–V30 retain the approval regression IDs and historical references.
New source V26–V30 map respectively to KIT-V26–KIT-V30; neither group has been
behaviorally run in U2. Source TASK-004 authority/results are not imported.
The current completion domain-validator manifest entry is preserved wholesale.

Local package results: PASS for both validators, 66 negative cases, 61 YAML records, three TOML files/validator AST and 843 links/anchors. Eight imports match source; full approval clauses and local regression procedure are preserved. Exactly 26 owned paths changed; all 511 other baseline files and the existing completion manifest object remain identical. HEAD/index are unchanged. Detailed commands and limits are in the U2 task record.

Sequential review only; no independent reviewer,
native invocation, application test/build/runtime or two-machine behavioral run.
Completion changes remain under their existing task owners. No commit/push.

## U2-only Git delivery authorization — 2026-10-14

Direct human source: “Commit và push toàn bộ thay đổi U2 lên origin/master. Giữ nguyên các thay đổi completion, không đưa chúng vào commit này.”
The delivery covers the 26 reviewed U2 paths, bounded records and a normal
commit/push to origin/master. Stage the shared manifest with its pre-U2 committed
domain-validator object, retaining the current completion object unstaged.
Completion source, tests, samples, domain documents/evidence and task records
remain outside the commit and retain their working bytes. Working and staged
package checks are distinct. Final outcome is verified from Git history, remote
SHA/divergence and preservation/status checks, not from an authored status field.
