# REST API Patterns

## Resource Naming

### Rules
- Use nouns, not verbs
- Use plural for collections: `/users` not `/user`
- Use lowercase with hyphens: `/user-profiles` not `/userProfiles`
- Use path hierarchy: `/users/{id}/posts`

### Examples
```
/users
/users/{id}
/users/{id}/posts
/posts
/posts/{id}/comments
/comments
```

## HTTP Methods

| Method | Purpose | Idempotent | Safe |
|--------|---------|------------|------|
| GET | Read resource | Yes | Yes |
| POST | Create resource | No | No |
| PUT | Replace resource | Yes | No |
| PATCH | Partial update | No | No |
| DELETE | Delete resource | Yes | No |

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Unprocessable Entity |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## Pagination

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "perPage": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## Filtering

```
GET /users?status=active&role=admin
GET /posts?createdAfter=2024-01-01
GET /products?price[gte]=100&price[lte]=500
```

## Sorting

```
GET /users?sort=name
GET /users?sort=-createdAt
```

## Field Selection

```
GET /users?fields=id,name,email
```

## Error Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

## Rate Limiting

Headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```
