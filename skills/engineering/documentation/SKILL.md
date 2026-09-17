# Documentation

## Overview

Create clear, accurate, and maintainable technical documentation.

## When to Use

- Documenting APIs
- Writing tutorials or guides
- Creating README files
- Updating existing documentation

## Workflow

### Step 1: Audience Analysis

Identify target audience:

- Developers (technical depth)
- Users (task-focused)
- Operators (deployment focused)

### Step 2: Structure

Choose documentation structure:

- **README**: Quick start, installation, usage
- **API Reference**: Endpoints, parameters, responses
- **Guide**: Step-by-step walkthrough
- **Tutorial**: Learning-focused with examples

### Step 3: Content

Write documentation:

1. Overview (what and why)
2. Prerequisites
3. Installation
4. Usage examples
5. Configuration
6. Troubleshooting
7. FAQ

### Step 4: Examples

Provide working examples:

```typescript
// Example: Using the API
import { Client } from '@package/sdk';

const client = new Client({ apiKey: 'key' });
const result = await client.users.list();
```

### Step 5: Review

Verify documentation:

- Examples work
- Code is correct
- Links work
- No typos

## Quality Gates

- **accuracy**: Documentation is accurate
- **completeness**: Documentation covers all features
- **clarity**: Documentation is clear and concise

## References

- **[api-docs.md](./references/api-docs.md)** — endpoint documentation templates, parameter tables, and OpenAPI/JSDoc source-of-truth conventions. Load when writing API reference docs.
- **[guide-patterns.md](./references/guide-patterns.md)** — guide vs. tutorial structure, prerequisites sections, step numbering, and troubleshooting-section patterns. Load when writing a guide or tutorial.

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "Code is self-documenting" | Code shows *what*, never *why*. The reason a workaround exists, or why one approach was rejected, lives only in your head unless you write it down. |
| "We'll doc later" | Later means after you've forgotten the edge cases, the gotchas, and the reason for the weird bit. "Later" docs are worse docs, written from memory instead of context. |
| "Users can figure it out" | Every minute a user spends reverse-engineering your API from source is a minute they're not using your product — and a support ticket you'll answer instead. |
| "I tested this example when I wrote it" | Code drifts. An example that worked at write-time and was never re-run is a guess, not documentation. |
| "This is an internal tool, doesn't need real docs" | Internal tools outlive their authors. The next person maintaining it has less context than you do right now. |
| "The README is enough" | A README covers "get started." It doesn't cover "what does this parameter do" or "why did my request fail." Different audiences need different documents. |
| "I'll just paraphrase what the code does" | Paraphrased code isn't documentation, it's a second copy of the code that will silently go stale the moment one changes and not the other. |
| "Nobody reads docs anyway" | People don't read bad docs. They do read docs that answer their exact question in under 30 seconds — that's the bar, not "exists." |
| "I don't have time to write examples" | An endpoint description without an example request/response takes 3x longer to use correctly and generates 3x the support questions. |
| "It's obvious from the function name" | `processData()` is not documentation. If the name were enough, nobody would ever ask "what does this do?" — and they always do. |

## Red Flags — STOP and Fix the Docs

- You're writing "should be self-explanatory" instead of an explanation
- You haven't actually run the example you're about to publish
- The doc describes the API you meant to build, not the one that shipped
- You're documenting from memory of the code instead of reading it
- A troubleshooting section doesn't exist and you know people will hit errors
- You changed the code and didn't check which docs reference it
- "Configuration" section lists options without saying what happens if you don't set them

## Worked Example

<Bad>
```markdown
## listUsers()

Lists users.
```
Doesn't say what parameters it takes, what it returns, what happens on
error, or show a call — useless to anyone who hasn't already read the source.
</Bad>

<Good>
```markdown
## listUsers(options?)

Fetches a page of users.

**Parameters**
- `options.limit` (number, default 20, max 100) — page size
- `options.cursor` (string, optional) — opaque pagination cursor from a
  previous response's `nextCursor`

**Returns** `{ users: User[], nextCursor: string | null }` — `nextCursor`
is `null` on the last page.

**Throws** `RateLimitError` if more than 100 requests/minute.

```typescript
const { users, nextCursor } = await client.users.list({ limit: 50 });
```
```
Names every parameter and its default, states the shape of the return
value including the edge case (last page), and shows a runnable call.
</Good>

## Self-Critique Scoring

Before publishing docs, score yourself (1-5):

| Axis | Question | Score |
|------|----------|-------|
| **Accuracy** | Did every example run verbatim without edits? | 1-5 |
| **Completeness** | Is every public feature/endpoint covered? | 1-5 |
| **Clarity** | Would a newcomer complete the quickstart unaided? | 1-5 |
| **Structure** | Do overview/prereqs/usage/troubleshooting all exist? | 1-5 |
| **Links** | Do all links and anchors resolve? | 1-5 |
| **Freshness** | Is there an owner and review date for updates? | 1-5 |

**Minimum passing score:** 30/30
