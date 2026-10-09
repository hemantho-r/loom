# Contributing to Loom

Thank you for your interest in contributing to Loom!

## Getting Started

```bash
git clone https://github.com/hemantho-r/loom && cd loom
pnpm install
pnpm build
```

Then create a branch: `git checkout -b my-feature`.

(This is for working on the Loom repo itself. If you just want the skills,
you don't need any of this — see the [README](README.md) for the one
`npm install -g @loom-skills/loom` command.)

## Development

Repo-level scripts (not published anywhere — contributor tooling only):

| Script | What it does |
|---|---|
| `pnpm build` | Builds `@loom-skills/core`, `@loom-skills/schema`, and `@loom-skills/loom` (bundles the 26 skills into `dist/skills/`) |
| `pnpm test` | Runs each workspace package's own test suite |
| `pnpm lint` | Lints all packages |
| `pnpm validate` | Schema, naming, semver, and content-gate checks across all 26 skills. Exits non-zero on failure. |
| `pnpm check` | Verifies every declared reference file exists and is linked from its `SKILL.md` |
| `pnpm eval` | Traces eval scenarios back to the quality gates they reference |
| `pnpm generate:adapters` | Regenerates the Cursor/Claude adapter files (`adapters/`, `commands/`, `.claude-plugin/`) from the current skill set |

### Publishing (maintainers only)

`@loom-skills/core` and `@loom-skills/schema` are `"private": true` and never
published — only `@loom-skills/loom` ships to the registry.

```bash
pnpm run release:dry-run   # builds, then pnpm -r publish --access public --dry-run
pnpm run release           # the real thing, once `npm login` succeeds for an org member
```

## Creating a Skill

1. Create `skills/<category>/<name>/` by hand (see [`skills/meta/writing-skills/SKILL.md`](skills/meta/writing-skills/SKILL.md) for the authoring guide and `SKILL.yaml` schema)
2. Write `SKILL.yaml` with your skill definition
3. Write `SKILL.md` with your skill instructions
4. Add references in `references/`
5. Run `pnpm validate` to check for issues

## Skill Guidelines

- **Be specific** — Actionable steps, not vague advice
- **Be verifiable** — Clear exit criteria with evidence requirements
- **Be minimal** — Only what's needed to guide the agent
- **Be honest** — Don't invent facts or make unsupported claims

## Pull Requests

1. Ensure all tests pass
2. Ensure skills validate
3. Update documentation if needed
4. Add a clear PR description

## Code of Conduct

Be respectful, constructive, and professional.

## License

MIT
