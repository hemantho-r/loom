# CI/CD Pipeline

## Overview

Set up and maintain continuous integration and deployment pipelines.

## When to Use

- Setting up new projects
- Improving deployment process
- Adding automated testing
- Implementing security scanning

## Workflow

### Step 1: Choose Platform

Select CI/CD platform:

- **GitHub Actions**: GitHub projects
- **GitLab CI**: GitLab projects
- **CircleCI**: Cross-platform
- **Jenkins**: Self-hosted

### Step 2: Define Stages

Define the pipeline as an ordered sequence of stages — the concept is the
same across platforms, only the YAML syntax differs:

1. **lint** — static checks, fails fast before anything expensive runs
2. **test** — unit/integration tests
3. **build** — produce the deployable artifact
4. **security** — dependency audit and security scanning
5. **deploy** — ship the artifact, gated on every prior stage passing

For the platform-specific syntax to express this (GitHub Actions' `jobs:`
with `needs:`, or GitLab CI's `stages:` list with per-job `stage:`), see
`references/github-actions.md` or `references/gitlab-ci.md` — don't mix
the two dialects in one file, they're not interchangeable.

### Step 3: Configure Jobs

Each stage becomes one job that: checks out the code, installs
dependencies, and runs one command. Keep jobs single-purpose — a lint job
that also runs tests makes failures harder to triage from the CI summary
view. See the "Common Workflows" section in your platform's reference file
for concrete job definitions (lint, test, security, deploy).

### Step 4: Add Security

Add a dedicated security-scanning job (dependency audit at minimum;
SAST/secret-scanning if your platform supports it) and make it a required
check before deploy — see the "Security Scan" example in
`references/github-actions.md` or `references/gitlab-ci.md`.

### Step 5: Deploy

Gate the deploy job on every prior stage (`needs: [lint, test, security]`
in GitHub Actions, `needs:` or stage ordering in GitLab CI) and restrict it
to the branch that should actually ship (e.g. `main`).

### Step 6: Plan for Rollback

A pipeline that can deploy but can't undo a deploy isn't finished. Pick one
mechanism before you need it under pressure:

- **Versioned/immutable deploys** — each deploy is a new, addressable
  artifact (container tag, release version); rollback = redeploy the
  previous version, not "revert and hope."
- **Feature flags** — ship code dark, flip a flag to enable; rollback is
  flipping the flag off, no redeploy needed.
- **Automated rollback triggers** — a deploy job that watches error-rate
  or health-check metrics post-deploy and auto-reverts if they cross a
  threshold, instead of waiting for a human to notice.

Document which mechanism your pipeline uses and where the rollback command
or flag actually lives — "we could roll back if we needed to" without a
concrete, tested path is not a rollback plan.

## GitHub Actions Example

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "Manual deploys are fine" | Manual deploys are error-prone. |
| "We don't need tests in CI" | Bugs in production are expensive. |
| "Security scanning is slow" | Breaches are slower. |
| "Skip the security scan for this one hotfix, we'll run it after" | "After" a hotfix ships is after it's already in front of users. Hotfixes are exactly the changes rushed enough to introduce a vulnerability. |
| "We have a rollback plan, we just haven't tested it" | An untested rollback path fails exactly when you need it most — under incident pressure, not during a calm dry run. |
| "This deploy is low-risk, it can skip the pipeline" | "Low-risk" is a guess made before the change ran through review. The pipeline is what turns the guess into a checked fact. |
| "The deploy gate is blocking, I'll just re-run until it passes" | A flaky gate that you re-run until green isn't a gate, it's decoration. Fix the flake or fix the check, don't retry past it. |
| "Feature flags mean we don't need a real rollback plan" | A flag flip is a rollback mechanism only if it's wired to the actual failure path — verify the flag disables the new behavior, don't assume. |
| "The pipeline passed, ship it" | Pipeline-green means the checks you wrote passed. It doesn't mean you wrote the right checks for this specific change. |

## Red Flags — STOP and Reconsider

If you catch yourself thinking or seeing:
- "Just this once" applied to skipping lint, tests, security scan, or the rollback step
- A deploy job with no `needs:`/stage-ordering gate on the stages before it
- Credentials or API keys typed directly into a workflow file instead of secrets
- "We'll add a rollback plan after this ships"
- A rollback mechanism that has never actually been exercised end-to-end
- Action/dependency versions unpinned (`@main`, `latest`) in a production pipeline
- Deploy triggered from a branch other than the one that passed review

**All of these mean: stop, close the gap, then deploy — not the other way around.**

## Quality Gates

- **tests-pass**: Tests pass before deploy
- **security-scan**: Security scan passes
- **rollback-plan**: Rollback plan exists

## Self-Critique Scoring

Before merging the pipeline, score yourself (1-5):

| Axis | Question | Score |
|------|----------|-------|
| **Stages** | Do lint, test, build, security all run on every PR? | 1-5 |
| **Security** | Does audit/scanning block the deploy on failure? | 1-5 |
| **Deploy gate** | Is deploy restricted to green main (not every push)? | 1-5 |
| **Secrets** | Are credentials in secrets, never inline? | 1-5 |
| **Rollback** | Is the rollback path concrete, versioned, and documented? | 1-5 |
| **Reproducibility** | Are action versions pinned and deps installed cleanly? | 1-5 |

**Minimum passing score:** 30/30

## References

- [github-actions.md](references/github-actions.md) — workflows, matrices, reusable workflows, secrets
- [gitlab-ci.md](references/gitlab-ci.md) — stages, jobs, environments, rollback jobs
