# GitHub Integration

## CLI Commands

### Issues

```bash
# Create issue
gh issue create --title "Title" --body "Description" --label "bug"

# List issues
gh issue list --label "bug"
gh issue list --assignee "@me"

# Close issue
gh issue close 123

# Comment on issue
gh issue comment 123 --body "Comment"
```

### Pull Requests

```bash
# Create PR
gh pr create --title "Title" --body "Description"

# List PRs
gh pr list

# Merge PR
gh pr merge 123

# Review PR
gh pr review 123 --approve
gh pr review 123 --request-changes
```

### Labels

```bash
# Create label
gh label create "priority:high" --color "FF0000"

# List labels
gh label list

# Add label to issue
gh issue edit 123 --add-label "priority:high"
```

## Commit Linking

Link commits to issues:

```bash
# Close issue with commit
git commit -m "fix: resolve login issue

Fixes #123"

# Close multiple issues
git commit -m "fix: resolve issues

Fixes #123
Fixes #456"
```

## Best Practices

1. Use descriptive titles
2. Include acceptance criteria
3. Add appropriate labels
4. Link related issues
5. Close issues with commits
