# Skills catalog

UCORN contains **23 logical skills**: 17 imported Agent Kit skills and six existing UCORN domain skills. Each has a canonical Codex entrypoint and a byte-identical Claude copy. Files written and structurally checked are not proof of runtime discovery or model-driven use.

| Skill | Apply when |
| --- | --- |
| using-agent-skills | Discover relevant available workflows; read only the workflows needed for the task |
| context-engineering | Establish or refresh relevant project context |
| spec-driven-development | Requirements need a specification before a significant change |
| planning-and-task-breakdown | Decompose agreed requirements into bounded tasks and dependencies |
| source-driven-development | Verify a version-sensitive approach against authoritative sources |
| incremental-implementation | Deliver a meaningful change in coherent, verifiable slices |
| test-driven-development | Test business logic, behavior changes or regressions where applicable |
| debugging-and-error-recovery | Reproduce an unexpected failure and identify its supported cause |
| api-and-interface-design | Define stable public contracts and module interfaces |
| frontend-ui-engineering | Build or change accessible, responsive user-facing interfaces |
| code-simplification | Reduce relevant complexity while preserving approved behavior |
| code-review-and-quality | Review correctness, architecture, security and missing evidence |
| security-and-hardening | Evaluate actual trust boundaries, permissions or sensitive inputs |
| performance-optimization | Measure and improve an evidenced performance problem |
| observability-and-instrumentation | Make relevant runtime behavior diagnosable |
| documentation-and-adrs | Record decisions, contracts, operations or reusable context |
| technote | Use adaptive reports for conversation, planning and implementation, and the four-level TechNote method for explanations |

## UCORN domain workflows

Use these alongside the relevant engineering workflow. Domain definitions,
attachments, units and drawing conventions come from UCORN's contracts.

| Skill | Apply when |
| --- | --- |
| [well-schematic-domain](../.agents/skills/well-schematic-domain/SKILL.md) | Interpret a well configuration or define a component's domain scope |
| [well-component-modeling](../.agents/skills/well-component-modeling/SKILL.md) | Design component identity, host references and attachment relationships |
| [well-schema-units](../.agents/skills/well-schema-units/SKILL.md) | Validate input, units, depth datums and interval boundaries |
| [well-svg-layout](../.agents/skills/well-svg-layout/SKILL.md) | Change geometry, SVG layers, symbols or labels |
| [well-visual-qa](../.agents/skills/well-visual-qa/SKILL.md) | Verify fixtures, drawing output and visual regressions |
| [well-technical-research](../.agents/skills/well-technical-research/SKILL.md) | Verify uncertain oilfield definitions and equipment details |

## Read and route

Find the selected skill under `.agents/skills/SKILL-NAME/SKILL.md` for Codex or `.claude/skills/SKILL-NAME/SKILL.md` for Claude. Read its actual body before applying it. Use relevant shared/local references; do not preload the whole catalog.

Apply the [policy overlay](team-policy.md#upstream-workflow-overlay), current project rules and approved task contract. Existing stack, commands, model choice and permissions come from the project/runtime, not an upstream example.

If names collide with personal, managed or plugin skills, identify the effective source. Do not silently substitute another skill or edit global configuration. See [compatibility](agent-compatibility.md).

## Provenance

The sixteen engineering skills retain 26 instruction-only source files from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/tree/1401c8b8030e023baeebb31781a6653fe8e93026), commit `1401c8b8030e023baeebb31781a6653fe8e93026`: 16 SKILL.md files, two skill-local reference files, seven shared references and the original MIT license.

TechNote is new kit content. Its full method is maintained in [technote.md](technote.md), not copied into the skill.

[The manifest](skills-manifest.json) records the imported pin, project extensions, files and digests. The six domain skills retain their original content and metadata. See the [UCORN adoption record](agent-kit-adoption.md) for local evidence; upstream release results are not UCORN verification.
