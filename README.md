# Loom

> *Skills woven together — A skill operating system for AI coding agents.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Skills Count](https://img.shields.io/badge/Skills-26%20Official-green.svg)](#official-skill-catalog)
[![Quality Gates](https://img.shields.io/badge/Quality--Gates-100%25%20Verified-brightgreen.svg)](#quality-assurance)
[![Agents Supported](https://img.shields.io/badge/Agents-Claude%20%7C%20Cursor%20%7C%20Codex%20%7C%20Copilot%20%7C%20Gemini-orange.svg)](#agent-support)

Loom moves AI agent workflows beyond flat Markdown prompts into a structured package system. It provides machine-enforceable capability contracts, anti-rationalization discipline rules, multi-agent adapter generators, and runtime context adaptation.

---

## ⚡ Quick Start

```bash
# 1. Install Loom CLI globally
npm install -g @loom/cli

# 2. Validate installed skill packages
loom validate

# 3. Check structural consistency across skill packages
loom check

# 4. Compose skills into a unified workflow
loom compose @loom/tdd @loom/review -o workflow.md
```

---

## 📦 Official Skill Catalog (26 Packages)

Loom features 26 production-grade skill packages organized into 5 domain clusters:

### 🛠️ Engineering
| Skill Package | Slash Command | Description | Invocation |
|---|---|---|---|
| [`@loom/tdd`](skills/engineering/tdd/SKILL.md) | `/tdd` | Test-driven development with public test seams & vertical slicing | `model` |
| [`@loom/review`](skills/engineering/review/SKILL.md) | `/review` | 5-axis code review with parallel subagent delegation | `model` |
| [`@loom/debug`](skills/engineering/debug/SKILL.md) | `/debug` | Feedback-loop-first debugging & root-cause isolation | `either` |
| [`@loom/security`](skills/engineering/security/SKILL.md) | `/security` | OWASP Top 10, prompt-injection defense & durable audit stamps | `model` |
| [`@loom/api-design`](skills/engineering/api-design/SKILL.md) | `/api-design` | REST & GraphQL contract design patterns | `either` |
| [`@loom/adr`](skills/engineering/adr/SKILL.md) | `/adr` | Architectural Decision Records with context & consequence tracking | `either` |
| [`@loom/implementation`](skills/engineering/implementation/SKILL.md) | `/implementation` | Spec compliance & clean unit implementation | `model` |
| [`@loom/refactoring`](skills/engineering/refactoring/SKILL.md) | `/refactoring` | Behavior-preserving code transformations | `either` |
| [`@loom/git-worktrees`](skills/engineering/git-worktrees/SKILL.md) | `/git-worktrees` | Parallel branch management using isolated git worktrees | `user` |
| [`@loom/subagent-development`](skills/engineering/subagent-development/SKILL.md) | `/subagent-development` | Multi-agent orchestration & subagent isolation | `either` |
| [`@loom/lifecycle`](skills/engineering/lifecycle/SKILL.md) | `/lifecycle` | Feature triage (Spike vs. Bounded) & approval gate management | `either` |
| [`@loom/migration`](skills/engineering/migration/SKILL.md) | `/migration` | Zero-downtime database & dependency migration strategies | `either` |
| [`@loom/performance`](skills/engineering/performance/SKILL.md) | `/performance` | Measurement-first profiling & bottleneck elimination | `either` |
| [`@loom/documentation`](skills/engineering/documentation/SKILL.md) | `/documentation` | Accurate, maintainable technical documentation | `either` |

### 🎨 Design & UI
| Skill Package | Slash Command | Description | Invocation |
|---|---|---|---|
| [`@loom/diagram-design`](skills/design/diagram-design/SKILL.md) | `/diagram-design` | 39-type visual architecture & diagram doctor diagnostic | `either` |
| [`@loom/design-systems`](skills/design/design-systems/SKILL.md) | `/design-systems` | Design tokens, anti-slop rules & theme rotation logs | `either` |
| [`@loom/accessibility`](skills/design/accessibility/SKILL.md) | `/accessibility` | WCAG 2.1 compliance, keyboard nav & screen-reader audits | `either` |
| [`@loom/ui-review`](skills/design/ui-review/SKILL.md) | `/ui-review` | Component responsiveness, token compliance & UI audits | `model` |

### 🚀 Productivity
| Skill Package | Slash Command | Description | Invocation |
|---|---|---|---|
| [`@loom/grill`](skills/productivity/grill/SKILL.md) | `/grill-me` | Socratic frontier-batched interview before building | `user` |
| [`@loom/planning`](skills/productivity/planning/SKILL.md) | `/plan` | Sprint slicing, task sequencing & Given/When/Then criteria | `either` |
| [`@loom/handoff`](skills/productivity/handoff/SKILL.md) | `/handoff` | Multi-tier context transfer across sessions & subagents | `either` |
| [`@loom/brainstorming`](skills/productivity/brainstorming/SKILL.md) | `/brainstorm` | Divergent-then-convergent ideation & assumption testing | `user` |
| [`@loom/issue-tracking`](skills/productivity/issue-tracking/SKILL.md) | `/issue-tracking` | Falsifiable bug reporting & task tracking | `either` |

### ⚙️ DevOps
| Skill Package | Slash Command | Description | Invocation |
|---|---|---|---|
| [`@loom/ci-cd`](skills/devops/ci-cd/SKILL.md) | `/ci-cd` | Deployment pipeline hardening & automated rollback plans | `either` |
| [`@loom/monitoring`](skills/devops/monitoring/SKILL.md) | `/monitoring` | RED/USE telemetry, structured JSON logging & alert thresholds | `either` |

### 🧠 Meta
| Skill Package | Slash Command | Description | Invocation |
|---|---|---|---|
| [`@loom/writing-skills`](skills/meta/writing-skills/SKILL.md) | `/writing-skills` | Authoring & subagent pressure-testing for new skill packages | `user` |

---

## 🏗️ Skill Package Anatomy

Each Loom skill is packaged as a structured module:

```
skills/<category>/<skill-name>/
├── SKILL.yaml        # Machine-readable contract (provides/requires/context/quality)
├── SKILL.md          # Human/agent instructions & Anti-Rationalization rules
├── references/       # Supporting documentation & progressive disclosure guides
└── tests/           # Integration tests & scenario benchmarks
```

### Capability Contract (`SKILL.yaml`)

```yaml
name: "@loom/tdd"
version: "1.0.0"
description: "Test-Driven Development with test seams & vertical slicing"
provides:
  - id: "tdd-workflow"
    description: "Executes Red -> Green -> Refactor cycle"
quality:
  - id: "red-before-green"
    type: "behavioral"
    description: "Must watch test fail before implementation"
    severity: "error"
references:
  - path: "./references/good-tests.md"
    when: "for-test-design"
invocation: "model"
category: "engineering"
```

---

## 🛡️ Quality Assurance & CI Tooling

Loom enforces authoring quality and execution discipline through automated scripts:

* **Schema Validation (`npm run validate`)**: Verifies `SKILL.yaml` structural compliance and required headings.
* **Consistency Check (`npm run check`)**: Ensures 100% of declared references exist on disk and are linked in body instructions.
* **Eval Traceability (`npm run eval`)**: Maps scenario benchmark requirements to declared quality gates.
* **Adapter Generator (`npm run generate:adapters`)**: Translates Loom packages into agent-native configurations for Cursor rules, Claude plugins, Codex, Copilot, Gemini, and OpenCode.

---

## 💻 CLI Commands Reference

| Command | Description |
|---|---|
| `loom install <package>` | Install a skill package from registry |
| `loom list` | List all installed skills |
| `loom compose <skills...>` | Compose multiple skills into a cohesive workflow document |
| `loom validate [skill]` | Validate skill schemas and package structure |
| `loom check` | Verify reference linking and structural authoring consistency |
| `loom test [skill]` | Execute skill scenario tests |
| `loom init <name>` | Scaffold a new Loom skill package |

---

## 🤖 Agent Support & Integration

Loom skill packages compile seamlessly across major AI coding agents:

* **Claude Code** — Native plugin system
* **Cursor** — `.cursor/rules` format
* **Codex / Copilot** — Embedded instruction rulesets
* **Gemini / OpenCode** — Custom skill directories
* **Plain Markdown** — Direct `SKILL.md` consumption by any LLM

---

## 📜 License

Distributed under the [MIT License](LICENSE).
