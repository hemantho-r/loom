# Worktree Patterns

## Common Workflows

### Feature Development

```bash
# Create worktree for feature (this also creates and checks out the branch)
git worktree add -b feature-auth ../project-feature-auth main

# Work in feature worktree
cd ../project-feature-auth
# ... develop feature ...

# Return to main
cd ../project-main
```

### Quick Fix

```bash
# Create worktree for hotfix
git worktree add -b hotfix-login ../project-hotfix-login main

# Apply fix
cd ../project-hotfix-login
# ... fix bug ...
git commit -m "fix: resolve login issue"

# Return to main
cd ../project-main
git merge hotfix-login
```

### Code Review

```bash
# Create worktree for PR review
git worktree add -b review-pr-123 ../project-review-pr-123 pr-123

# Review code
cd ../project-review-pr-123
# ... review ...

# Clean up
cd ../project-main
git worktree remove ../project-review-pr-123
```

## Naming Convention

```
../project-[type]-[description]
```

Types:
- `feature`: New feature
- `hotfix`: Quick fix
- `review`: Code review
- `experiment`: Experimental work
- `release`: Release preparation

## Management Commands

```bash
# List worktrees
git worktree list

# Remove worktree
git worktree remove ../project-feature-auth

# Prune stale worktrees
git worktree prune

# Repair worktree
git worktree repair
```

## Best Practices

1. One worktree per branch
2. Clean up after use
3. Use descriptive names
4. Don't share worktrees
5. Commit before switching
