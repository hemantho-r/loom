# Loom

**A skill operating system for AI coding agents — skills as validated packages, not flat Markdown files.**

Most agent skills are a single `SKILL.md` an agent reads on faith. Loom packages each skill as `SKILL.yaml` (a machine-checkable capability contract: what it provides, what it requires, which quality gates it declares) plus `SKILL.md` (the instructions) plus `references/` (detail loaded only when needed). A validator actually checks the contract — schema, naming, semver, and the content sections a skill claims to have — instead of trusting that the author got it right.

Loom is a monorepo of 26 such skills across engineering, design, productivity, devops, and meta, plus an internal runtime (`@loom-skills/core`, not published — bundled directly into the CLI), a CLI (`@loom-skills/loom`, binary name `loom`), and generators that translate every skill into Claude Code, Cursor, and other agent-native formats.

---

## Quick start

```bash
git clone https://github.com/hemantho-r/loom && cd loom
pnpm install
pnpm build

pnpm validate          # schema + content-gate check across all 26 skills
loom compose @loom-skills/tdd @loom-skills/review -o workflow.md   # merge skills into one doc
```

`loom` above assumes the CLI is linked globally. From a fresh clone, either run it directly (`node packages/cli/dist/index.js validate`) or link it once:

```bash
cd packages/cli && npm link   # after `pnpm build` — makes `loom` available globally
```

### Installing via npm

`@loom-skills/loom` is a self-contained package: its build (`esbuild`, not `tsc`) bundles
`@loom-skills/core`'s code directly into `dist/index.js`, so the published artifact has
zero dependency on `@loom-skills/core`/`@loom-skills/schema` ever being installed separately
(`packages/cli/package.json`'s `dependencies` only lists real, independently
published npm packages — `commander`, `chalk`, `ora`, `vitest`, `yaml`).
Verified end-to-end this session: `npm pack` (plain npm, not pnpm) produces a
2-file tarball with no `@loom-skills/*`/`workspace:*` anywhere in its manifest, and
`npm install -g <that-tarball>` gives a fully working `loom` binary from a
directory with no relation to this repo.

`@loom-skills/core` and `@loom-skills/schema` are intentionally **not**
published — nothing external consumes either (no documented integration
beyond this repo's own internal build tooling), so they're marked
`"private": true` and stay workspace-only. Only the self-contained CLI is
shipped to the registry, under the name `@loom-skills/loom` (previously
`@loom-skills/cli` — renamed once the generic `cli` subpackage name no
longer had anything to disambiguate against). Once `npm login` succeeds for
an org member, run:

```bash
pnpm run release:dry-run   # builds, then pnpm -r publish --access public --dry-run
pnpm run release           # the real thing — only publishes @loom-skills/loom, core/schema are private
```

`npm install -g @loom-skills/loom` will work exactly as shown in Quick start above.

The published package also bundles all 26 skills (copied into `dist/skills/`
at build time) and installs them automatically via a `postinstall` script —
`npm install -g @loom-skills/loom` alone drops the full skill library into
`~/.loom/skills/`, with no separate `loom install` step and no other CLI
command required to get the base library in place.

---

## Get Loom (install the offering)

This repo ([github.com/hemantho-r/loom](https://github.com/hemantho-r/loom))
is laid out as a Claude Code plugin at its root (`skills/`,
`commands/`, `agents/`, `hooks/` + `.claude-plugin/`), so every agent host
can consume the same 26 skills.

```bash
# Claude Code — one-time marketplace setup, then install
/plugin marketplace add hemantho-r/loom
/plugin install loom@loom-marketplace
```

| Host | How to install |
|---|---|
| Claude Code | Marketplace above, or copy `commands/loom-<skill>.md` into your project's `commands/` |
| Cursor | Copy `adapters/cursor/rules/<skill>.mdc` into `.cursor/rules/` (globs included) |
| Codex | `adapters/codex/plugin.json` indexes all 26 skills with repo-relative paths |
| Copilot | Point it at `adapters/copilot/copilot-instructions.md` |
| OpenCode | Point it at `adapters/opencode/AGENTS.md` |
| Gemini | Point it at `adapters/gemini/GEMINI.md` |
| Any agent | Read `skills/<category>/<name>/SKILL.md` directly — plain Markdown, no tooling |
| CLI users | `npm install -g @loom-skills/loom` — installs all 26 skills automatically into `~/.loom/skills/` |

All adapter files are generated, not hand-written: `pnpm generate:adapters`
rebuilds them from the current skill set (26 slash commands, 26 Cursor
rules, both plugin manifests). The `SessionStart` hook (`hooks/`) announces
locally installed `.loom/skills/` at session start; it prints nothing when
none are installed.

---

## Skill anatomy

```
skills/<category>/<skill-name>/
├── SKILL.yaml       # capability contract: provides / requires / context / quality gates
├── SKILL.md         # instructions: overview, workflow, anti-rationalization, red flags
├── references/      # loaded only when the workflow points at them (progressive disclosure)
└── tests/           # optional — vitest specs `loom test` actually executes
```

A minimal contract:

```yaml
name: "@loom-skills/tdd"
version: "1.0.0"
description: "Test-driven development with test seams and vertical slicing"
provides:
  - id: "tdd-workflow"
    description: "Red -> Green -> Refactor cycle"
quality:
  - id: "red-before-green"
    type: "behavioral"
    severity: "error"
references:
  - path: "./references/good-tests.md"
invocation: "model"   # user | model | either
```

`loom validate` checks every field above — plus, for `type: content` gates like `has-overview`, whether `SKILL.md` actually has the heading it claims to. `behavioral`/`performance` gates are listed as **requiring manual verification**, not silently marked passed — Loom has no runtime that observes what an agent actually does, so it doesn't pretend to.

---

## The 26 skills

### Engineering
| Skill | Description |
|---|---|
| [`tdd`](skills/engineering/tdd/SKILL.md) | Red-green-refactor with test seams, vertical slicing, a worked bug-fix example |
| [`review`](skills/engineering/review/SKILL.md) | Five-axis review; parallel subagent delegation for non-trivial diffs |
| [`debug`](skills/engineering/debug/SKILL.md) | Feedback-loop-first diagnosis; condition-based waiting; backward call-stack tracing |
| [`security`](skills/engineering/security/SKILL.md) | OWASP Top 10, input validation, secrets scanning, prompt-injection defense for ingested content |
| [`api-design`](skills/engineering/api-design/SKILL.md) | REST/GraphQL contract design, naming and versioning discipline |
| [`adr`](skills/engineering/adr/SKILL.md) | Architecture Decision Records — context, alternatives, consequences |
| [`implementation`](skills/engineering/implementation/SKILL.md) | Spec-to-code: decomposition, flagging ambiguity instead of guessing |
| [`refactoring`](skills/engineering/refactoring/SKILL.md) | Behavior-preserving transformations, small steps, no scope creep |
| [`git-worktrees`](skills/engineering/git-worktrees/SKILL.md) | Parallel branches via isolated worktrees |
| [`subagent-development`](skills/engineering/subagent-development/SKILL.md) | Multi-agent task splitting, interface definition, conflict resolution |
| [`lifecycle`](skills/engineering/lifecycle/SKILL.md) | Feature triage (spike vs. bounded), approval gates, ship evidence |
| [`migration`](skills/engineering/migration/SKILL.md) | Incremental migration with backups and a named rollback point |
| [`performance`](skills/engineering/performance/SKILL.md) | Measure-first profiling before optimizing |
| [`documentation`](skills/engineering/documentation/SKILL.md) | Accuracy, completeness, and clarity for docs a stranger will read cold |

### Design
| Skill | Description |
|---|---|
| [`diagram-design`](skills/design/diagram-design/SKILL.md) | Mermaid-based diagrams across flowchart/sequence/ER/C4/etc., import from draw.io |
| [`design-systems`](skills/design/design-systems/SKILL.md) | Tokens over one-off overrides, brand extraction, theme rotation |
| [`accessibility`](skills/design/accessibility/SKILL.md) | WCAG 2.1 AA — keyboard nav, screen readers, contrast |
| [`ui-review`](skills/design/ui-review/SKILL.md) | Responsiveness, token compliance, and consistency audits |

### Productivity
| Skill | Description |
|---|---|
| [`grill`](skills/productivity/grill/SKILL.md) | Frontier-batched interview before building — no leading questions |
| [`planning`](skills/productivity/planning/SKILL.md) | Task scope, dependencies, Given/When/Then acceptance criteria |
| [`handoff`](skills/productivity/handoff/SKILL.md) | Context transfer between sessions or agents |
| [`brainstorming`](skills/productivity/brainstorming/SKILL.md) | Divergent-then-convergent ideation with assumption challenges |
| [`issue-tracking`](skills/productivity/issue-tracking/SKILL.md) | Falsifiable bug reports and actionable tickets |

### DevOps
| Skill | Description |
|---|---|
| [`ci-cd`](skills/devops/ci-cd/SKILL.md) | Pipeline stages, security scanning, a real rollback plan |
| [`monitoring`](skills/devops/monitoring/SKILL.md) | Structured logging, RED/USE metrics, error tracking distinct from logs |

### Meta
| Skill | Description |
|---|---|
| [`writing-skills`](skills/meta/writing-skills/SKILL.md) | How to author a Loom skill, including subagent pressure-testing before publishing |

---

## CLI

| Command | What it does |
|---|---|
| `loom validate [skill]` | Schema, naming, semver, and content-gate checks. Exits non-zero on failure. |
| `loom test [skill]` | Runs each skill's `tests/*.test.ts` via vitest and reports real pass/fail. |
| `loom compose <skills...>` | Merges multiple skills into one workflow document. |
| `loom init <name>` | Scaffolds a new skill's `SKILL.yaml` / `SKILL.md` / `references/`. |
| `loom list`, `loom install`, `loom search`, `loom publish` | Registry-oriented commands built around a `.loom/skills/` install directory, not this repo's `skills/` tree — there's no remote registry yet, so `install`/`publish` operate on local paths and `search` returns placeholder data. Treat as scaffolding for a future registry, not working package management. |

Repo-level scripts (not `loom` subcommands): `pnpm validate` (same checks, run across the whole `skills/` tree), `pnpm check` (verifies every declared reference file exists and is linked from its `SKILL.md`), `pnpm eval` (traces eval scenarios back to the quality gates they reference), `pnpm generate:adapters` (regenerates the Cursor/Claude adapter files below from the current skill set).

---

## Agent adapters

`pnpm generate:adapters` reads every skill and regenerates:

- `commands/loom-<skill>.md` — Claude-native slash commands at the plugin root (26 total)
- `.claude-plugin/plugin.json` + `.claude-plugin/marketplace.json` — install via `/plugin marketplace add hemantho-r/loom`
- `hooks/hooks.json` + `hooks/loom-session-start.mjs` — announces installed `.loom/skills/` at session start
- `adapters/claude/plugin.json` — custom skill index manifest, one entry per skill
- `adapters/codex/plugin.json` — same index shape for Codex, one entry per skill
- `adapters/cursor/rules/` — one `.mdc` rule per skill, with `globs` derived from each skill's declared language context

`adapters/codex`, `adapters/copilot`, `adapters/gemini`, and `adapters/opencode` hold hand-written, format-specific translations for those hosts. Every skill also works as plain Markdown — `SKILL.md` is readable on its own by any agent that accepts instruction files.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE).
