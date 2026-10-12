# Agent Kit adoption in UCORN

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
