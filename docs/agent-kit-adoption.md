# Agent Kit adoption in UCORN

Current source: `51b1c810a9920be7fe3957ce454fc25fedf7b155`, refreshed on 2026-10-13.
The initial record below remains historical; see the
[maintenance update](#maintenance-update--2026-10-13) for current scope and evidence.

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
