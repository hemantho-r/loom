# Linear Integration

Linear does not ship an official CLI. All programmatic access goes through
its GraphQL API at `https://api.linear.app/graphql`, authenticated with a
personal API key (from Linear Settings → API) passed as the `Authorization`
header with no `Bearer` prefix.

## Issues

```bash
# Create an issue
curl https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" -H "Content-Type: application/json" \
  -d '{
    "query": "mutation($teamId:String!,$title:String!,$description:String){ issueCreate(input:{teamId:$teamId,title:$title,description:$description}) { success issue { identifier url } } }",
    "variables": { "teamId": "<team-id>", "title": "Title", "description": "Body" }
  }'

# Query issues for a team, filtered by state
curl https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" -H "Content-Type: application/json" \
  -d '{
    "query": "query($teamId:ID!){ team(id:$teamId){ issues(filter:{state:{name:{eq:\"In Progress\"}}}) { nodes { identifier title state { name } } } } }",
    "variables": { "teamId": "<team-id>" }
  }'

# Update an issue'"'"'s state
curl https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" -H "Content-Type: application/json" \
  -d '{
    "query": "mutation($id:String!,$stateId:String!){ issueUpdate(id:$id,input:{stateId:$stateId}) { success } }",
    "variables": { "id": "<issue-id>", "stateId": "<state-id>" }
  }'

# Comment on an issue
curl https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" -H "Content-Type: application/json" \
  -d '{
    "query": "mutation($issueId:String!,$body:String!){ commentCreate(input:{issueId:$issueId,body:$body}) { success } }",
    "variables": { "issueId": "<issue-id>", "body": "Comment text" }
  }'
```

`issue-id` and `state-id` are UUIDs, not the human-readable `ENG-123`
identifier — look up an issue's internal `id` via a query filtered on
`identifier` first if you only have the short code.

## Projects and Teams

```bash
# List teams
curl https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" -H "Content-Type: application/json" \
  -d '{"query":"{ teams { nodes { id name } } }"}'

# List projects for a team
curl https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" -H "Content-Type: application/json" \
  -d '{
    "query": "query($teamId:ID!){ team(id:$teamId){ projects { nodes { id name } } } }",
    "variables": { "teamId": "<team-id>" }
  }'
```

## Commit Linking

Linear auto-links commits and PRs that reference an issue's identifier in
the message — no special syntax beyond including the identifier:

```bash
git commit -m "feat: add user authentication

ENG-123"
```

## Webhooks

Linear supports webhooks (configured in Settings → API → Webhooks) for:

- Issue create/update/remove
- Comment create/update
- Project update

Each webhook POSTs a JSON payload with an `action`, `type`, and `data`
field to the configured URL — verify the `Linear-Signature` header (HMAC
of the raw body using your webhook secret) before trusting the payload.

## Best Practices

1. Use team labels consistently
2. Set priority levels
3. Link pull requests to issues via their identifier in the PR description
4. Use cycles for sprint planning
5. Update issue state as work progresses, not just at completion
