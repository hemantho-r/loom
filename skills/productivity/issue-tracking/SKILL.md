# Issue Tracking

## Overview

Create and manage issues across GitHub, Linear, and local trackers.

## When to Use

- Creating issues from work done
- Linking commits to issues
- Tracking bugs and features
- Managing sprint backlogs

## Workflow

### Step 1: Determine Tracker

Choose appropriate tracker:

- **GitHub**: Open source, public projects
- **Linear**: Product-focused teams
- **Local**: Simple markdown-based tracking

### Step 2: Create Issue

Create well-structured issue:

```markdown
## Title
[Concise, descriptive title]

## Description
[What needs to be done and why]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Technical Details
[Implementation approach]

## Labels
- priority: high/medium/low
- type: bug/feature/chore
- status: todo/in-progress/done
```

### Step 3: Link Work

Link commits and PRs:

- GitHub: `Fixes #123`, `Closes #123`
- Linear: `ENG-123` in commit message
- Local: Reference issue ID

### Step 4: Update Status

Keep issue updated:

- Change status as work progresses
- Add comments with updates
- Close when complete

## GitHub Integration

```bash
# Create issue
gh issue create --title "Title" --body "Description" --label "bug"

# List issues
gh issue list --label "bug"

# Close issue
gh issue close 123
```

## Linear Integration

Linear has no official CLI (unlike GitHub's `gh`). Integrate via its GraphQL API at `https://api.linear.app/graphql`, authenticated with a personal API key passed directly as the `Authorization` header (no `Bearer` prefix):

```bash
# Create issue
curl https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation($teamId:String!,$title:String!){ issueCreate(input:{teamId:$teamId,title:$title}) { success issue { identifier url } } }","variables":{"teamId":"<team-id>","title":"Title"}}'

# List issues for a team
curl https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query($teamId:ID!){ team(id:$teamId){ issues { nodes { identifier title state { name } } } } }","variables":{"teamId":"<team-id>"}}'
```

See `references/linear-patterns.md` for update/comment mutations and webhook setup.

## Local Tracking

```markdown
# Issues

## Issue 001: [Title]
**Status:** In Progress
**Priority:** High
**Description:** [What needs to be done]
**Acceptance Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2
```

## References

- `references/github-patterns.md` — full GitHub CLI and Actions issue-automation patterns
- `references/linear-patterns.md` — Linear GraphQL API patterns for issues, projects, and webhooks

## Quality Gates

- **has-description**: Issue has clear description
- **has-acceptance-criteria**: Issue has acceptance criteria
- **has-labels**: Issue has appropriate labels

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "I'll create the issue later" | Later means never, or means creating it from a two-week-old memory with half the detail gone. Create now. |
| "It's too small for an issue" | Small issues prevent big problems — and "too small to track" is how the same small bug gets rediscovered three times. |
| "Everyone knows about this" | Everyone leaves eventually, forgets, or has a different memory of what "this" was. |
| "The title is obvious from the description" | Titles are what shows up in search results and sprint boards — a vague one means the issue is effectively unfindable in three months. |
| "Acceptance criteria are obvious, no need to write them" | Obvious to you, right now, mid-context. Not obvious to whoever picks it up, or to you in two weeks. If it's truly obvious, writing it down costs one sentence. |
| "I'll add labels later once I know priority" | Unlabeled issues don't show up in triage queries — "later" means it sits invisible until someone stumbles on it. |
| "This is basically a duplicate, I'll just comment on the old one" | If the scope actually differs, a comment buries a distinct piece of work inside an unrelated issue's history. |
| "The PR explains everything, the issue doesn't need detail" | PRs get merged and archived from active view; the issue is the thing that stays searchable and linkable long-term. |

## Red Flags — STOP and Reconsider

- The title is a fragment of the bug report copy-pasted verbatim ("crashes sometimes") instead of a specific, searchable summary.
- Acceptance criteria are missing or read as "fix the bug" — not falsifiable, can't tell when it's actually done.
- No labels are set because "I'll triage it properly later."
- The issue references "the thing we discussed" without linking to where that discussion happened.
- You're about to close an issue without checking whether its acceptance criteria actually hold, just because the related PR merged.

## Worked Example: Vague vs. Actionable

**Vague** (fails in 2 weeks — nobody can act on it cold):
```markdown
## Title
Search is broken

## Description
Users are saying search doesn't work right.
```

**Actionable**:
```markdown
## Title
Search returns 0 results for queries with hyphens (e.g. "left-handed")

## Description
Reported by 3 users in #support (links below). Root cause suspected:
the search index tokenizer splits on hyphens but the query parser
doesn't, so "left-handed" never matches the indexed tokens "left" and
"handed" separately. Affects any multi-word-with-hyphen query.

## Acceptance Criteria
- [ ] Query "left-handed" returns results that include the phrase
- [ ] Existing non-hyphenated queries still return unchanged results
      (regression check)
- [ ] Add a test case covering hyphenated multi-word queries

## Labels
- priority: high (support volume rising)
- type: bug
- status: todo
```

The actionable version names the specific symptom, a suspected cause,
falsifiable done-criteria, and enough context that whoever picks it up
doesn't need to ask the reporter anything first.

## Self-Critique Scoring

Before filing, score yourself (1-5):

| Axis | Question | Score |
|------|----------|-------|
| **Description** | Does the description state what and why, not just what? | 1-5 |
| **Criteria** | Are acceptance criteria falsifiable? | 1-5 |
| **Labels** | Are priority/type/status labels all set? | 1-5 |
| **Links** | Are related issues, commits, and PRs linked? | 1-5 |
| **Tracker fit** | Is this in the right tracker with the right team/project? | 1-5 |
| **Freshness** | Is status accurate as of right now? | 1-5 |

**Minimum passing score:** 30/30
