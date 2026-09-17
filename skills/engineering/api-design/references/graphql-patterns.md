# GraphQL Patterns

## Schema Design

### Types

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
  createdAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  comments: [Comment!]!
}
```

### Queries

```graphql
type Query {
  user(id: ID!): User
  users(filter: UserFilter): [User!]!
  post(id: ID!): Post
  posts(filter: PostFilter): [Post!]!
}
```

### Mutations

```graphql
type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
}
```

## Input Types

```graphql
input CreateUserInput {
  name: String!
  email: String!
}

input UpdateUserInput {
  name: String
  email: String
}

input UserFilter {
  status: Status
  role: Role
}
```

## Error Handling

```graphql
type UserResult {
  user: User
  error: Error
}

type Error {
  code: String!
  message: String!
}
```

## Pagination

```graphql
type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type UserEdge {
  node: User!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
```

## Best Practices

1. Use singular for queries: `user(id: ID!)` not `getUser(id: ID!)`
2. Use plural for lists: `users` not `getUserList`
3. Use input types for mutations
4. Use Connection pattern for pagination
5. Use custom scalars for dates: `scalar DateTime`
