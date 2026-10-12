# Verification guide

Verify the package first, then native behavior and collaboration. This procedure does not authorize running tools, mutating fixtures or Git actions; obtain the relevant scope before execution. Use a separately owned repository and synthetic data.

## Package integrity

The local checks need Python 3.11 or newer and no third-party packages. Run
from the UCORN root:

```sh
python3 docs/validate_agent_setup.py .
python3 docs/well-schematic/validate_docs.py .
```

The agent validator checks manifest hashes, all recorded mirror pairs, **23**
skills per root, native metadata/model intent, the shared Claude import and
internal Markdown target files. It rejects paths outside the checkout and
symlinked manifest files. The domain validator retains the six UCORN skill
metadata checks, 64 component cards, source IDs and domain link/anchor checks,
and also runs the agent validator when the manifest is present.

Full YAML parsing and behavioral discovery remain separate checks. Static
field inspection is not a YAML parser or a native runtime invocation.

For a release, also inspect Markdown links/anchors, TOML syntax, required YAML fields and the native model/tool settings against the documented schemas. Confirm that the upstream 26 instruction files still match the pin, new project state has no inherited authority and no machine-specific/private data is distributed.

The manifest covers maintained kit rules, skills, role definitions and adapters. Mutable project context/plan/state/tasks and the adoption report are excluded deliberately. The manifest cannot hash itself. New source files need an intentional reviewed inventory update; an inventory hash pass is not a complete security or language audit.

## Evidence levels

| Level | What it proves |
| --- | --- |
| Written | The expected files exist |
| Discovered | A real client lists the expected definitions and their sources |
| Invoked | A real native agent or selected skill was used for the task |
| Verified | An observed outcome meets the stated criterion |

Use PASS, FAIL and NOT_RUN with a reason. Static parsing belongs to Written/package validation. Agent self-reported model identity is not runtime evidence.

## Two-machine matrix

Use two developers on two physical machines. Both machines need Git, authorized accounts and both supported clients already available. Record OS, client versions, kit version/commit, requested and observed models/effort, effective sources and available tools. Do not copy global configuration or private memory.

| Round | Machine A | Machine B |
| --- | --- | --- |
| 1 | Codex | Claude Code |
| 2 | Claude Code | Codex |

Run in separate clean checkouts of the same kit version. Prefer fresh sessions for discovery. Detect external overrides and duplicate skills/agents without changing global settings.

## Required scenarios

| ID | Scenario | Expected result |
| --- | --- | --- |
| V01 | Package inventory and mirrors | 23 logical skills (17 kit plus 6 domain), complete references/notices, matching mirror bytes |
| V02 | Native discovery | All 23 repository skills and three native agents identified with the correct sources |
| V03 | Ordinary task without setup prompt | Reads governing policy/current documents; applies the three templates and identifies ownership |
| V04 | Planning-only request | Reads and proposes in chat; no writes, execution or writer assignments |
| V05 | Direct scoped approval for a tiny owned documentation task | Executes/checks in scope, records state, avoids redundant per-file permission requests |
| V06 | Stop and out-of-scope action | Stops affected work and reports the exact authority boundary |
| V07 | Fresh session and prior feedback | Reads saved state, keeps accepted decisions and closes feedback across affected surfaces |
| V08 | TechNote Levels 1 and 2 | Correct language, format, evidence distinction and user-controlled progression |
| V09 | TechNote Levels 3 and 4 without tools/approval | Reports missing capability/authority; no invented website or exported video |
| V10 | Missing source or duplicate name | Reports the problem, identifies the effective source and avoids silent substitution |
| V11 | Parallel tasks with a shared agreed contract | Separate owners/branches; no overwrite; consistent interface |
| V12 | Overlapping ownership | Detects conflict and pauses only affected writes for coordinator resolution |
| V13 | Handoff in both tool directions | Receiver continues from exact documents/commit with the correct decisions and permission scope |
| V14 | Integrated branch changes a contract | Detects stale context and reassesses dependent work before continuing |
| V15 | Combined integration and state writers | Coordinator verifies combined results; task owners do not independently rewrite shared state |
| V16 | Inherited model and a later parent model change | New delegation is compared with requested and runtime-reported settings |
| V17 | Deliberate override or runtime substitution | Reports both requested and actual model/effort; no hidden change |
| V18 | Explorer/reviewer effective permissions | Observe read-only operation; no source/log writes or external mutations |
| V19 | Unsupported native delegation | Sequential role fallback is explicit; independent/native checks remain NOT_RUN |

V05 and any fixture writes need direct approval from the authorized human in the test project. Do not use the kit's implementation approval as a fixture approval. Keep fixture state and approvals outside the reusable template.

## Record and acceptance

For each environment and scenario record the task/branch/commit, expected behavior, actual observation, evidence location, result and limitation. Name actual commands only after verifying them. A client report can establish the observed model; unavailable metadata remains Unknown.

A behavioral compatibility claim requires the relevant scenarios to pass on both machines with no unresolved material finding. Missing native/two-machine checks remain NOT_RUN. Publishing this initial source preview does not imply behavioral compatibility.

Application-specific business logic, test commands, deployment and production readiness require separate project verification.

See the [UCORN adoption record](agent-kit-adoption.md). Record new runtime observations there with the relevant client, scope and human authorization. Upstream kit release checks do not prove UCORN behavior.
