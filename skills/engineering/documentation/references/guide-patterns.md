# Guide & Tutorial Patterns

Guides and tutorials are task-oriented, not reference material — the reader wants to accomplish something specific, not browse an API surface. That changes the structure.

## Guide vs. Tutorial

| | Guide | Tutorial |
|---|---|---|
| Goal | Reader accomplishes a specific real task | Reader learns a concept by building something |
| Assumes | Reader already knows the basics | Reader is new to the tool/domain |
| Structure | Numbered steps, minimal explanation | Narrative, explains *why* at each step |
| Example | "How to configure OAuth for your app" | "Build your first authenticated app" |

Don't write a "tutorial" that's actually a guide with more words, or a "guide" that stops to explain fundamentals — pick one and commit to its structure.

## Prerequisites Section

State exactly what the reader needs before starting — versions, accounts, and prior steps — as a checklist, not a sentence:

```markdown
## Prerequisites

- Node.js 18+
- An API key ([get one here](...))
- Completed the [Quick Start](./quick-start.md)
```

If a prerequisite is missing, the reader should find out in the first 10 seconds, not after step 6 fails.

## Step Numbering Rules

- One action per step. If a step has two verbs ("configure the client and register a webhook"), split it.
- Each step shows the *result* of the action (a code snippet, a screenshot, or expected output), not just the instruction — "run `x`" without showing what success looks like leaves the reader unsure if it worked.
- Steps are runnable in order with no hidden setup between them. If step 4 silently requires something from outside the guide, that's a missing prerequisite, not an implicit assumption.

```markdown
### Step 3: Register the webhook

\`\`\`bash
curl -X POST https://api.example.com/webhooks \
  -d '{"url": "https://yourapp.com/hook"}'
\`\`\`

You should see a `201` response with a `webhook_id`. Save it — you'll need it in Step 5.
```

## Troubleshooting Sections

Structure as symptom → cause → fix, not as an FAQ of things the writer thought of:

```markdown
## Troubleshooting

**"401 Unauthorized" on every request**
Your API key is missing the required scope. Regenerate it with `scope=write` enabled.

**Webhook never fires**
Check that your endpoint returns `200` within 5 seconds — the platform retries 3 times then gives up silently.
```

Populate this section from real support tickets or issues when they exist, not speculation — a troubleshooting section full of problems no one has actually hit is dead weight, and one missing the problem everyone actually hits is worse than having none.

## Keeping Guides From Rotting

- Pin exact versions in code examples (`react@18`, not "a recent version of React") so a reader can tell if the guide predates a breaking change.
- If a guide references a UI ("click Settings, then API Keys"), note the last-verified date — UI paths drift faster than APIs.
- Prefer linking to the reference docs for parameter details rather than repeating them inline; when the parameter list changes, the guide shouldn't need an edit.
