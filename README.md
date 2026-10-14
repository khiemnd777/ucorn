# ucorn

Agent setup uses [Agent Kit](https://github.com/khiemnd777/agent-kit) alongside
UCORN's six well-domain skills. Codex reads [AGENTS.md](AGENTS.md); Claude Code
imports the same file through [CLAUDE.md](CLAUDE.md). See the
[skills catalog](docs/skills-catalog.md), [project state](docs/project-state.md)
and [adoption record](docs/agent-kit-adoption.md) for scope and verification limits.
TechNote includes [adaptive opening and closing reports](docs/technote.md#adaptive-reports)
for conversation, planning and implementation.

For new work, the assistant starts with read-only Planning and presents the
current plan/task scope in chat. Human approval of that scope precedes file
writes, execution and writer assignments. Routine work and repairs continue
within valid approval; material approach changes require a replacement plan
and approval. See [approval policy](docs/team-policy.md#approval-and-autonomy)
and [P1 correction and verification](docs/tasks/AGENT-POLICY-002.md).

Explorer and Reviewer investigate or return findings without changing application
code, implementing repairs or deploying. Their tools and permissions follow the
runtime and approved task scope; role definitions do not impose a read-only
sandbox or tool allowlist. Authorized checks and evidence capture must name their
side effects, fixtures and destinations. See the
[8fedcd0 update and verification](docs/tasks/AGENT-KIT-004.md).

For a future Agent Kit update in this existing codebase, a useful request is:

```text
Inspect the Agent Kit update against UCORN's current instructions and setup.
Preserve existing project rules, skills, configuration and records.
Propose an update plan and wait for my approval.
After approval, apply the plan and verify the integration.
```

To install dependencies:

```bash
bun install
```

`bun.lock` pins dependency versions and integrity checksums. Use
`bun install --frozen-lockfile` for a reproducible install. The binary
`bun.lockb` was migrated to the text format supported by Bun 1.2 and later.
Package download URLs in the Bun, npm, and Yarn lockfiles use the public npm
registry.

To run:

```bash
bun run go:bun
```

The Bun server listens on `http://localhost:3000`.

To open the JSON editor and SVG preview:

```bash
bun run ui
```

Open `http://localhost:3001`. The UI uses English and provides line numbers, JSON syntax colors,
formatting, a sample payload, and SVG download. Use Tab to indent, Shift+Tab to
leave the editor, or Ctrl/⌘+Enter to render. The UI server reuses the Bun API
handler at `POST /hole`; it runs independently of the API on port 3000.
Edited JSON is kept in the current page, without browser storage or external
services. The sample loads and renders when the page opens. JSON syntax is
checked before submission. Completion v2 validates Tubing/TubingHanger and their
supported context; legacy payloads still have no full domain validation.
The sample includes cement around four casing strings and a production liner,
with a liner-top packer. See [sample notes](sample-data/README.md) for demo TOC
depths; edit each `Cement.startDepth` to change its top of cement.

Open `/` in a browser for API instructions. Send a JSON well payload to
`POST /hole` to generate SVG (`POST /` is also supported). Other methods on
`/hole` return 405, except CORS preflight `OPTIONS`. Empty or malformed JSON
returns 400; rendering errors return 500 without exposing a stack trace.
Completion v2 semantic failures return 400 with field-path diagnostics.
See the [Completion v2 contract](docs/well-schematic/completion-v2-contract.md)
and [component status](docs/well-schematic/completion-phase-1-plan.md).

Select **Tubing sample** in the editor to preview production tubing and its
named-seat tubing hanger. **Actual size** keeps labels readable with scrolling
inside the preview; **Fit preview** shows the whole figure.
The runnable fixture is `sample-data/well-tubing-hanger.json`; it uses explicit
MD/datum, units and `schemaVersion: 2`. Injection purpose and tapered tubing
are supported; dual tubing, TVD/trajectory and subsea hanger ports are not.

```bash
curl --fail-with-body http://localhost:3000/hole \
  -H 'Content-Type: application/json' \
  --data-binary @sample-data/well-5-holes-liner-hangers.json
```

To run the HTTP and cement geometry regression tests:

```bash
bun run test
```

To build:

```bash
bun run build
```

This project was created using `bun init` in bun v1.1.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

Completion packers v2: use **Packers sample** in the local editor for the four
implemented roles (production, liner-top, isolation, test), explicit annular
endpoints, MD intervals and declared set states. See the
[bounded runtime contract](docs/well-schematic/completion-packers.md) and
[component status tracker](docs/well-schematic/completion-phase-1-plan.md).

Completion crossover v2: use **Crossover sample** to connect two adjacent tubing
segments by explicit IDs at their MD junction. Solid OD/known-ID boundaries keep
the lumen open; the display glyph adds no physical tubing length. See the
[bounded crossover contract](docs/well-schematic/completion-crossover.md).

Completion joints v2: use **Coupling / Pup sample** for an ordinary external
same-OD tubing coupling and a physical Pup Joint segment. Pup length is already
included in the tubing string; separate detail glyphs preserve readability without
changing MD. See the [bounded joint contract](docs/well-schematic/completion-joints.md).

Agent Kit engineering skills retain the original Addy source pin: 22 of 26 canonical files remain unchanged; four have [documented adaptations](docs/skills-catalog.md#local-adaptations), with matching Claude mirrors and the original MIT notice. Verification follows [the agreed claim and actual risk](docs/team-policy.md#verification-scope-and-completion). Code integration, verified behavior and human acceptance remain separate; an API/UI/library error pauses its affected flow for a focused repair plan. Explicit Coordinator delegation adds no implicit Supervisor approval tier.
