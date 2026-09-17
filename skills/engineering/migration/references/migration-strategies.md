# Migration Strategies

## Strangler Fig Pattern

Gradually replace old system with new:

```
┌─────────────────────────────────────┐
│           New System                │
│  ┌─────────┐ ┌─────────┐ ┌───────┐ │
│  │ Feature │ │ Feature │ │ ...   │ │
│  └─────────┘ └─────────┘ └───────┘ │
└─────────────────────────────────────┘
         ↑              ↑
         │              │
┌────────┴──────────────┴────────────┐
│           Old System                │
│  ┌─────────┐ ┌─────────┐ ┌───────┐ │
│  │ Feature │ │ Feature │ │ ...   │ │
│  └─────────┘ └─────────┘ └───────┘ │
└─────────────────────────────────────┘
```

### Steps

1. Identify boundaries
2. Create abstraction layer
3. Implement new feature in new system
4. Route traffic to new system
5. Remove old code

## Branch by Abstraction

Introduce abstraction to allow parallel implementation:

```typescript
// Before
class UserService {
  async getUser(id: string) {
    return await this.db.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

// After
interface UserRepository {
  getUser(id: string): Promise<User>;
}

class PostgresUserRepository implements UserRepository {
  async getUser(id: string) {
    return await this.db.query('SELECT * FROM users WHERE id = $1', [id]);
  }
}

class MongoUserRepository implements UserRepository {
  async getUser(id: string) {
    return await this.collection.findOne({ _id: id });
  }
}
```

## Parallel Run

Run both systems simultaneously:

```
Request → Router → Old System → Response
              ↘ New System → Response (compared)
```

### Steps

1. Implement new system
2. Route copy of traffic to new
3. Compare responses
4. Gradually shift traffic
5. Remove old system

## Big Bang Migration

Replace everything at once:

- High risk
- Short duration
- Requires extensive testing
- Last resort

## Data Migration

### Schema Changes

```sql
-- Add column
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT false;

-- Migrate data
UPDATE users SET email_verified = true WHERE email IS NOT NULL;

-- Remove old column
ALTER TABLE users DROP COLUMN old_column;
```

### Data Transformation

```typescript
// Transform data
const transformed = raw.map(item => ({
  id: item._id,
  name: `${item.firstName} ${item.lastName}`,
  email: item.emailAddress,
}));
```

## Best Practices

1. Plan thoroughly
2. Backup before migration
3. Migrate incrementally
4. Test at each step
5. Have rollback plan
