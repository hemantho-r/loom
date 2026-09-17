# Coding Standards

## General Principles

1. **Clarity over cleverness**
2. **Simple over complex**
3. **Explicit over implicit**
4. **Consistency over novelty**

## Naming

### Variables and Functions
- Use camelCase: `userName`, `getUser()`
- Be descriptive: `activeUsers` not `arr`
- Avoid abbreviations: `user` not `u`

### Classes and Types
- Use PascalCase: `UserService`, `UserProfile`
- Use nouns: `User` not `UserHandler`
- Interfaces: `IUser` or `User` (be consistent)

### Constants
- Use SCREAMING_SNAKE_CASE: `MAX_RETRIES`
- Group by domain: `API_TIMEOUT`, `DB_TIMEOUT`

## Functions

- Keep small (under 30 lines)
- One responsibility
- Avoid side effects
- Use pure functions when possible

## Comments

- Explain why, not what
- Keep up to date
- Use JSDoc for public APIs
- Don't comment obvious code

## Error Handling

- Use specific exceptions
- Handle errors at appropriate level
- Log with context
- Don't swallow errors

## Testing

- Test behavior, not implementation
- Use descriptive test names
- Follow AAA pattern: Arrange, Act, Assert
- Keep tests independent
