# Git Worktrees Eval: Parallel Fix

## Scenario

You are on `feature-auth` with uncommitted work when a login bug needs a
hotfix on `main`. Set up parallel work without stashing anything important.

## Requirements

- The new worktree must start from a clean state
- Branch and path must follow the naming convention
- The finished worktree must be removed and pruned

## Expected Behavior

1. Commit or explicitly handle uncommitted work first (no silent stash loss)
2. `git worktree add -b hotfix-login ../project-hotfix-login main`
3. Fix, commit, merge back, then `git worktree remove` + `prune`
4. `git worktree list` shows no leftover when done

## Quality Gates

- **clean-state**: Worktrees start from clean state
- **branch-naming**: Branches follow naming convention
- **cleanup**: Worktrees are cleaned up after use
