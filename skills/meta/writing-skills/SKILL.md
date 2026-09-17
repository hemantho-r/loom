# Writing Skills

## Overview

Create well-structured, effective Loom skills.

## When to Use

- Creating a new skill
- Improving an existing skill
- Standardizing skill format

## Workflow

### Step 1: Define Purpose

Define skill purpose:

- What problem does it solve?
- When should it be used?
- What does it provide?

### Step 2: Choose Category and Invocation Mode

Select appropriate category:

- **engineering**: Code, testing, review, debugging
- **design**: UI, accessibility, diagrams, systems
- **productivity**: Planning, handoff, brainstorming, grilling
- **devops**: Deployment, monitoring, infrastructure
- **meta**: Skills about skills (authoring, composition)

Then choose who may invoke it (`invocation` in SKILL.yaml):

- **user**: explicit request only — interviews, brainstorms, anything that
  interrupts the user if it fires uninvited (e.g. `grill`).
- **model**: auto-invoke on context — linters of behavior like `tdd`,
  `review`, `security`.
- **either** (default): safe to call from either side.

### Step 3: Create Structure

Create skill structure:

```
skill-name/
├── SKILL.yaml        # Definition
├── SKILL.md          # Instructions
├── references/       # Supporting docs
└── tests/           # Test files
```

### Step 4: Define Capabilities

Define what skill provides:

```yaml
provides:
  - id: "capability-id"
    description: "What it does"
    input:
      - name: "input1"
        type: "string"
        required: true
    output:
      - name: "output1"
        type: "object"
```

### Step 5: Add Quality Gates

Define quality gates:

```yaml
quality:
  - id: "gate-id"
    type: "behavioral"
    description: "What to check"
    severity: "error"
```

### Step 6: Write Instructions

Write SKILL.md:

- Overview
- When to use
- Workflow steps
- Anti-rationalization
- Quality gates

### Step 7: Pressure-Test Discipline Skills (Recommended)

If the skill enforces discipline (has a real cost to follow, and a
tempting shortcut around it — like `tdd`, `review`, `security`, `debug`)
rather than being a pure reference, run it through a subagent before
publishing: give a fresh subagent a realistic pressure scenario WITHOUT
the skill, record its actual rationalization verbatim, then verify the
skill you wrote actually closes that specific hole. A self-scored
checklist tells you whether you think the skill reads well — it doesn't
tell you whether an agent under pressure will actually follow it. See
`references/testing-with-subagents.md` for the method. Skip this step for
pure-reference skills with no rule to violate.

## Skill Anatomy

### Required Sections

1. **Overview**: What the skill does
2. **When to Use**: Trigger conditions
3. **Workflow**: Step-by-step instructions

### Optional Sections

- **Anti-Rationalization**: Common excuses and rebuttals
- **Quality Gates**: What to verify
- **References**: Supporting documentation

## Quality Gates

- **has-quality-gates**: Skill has quality gates
- **has-anti-rationalization**: Skill has anti-rationalization
- **has-references**: Skill has references

## Self-Critique Scoring

Before publishing the skill, score yourself (1-5):

| Axis | Question | Score |
|------|----------|-------|
| **Purpose** | Is the trigger ("when to use") falsifiable? | 1-5 |
| **Workflow** | Could a stranger execute the steps without asking questions? | 1-5 |
| **Gates** | Is every quality gate taught in the body, not just declared? | 1-5 |
| **Anti-rationalization** | Are the top 3 excuses for skipping this skill rebutted? | 1-5 |
| **References** | Is every declared reference named in the body with a `when`? | 1-5 |
| **Invocation** | Is the invocation mode (user/model/either) set deliberately? | 1-5 |

**Minimum passing score:** 30/30

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "I don't need a references file, SKILL.md covers it" | This exact excuse produced dangling references and orphaned reference files across this repo's own skills — write the reference file, or don't declare it in SKILL.yaml. |
| "The self-critique score is high, the skill is done" | A self-score measures whether the author thinks it's clear, not whether an agent under pressure will follow it. Score and pressure-test are different checks. |
| "This category doesn't quite fit, I'll invent a new one" | An invented category with no matching `skills/<category>/` directory is exactly how this repo ended up with a phantom `data` category that never existed on disk. Use an existing category or add the directory for real. |
| "I'll write generic advice, it'll apply to everything" | Generic advice is what every audited-and-flagged Loom skill had in common — specificity to the actual domain is what separates a useful skill from filler. |
| "The quality gates are declared, that's the enforcement" | Declaring a gate in SKILL.yaml doesn't teach it — `loom validate` only checks gates it recognizes (structural/content); everything else needs the body to actually explain the behavior. |
| "I copied a working example from another skill's code, close enough" | An untested code example that looks plausible is exactly how this repo shipped a fabricated CLI command and an undefined helper function in two different skills. Verify it runs, or verify it's real. |
| "Nobody will actually invoke this skill under real pressure" | If that's true, it doesn't need an Anti-Rationalization table at all — but if it's a discipline skill (tdd/review/security-shaped), assume it will be, because that's exactly when skills get skipped. |

## Red Flags — STOP and Reconsider

- A `references:` entry in SKILL.yaml has no corresponding file on disk — `loom validate` will catch this, but check before shipping, not after.
- A reference file exists but SKILL.md never links to it in a `## References` section — an agent reading only SKILL.md can't discover it.
- The Anti-Rationalization table has 3 or fewer rows for a skill whose entire job is resisting a shortcut — that's a sign the excuses weren't actually gathered from a real failure, just invented in the abstract.
- A code example, API name, or CLI command is included without verifying it's real (running it, or checking it against actual documentation).
- Two skills' reference files cover near-identical ground with no cross-reference between them.
- The skill was published without anyone reading it end-to-end as if they were the agent about to follow it cold.

## References

- [skill-anatomy.md](references/skill-anatomy.md) — required files, gates, naming conventions
- [testing-with-subagents.md](references/testing-with-subagents.md) — pressure-testing a discipline skill with a subagent before publishing
