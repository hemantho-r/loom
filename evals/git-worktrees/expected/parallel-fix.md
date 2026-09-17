# Git worktrees golden: parallel-fix

1. `git stash push -m "feature-auth WIP"` (explicit, named — or commit).
2. `git worktree add -b hotfix-login ../project-hotfix-login main`
3. Fix in `../project-hotfix-login`, commit `fix: resolve login redirect`,
   merge `hotfix-login` into `main` from the main checkout.
4. `git worktree remove ../project-hotfix-login && git worktree prune`;
   `git worktree list` shows only the main checkout.

Gates demonstrated: **clean-state**, **branch-naming**, **cleanup**.
