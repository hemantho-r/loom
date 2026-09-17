# Contributing to Loom

Thank you for your interest in contributing to Loom!

## Getting Started

1. Fork the repository
2. Clone your fork
3. Install dependencies: `pnpm install`
4. Create a branch: `git checkout -b my-feature`

## Development

```bash
# Build all packages
pnpm build

# Run tests
pnpm test

# Lint
pnpm lint

# Validate skills
node scripts/validate-skills.mjs
```

## Creating a Skill

1. Run `loom init my-skill --category engineering`
2. Edit `SKILL.yaml` with your skill definition
3. Write `SKILL.md` with your skill instructions
4. Add references in `references/`
5. Add tests in `tests/`
6. Run `loom validate` to check for issues
7. Run `loom test` to verify tests pass

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
