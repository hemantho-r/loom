# Loom Agents

Four hats for the `@loom-skills/lifecycle` phases. Each file carries Claude Code
subagent frontmatter (`name` + `description`), so they work two ways:

1. **Drop-in subagents** — copy a file into your project's
   `.claude/agents/` directory (or your harness's equivalent); the
   `lifecycle` skill's phase steps name which hat to invoke.
2. **Adopted roles** — a single agent reads the file and announces the hat
   ("Speaking as Adversarial Reviewer…"), giving adversarial distance
   without extra infrastructure.

| File | Hat | Phases | Gate it asks |
|------|-----|--------|--------------|
| `scope-keeper.md` | Scope Keeper | DEFINE, PLAN | "Is success falsifiable?" / "Could a stranger execute this?" |
| `builder.md` | Builder | BUILD, VERIFY | "Do tests trace to acceptance criteria?" / "Recorded evidence?" |
| `adversarial-reviewer.md` | Adversarial Reviewer | REVIEW | "Would I approve this under my own name?" |
| `release-captain.md` | Release Captain | SHIP | "Does on-call know exactly what to do at 3am?" |

Rule: the hat that built the work never wears the Reviewer hat on it in the
same pass. Handoff lines between hats are defined in each file and in
`skills/engineering/lifecycle/references/personas.md`.
