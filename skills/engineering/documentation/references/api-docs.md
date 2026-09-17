# API Reference Documentation

## Endpoint Documentation Template

```markdown
## POST /api/v1/users

Create a new user account.

### Authentication

Requires `Authorization: Bearer <token>` with `users:write` scope.

### Request Body

| Field      | Type   | Required | Description                          |
|------------|--------|----------|---------------------------------------|
| `email`    | string | yes      | Must be a unique, valid email address |
| `name`     | string | yes      | Display name, 1-100 characters        |
| `role`     | enum   | no       | One of `admin`, `member`. Default: `member` |

### Example Request

\`\`\`bash
curl -X POST https://api.example.com/v1/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "jane@example.com", "name": "Jane Doe"}'
\`\`\`

### Example Response — 201 Created

\`\`\`json
{
  "id": "usr_8f3c2a",
  "email": "jane@example.com",
  "name": "Jane Doe",
  "role": "member",
  "createdAt": "2026-01-15T09:30:00Z"
}
\`\`\`

### Error Responses

| Status | Code               | Meaning                          |
|--------|--------------------|-----------------------------------|
| 400    | `validation_error` | Missing/invalid field — see `details` array |
| 409    | `email_taken`      | Email already registered          |
| 401    | `unauthorized`     | Missing or invalid token          |
```

Every endpoint doc needs: method + path, auth requirement, request shape (table, not prose), one realistic example request, one example success response, and the error responses that are actually possible for that endpoint — not a generic "4xx/5xx" catch-all.

## Parameter Tables Over Prose

Bad: "The `limit` parameter controls how many results are returned and defaults to 20 but can't exceed 100."

Good:

| Param   | Type | Default | Constraints      |
|---------|------|---------|-------------------|
| `limit` | int  | 20      | 1–100              |
| `cursor`| string | none  | Opaque pagination token from previous response |

A table is scannable during integration debugging; a paragraph isn't. Reserve prose for behavior that genuinely can't be tabulated (e.g., "results are eventually consistent within 500ms of a write").

## Source-of-Truth Annotations (JSDoc / OpenAPI)

When the codebase already has JSDoc or OpenAPI annotations, the doc should be *generated from* or *checked against* them, not hand-maintained separately — hand-maintained API docs drift from the implementation within a few releases.

```typescript
/**
 * Creates a new user account.
 * @param input.email - Unique email address
 * @param input.name - Display name (1-100 chars)
 * @param input.role - Defaults to 'member'
 * @throws {ValidationError} If email is malformed or name is empty
 * @throws {ConflictError} If email is already registered
 */
async function createUser(input: CreateUserInput): Promise<User> { /* ... */ }
```

If the project has an OpenAPI spec (`openapi.yaml`/`swagger.json`), treat it as the source of truth: update the spec first, then regenerate the human-readable doc page from it, rather than editing the two independently.

## Versioning Callouts

When an endpoint's behavior differs across API versions, say so inline next to the affected field/response, not in a separate changelog the reader has to cross-reference:

```markdown
### `role` (added in v2; not present in v1 responses)
```

## Checklist Before Publishing

- Every example request/response was actually executed against a running instance (not hand-typed from memory)
- Every documented error code has a corresponding test or code path that produces it
- Auth requirements and required scopes are stated on every endpoint, not just once at the top of the doc
