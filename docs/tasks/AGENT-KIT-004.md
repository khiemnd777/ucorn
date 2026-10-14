# AGENT-KIT-004 — Proportionate verification update

Updated: 2026-10-14. Approved plan: **U2**, revision `agent-kit-update-u2`.
State: COMPLETE for approved local package update/verification; native behavior NOT_RUN.
Owner: current Codex main session, coordinator and sole writer for U2.
Branch/base: master / `5dfa4bae47d66bf1ab85dcb577277b7daac82e05`.

## Assignment and authorization

Human source: Khiêm approved the presented U2 option 1:

> Approve U2. Cập nhật theo option 1, giữ nguyên toàn bộ thay đổi completion đang có và kiểm tra đầy đủ trong phạm vi đã nêu. Chưa commit hay push.

The approval covers the eight skill/reference files, affected guidance,
provenance/validator change, current records and local checks below. The original approval excluded commit/push; the later delivery approval below covers U2 Git only. Application execution, native invocation, delegation and new chats remain excluded.
Future project ownership and delegated coordination authority remain unassigned.
The record refers to the human approval; upstream TASK-004 approvals are source
history, not authority for UCORN. No later stop has been received.

## Scope and preservation

Owned files (26):

- `.agents/skills/{using-agent-skills,planning-and-task-breakdown,incremental-implementation}/SKILL.md`
  and their three `.claude/skills` mirrors.
- `.agents/references/definition-of-done.md` and its `.claude` mirror.
- `AGENTS.md`, `README.md`, `docs/team-policy.md`, `docs/team-workflow.md`.
- `docs/agent-coordination-templates.md`, `docs/roles/{coordinator,implementer,reviewer}.md`.
- `docs/skills-catalog.md`, `docs/verification-guide.md`,
  `docs/skills-manifest.json`, `docs/validate_agent_setup.py`.
- `docs/project-context.md`, `docs/project-plan.md`, `docs/project-state.md`,
  `docs/agent-kit-adoption.md`, `docs/tasks/README.md` and this task record.

Before writes, captured digests of all 536 tracked/non-ignored untracked files
and copies of maintained kit/current record bytes in an isolated temporary
snapshot. Existing completion source/tests/samples/domain documents/evidence and
task records are preserved byte-for-byte. The shared manifest's existing domain
validator entry is preserved as an entire object, including its completion digest
and adaptation description. Never replace the manifest with the upstream file.
Recheck the current manifest before merging to avoid overwriting another writer.

Temporary snapshots and synthetic validator fixtures under /private/tmp are
authorized local checks. Preserve index/HEAD, dependencies, native adapters,
unchanged skills/domain packages, current-session/global runtime settings and all
other files. No application tests/build, installation or external write is included.

## Source and accepted approach

Pinned new source: `8fedcd0b08b256b08e50cfbcd12b3ccc80ed267c`, one commit after
ea72429, verified from GitHub and available local Git objects. Copy the eight
changed skill/reference files exactly; merge affected documents with UCORN's
domain, approval and role/permission rules. Do not import upstream task records
or verification PASS rows as UCORN evidence.

The new upstream adapts four of 26 canonical Addy files, retaining original
commit/blob provenance; 22 remain unchanged. Import the declared origin/adaptation
metadata and document that original provenance does not mean identical local
bytes. The validator must reject unmarked originals changed even after local
hash refresh, invalid adaptation records/counts and inconsistent mirror provenance.
Keep existing identity, role, model, inventory, path and digest checks.

Upstream V26–V30 collide with UCORN's approval regressions. Preserve UCORN's
existing IDs, heading anchors, meaning and historical P1/U1 references. Use
**KIT-V26–KIT-V30** for the new source cases, with explicit source-ID mapping.
Neither written group is a mandatory runtime harness for this package update.

## Ordered work and acceptance

1. Record baseline/package status and reproduce missing provenance rejection in
   an isolated fixture before changing validator logic.
2. Import the eight source-exact assets and merge relevant guidance. Keep Planning
   and direct approval as the execution boundary; delegated authority requires an
   explicit scoped human instruction, which U2 does not supply.
3. Add provenance validation with focused negative cases; merge manifest metadata
   and digests by entry, preserving completion ownership and earlier source history.
4. Update current U2 records, then run relevant package/domain validators,
   frontmatter/syntax, links/anchors, mirrors/source/provenance and preservation
   checks; review sequentially and report exact completion/evidence limits.

Acceptance: pin 8fedcd0; 23 skills and 39 mirrors remain; eight assets match source;
22 originals/four adaptations retain matching source/mirror metadata; both new and
existing scenario groups have distinct IDs and valid references. Only owned files
change relative to the snapshot. All 536 baseline files outside scope and the
domain manifest entry remain unchanged. HEAD/index are preserved. Static package
acceptance, native behavior and human acceptance stay separate.

## Verification and review

Local package acceptance is complete. Checks were selected for package/instruction changes and new validator logic; no universal application or native-runtime suite was required.
An unrun relevant native claim remains NOT_RUN. Review is sequential in this
session, not independent. Effective runtime model/child permissions are Unknown.
V18, UCORN V26–V30, KIT-V26–KIT-V30 and two-machine behavioral runs are NOT_RUN.

## Handoff

Next: perform the separately authorized U2-only delivery below. U2 does not grant code changes or decisions to completion
tasks, nor release approval or additional Coordinator/Supervisor authority.

## Actual local results — 2026-10-14

| Check / command | Result | Evidence and limit |
| --- | --- | --- |
| `PYTHONDONTWRITEBYTECODE=1 python3 docs/validate_agent_setup.py .` | PASS | 23 skills per root, 103 maintained files, 39 mirror pairs, three authored agents per runtime; original/adapted provenance and old role/permission guards checked |
| `PYTHONDONTWRITEBYTECODE=1 python3 docs/well-schematic/validate_docs.py .` | PASS | Six domain skills, 64 component cards, source IDs and links; existing completion validator/code/docs preserved |
| `PYTHONDONTWRITEBYTECODE=1 python3 /private/tmp/ucorn-u2-regressions.py` | PASS | Valid 22-original/four-adapted fixture and 33 negatives: unmarked edits with coherent mirror hashes, origin/pin/blob, adaptation fields/records, counts, mirror provenance and retained path/hash/role guards |
| `PYTHONDONTWRITEBYTECODE=1 python3 /private/tmp/ucorn-u2-retained-regressions.py` | PASS | Valid prior 26-original/no-adaptation fixture; 30 semantic role/model/metadata negatives plus three path/mirror/hash negatives; 66 negative cases total across both runners |
| `ruby /private/tmp/ucorn-u2-yaml.rb` | PASS | Ruby/Psych parsed 46 skill frontmatters, three Claude agent frontmatters and 12 domain metadata files: 61 records, required fields checked |
| `PYTHONDONTWRITEBYTECODE=1 python3 /private/tmp/ucorn-u2-checks.py` | PASS | 843 local Markdown links/anchors; three TOML files and validator AST; source/policy/scenario/ownership/preservation/index/HEAD and owned whitespace checks |
| Source and policy comparison | PASS | Eight imported assets plus coordination template and three updated roles match pinned 8fedcd0 bytes; full approval section matches source; local approval-regression section/anchors retained and new source cases use KIT IDs |
| Whole-worktree snapshot comparison | PASS | Exactly 26 owned paths differ, including the new U2 record; all 511 other baseline files remain unchanged; sole added nonignored file is this record; existing completion manifest object identical |
| Sequential final review | PASS | Guidance, source/mirror metadata, relocation/history, approval/stop/ownership, ID collisions and scope reviewed; no independent reviewer claimed |
| Native behavior, fresh-client reload/invocation and two-machine scenarios | NOT_RUN | Outside U2; effective child model/permissions and agent compliance remain Unknown |
| Application test/build/runtime and Git delivery | NOT_RUN | Outside U2; HEAD stays 5dfa4bae and index stays empty; completion work is preserved, not accepted or tested by this task |

RED evidence: before validator edits, the old validator accepted a fixture with
both original mirror files modified and local digests refreshed. The targeted
expectation failed with no validation errors. The new validator rejects that
unmarked upstream change; a coherent valid fixture passes. Synthetic referenced
application files were empty existence stubs and were never executed. Fixtures
were isolated and removed by their runners. Temporary scripts/snapshot are local
verification aids, not an installed universal harness or native evidence.

System and bundled Python lack PyYAML. No dependency was installed; existing
Ruby/Psych supplied full YAML parsing. No native configuration/model/schema
change was needed. Scoped access for the eight protected skill/reference assets
used the runtime approval mechanism under the existing U2 human approval, without
changing sandbox or global permissions.

## Git delivery authorization — 2026-10-14

The human directly instructed:

> Commit và push toàn bộ thay đổi U2 lên origin/master. Giữ nguyên các thay đổi completion, không đưa chúng vào commit này.

This covers the reviewed 26 U2 paths, this bounded delivery record update,
ordinary staging/commit on master and push to origin/master, and final checks.
No completion source/tests/docs/samples/evidence/task changes may be committed.
The shared manifest is staged from current U2 content with its domain-validator
entry restored to the pre-U2 HEAD object. Its working copy retains the completion
entry and bytes. This is an index-only split, not a worktree rollback. All other
U2 paths are staged as reviewed; application/native execution remains excluded.

Preflight: local HEAD and live remote master are both 5dfa4bae; index empty;
working agent/domain validators PASS. No active Git hooks were found. Preserve
all completion files against a fresh whole-worktree snapshot. Validate the
U2-only candidate and staged tree against the committed domain validator and
manifest. Review the exact staged diff and whitespace before committing. Use a
normal push; no branch switch, force push, reset or history rewrite.

Delivery outcome must be established from Git history, live remote SHA,
divergence, final index/status and preservation comparison. The current task
record's approval is evidence of the human instruction, not new authority.

Delivery candidate checks: PASS for its own agent and domain validators,
598 local links/anchors and owned whitespace. Its 109 committed domain files
match the pre-U2 HEAD bytes. Working-copy checks also PASS (843 links/anchors),
and all 511 baseline files outside U2 plus the working domain manifest object
are preserved. The earlier 66 negative cases and YAML/TOML/source results remain
valid because the implementation assets are unchanged by delivery records.

Check isolation matters: an initial candidate check used the working completion
validator against pre-completion candidate cards, which produced three status
mismatches. Running each tree's own validator resolves that checker/input mismatch;
both the HEAD baseline and U2-only candidate pass. No completion file was changed
or admitted to fix that check. Candidate/static results do not prove runtime.
