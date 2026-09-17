# API Design Eval: Users Endpoint

## Scenario

Design a REST endpoint set for user profiles: list users, fetch one user,
create a user.

## Requirements

- Use plural nouns, no verbs in paths
- Define request/response schemas for each endpoint
- Define error responses (400, 404, 422 at minimum)
- State the versioning strategy

## Expected Behavior

1. `GET /v1/users`, `GET /v1/users/{id}`, `POST /v1/users`
2. User schema with id, name, email, createdAt
3. Error envelope with code, message, details
4. URL versioning (`/v1`) with a one-line rationale

## Quality Gates

- **naming-consistency**: API naming is consistent
- **error-handling**: Error responses defined
- **versioning**: API versioning strategy stated
