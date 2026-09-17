# Security golden: rag-chat

- Prompt injection (Critical), chat.ts:34 — retrieved page text concatenated
  raw into the prompt; fix: wrap tool output in delimiters, system prompt
  states tool output is data with lowest precedence, refund action requires
  explicit user confirmation outside the model turn.
- A10 SSRF (Required), fetch.ts:12 — fetcher follows arbitrary URLs; fix:
  strict allowlist to the help-center host, no redirects off-host.
- Input validation: user query length-capped and logged without PII.
- No model output executes actions directly; allowlisted tool calls only.

Gates demonstrated: **owasp-check**, **input-validation**, **prompt-injection-defense**.