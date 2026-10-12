# AGENT-KIT-001 — Adopt Agent Kit in UCORN

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
