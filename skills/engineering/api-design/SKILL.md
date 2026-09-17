# API Design

## Overview

Design consistent, well-structured APIs following REST and GraphQL best practices.

## When to Use

- Designing new API endpoints
- Creating API specifications
- Reviewing existing APIs
- Migrating between API styles

## Workflow

### Step 1: Domain Modeling

Identify domain entities:

- Resources (nouns)
- Relationships
- Operations (verbs)

### Step 2: Resource Design

Design resources:

```
/users
/users/{id}
/users/{id}/posts
/posts
/posts/{id}/comments
```

### Step 3: Endpoint Design

Design endpoints:

| Method | Path | Description |
|--------|------|-------------|
| GET | /users | List users |
| GET | /users/{id} | Get user |
| POST | /users | Create user |
| PUT | /users/{id} | Update user |
| DELETE | /users/{id} | Delete user |

### Step 4: Request/Response

Define request/response schemas:

```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "createdAt": "ISO8601"
}
```

### Step 5: Error Handling

Define error responses:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": []
  }
}
```

### Step 6: Versioning

Choose versioning strategy:

- URL versioning: `/v1/users`
- Header versioning: `Accept: application/vnd.api+json;version=1`

## Quality Gates

- **naming-consistency**: API naming is consistent
- **error-handling**: Error responses defined
- **versioning**: API versioning strategy

## Worked Example: Before/After

**Before** — verb-in-path, inconsistent casing, no error envelope:

```
POST /createUser          -> 200 {"user_id": 5, "Name": "..."}
GET  /getUserPosts/5      -> 200 [{"id":1,"body":"..."}]
POST /user/5/delete       -> 200 {"ok": true}
```

Problems: verbs duplicate what the HTTP method already says, `user_id`/`Name` mix snake_case and PascalCase in the same response, delete uses POST instead of DELETE, and there's no error shape at all — a 404 and a validation failure would look identical to a client.

**After** — resource nouns, consistent casing, one error envelope:

```
POST   /users              -> 201 {"id": "5", "name": "...", "createdAt": "..."}
GET    /users/{id}/posts   -> 200 {"data": [{"id": "1", "body": "..."}]}
DELETE /users/{id}         -> 204
```

Errors always take the shape from Step 5 regardless of which endpoint fails, so a client writes one error-handling path, not one per endpoint.

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "We'll add docs later" | APIs without docs are unusable the moment someone other than the author needs to call them. |
| "Versioning is overhead" | Breaking changes without versioning break every existing client silently and simultaneously. |
| "GET /users/{id}/get" | Redundant verbs violate REST — the HTTP method already says "get." |
| "This one endpoint can skip the error envelope, it can't really fail" | Every endpoint can fail — network errors, auth expiry, rate limits — an inconsistent error shape forces clients to special-case it. |
| "We'll pick a versioning strategy when we actually need to break something" | Retrofitting versioning onto an unversioned API is a breaking change itself — decide the strategy before the first breaking change, not after. |
| "Internal service-to-service APIs don't need this rigor" | Internal APIs still get consumed by multiple teams and outlive their original author's memory of the informal conventions. |
| "snake_case here, camelCase there — the client can handle both" | Mixed casing means every client needs per-field knowledge instead of one deserialization rule — consistency is what makes an API predictable enough to not need per-endpoint documentation. |
| "This is just a quick internal tool endpoint, skip the schema" | "Quick" endpoints are the ones most likely to get reused without anyone revisiting the design later. |

## Red Flags — STOP and Reconsider

- A URL path contains a verb (`/getUser`, `/createOrder`) instead of relying on the HTTP method
- Two endpoints return the same kind of resource with different field casing or naming
- An endpoint has no defined error response shape
- A breaking change is about to ship with no version bump and no migration path for existing clients
- DELETE is implemented as a POST, or GET has side effects

## Self-Critique Scoring

Before submitting the design, score yourself (1-5):

| Axis | Question | Score |
|------|----------|-------|
| **Naming** | Are all resources plural nouns with no verbs? | 1-5 |
| **Schemas** | Does every endpoint define request/response shapes? | 1-5 |
| **Errors** | Are 400/404/422 (at minimum) defined with the envelope? | 1-5 |
| **Versioning** | Is the versioning strategy stated with rationale? | 1-5 |
| **Consistency** | Would a stranger predict the next endpoint's shape? | 1-5 |
| **Docs** | Could a client implement against this with no extra questions? | 1-5 |

**Minimum passing score:** 30/30

## References

- [rest-patterns.md](references/rest-patterns.md) — naming, status codes, pagination, filtering, error format
- [graphql-patterns.md](references/graphql-patterns.md) — schema, inputs, connections, best practices
