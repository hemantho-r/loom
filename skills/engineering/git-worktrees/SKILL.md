# Git Worktrees

## Overview

Use git worktrees to work on multiple branches simultaneously without stashing.

## When to Use

- Working on multiple features in parallel
- Quick fixes while on another branch
- Code review while developing
- Testing changes against different branches

## Workflow

### Step 1: Create Worktree

```bash
# Create new worktree for a branch
git worktree add ../project-feature-a feature-a

# Create new worktree with new branch
git worktree add -b feature-b ../project-feature-b main
```

### Step 2: Work in Worktree

Each worktree is a full working copy:

- Edit files independently
- Run tests independently
- Commit independently

### Step 3: Switch Context

Switch between worktrees:

```bash
# List worktrees
git worktree list

# Move to different worktree
cd ../project-feature-a
```

### Step 4: Clean Up

Remove worktrees when done:

```bash
# Remove worktree
git worktree remove ../project-feature-a

# Prune stale worktrees
git worktree prune
```

## Naming Convention

```
../project-[branch-name]
```

Examples:
- `../project-feature-auth`
- `../project-bugfix-login`
- `../project-release-v1.0`

## Benefits

1. **No stashing**: Work on multiple branches without stashing
2. **Full IDE support**: Each worktree is a complete project
3. **Independent state**: Each worktree has its own HEAD
4. **Shared git history**: All worktrees share the same .git

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "I'll just stash it" | Stashes are unnamed, unordered, and easy to `stash pop` onto the wrong branch. A worktree is a separate directory — there's nothing to accidentally apply in the wrong place. |
| "It's too much overhead" | `git worktree add` takes seconds. A lost stash or a bad merge from working in the wrong branch costs far more than that. |
| "I only need one branch" | You need one branch *right now*. The interrupt (hotfix, review request) that needs a second one always arrives mid-task. |
| "I'll just switch branches, I don't have uncommitted changes" | You'll have them by the time you actually need to switch — that's when the urge to stash-and-switch shows up. |
| "One more file won't hurt working in the same tree" | Uncommitted changes from task A leaking into task B's diff is exactly how unrelated changes end up in the wrong PR. |
| "I'll remember which worktree has what" | You won't, after the third context switch. That's what `git worktree list` and the naming convention are for — use them instead of memory. |
| "Cleanup can wait" | Stale worktrees accumulate disk usage and stale branches nobody remembers the purpose of — "later" cleanup rarely happens. |
| "Copying the branch name loosely is fine" | A worktree path that doesn't match its branch is confusing the first time someone else (or future you) has to figure out what's in it. |

## Red Flags — STOP and Use a Worktree Properly

- You're about to `git stash` to switch branches mid-task
- You're editing files in the same working directory for two unrelated changes
- You can't remember which worktree has your in-progress work
- A worktree has uncommitted changes and you're about to `git worktree remove` it anyway
- You're `cd`-ing into a worktree whose branch you're not sure is checked out cleanly
- Two worktrees are pointed at the same branch (git will refuse this, but if you're forcing it, stop)

## Quality Gates

- **clean-state**: Worktrees start from clean state
- **branch-naming**: Branches follow naming convention
- **cleanup**: Worktrees are cleaned up after use

## Self-Critique Scoring

Before moving on, score yourself (1-5):

| Axis | Question | Score |
|------|----------|-------|
| **Clean state** | Did the worktree start from a clean HEAD? | 1-5 |
| **Naming** | Does the path follow `../project-[branch]`? | 1-5 |
| **Independence** | Is uncommitted work committed before switching? | 1-5 |
| **Purpose** | Is each worktree tied to exactly one branch? | 1-5 |
| **Cleanup** | Are finished worktrees removed/pruned? | 1-5 |
| **No stash debt** | Is nothing important sitting in a stash instead? | 1-5 |

**Minimum passing score:** 30/30

## References

- [worktree-patterns.md](references/worktree-patterns.md) — feature/hotfix/review workflows and management commands
