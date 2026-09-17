# Logging Patterns

## Structured Logging

```typescript
// Good
logger.info('User created', {
  userId: user.id,
  email: user.email,
  timestamp: new Date().toISOString(),
});

// Bad
logger.info(`User ${user.id} created`);
```

## Log Levels

| Level | Usage |
|-------|-------|
| ERROR | System errors, exceptions |
| WARN | Potential issues, deprecations |
| INFO | Normal operations, business events |
| DEBUG | Detailed debugging information |
| TRACE | Most detailed, production usually off |

## Log Format

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "info",
  "message": "User created",
  "context": {
    "userId": "123",
    "email": "user@example.com"
  },
  "service": "user-service",
  "traceId": "abc-123"
}
```

## Context Propagation

```typescript
// Add context to all logs
const logger = winston.createLogger({
  defaultMeta: {
    service: 'user-service',
    version: '1.0.0',
  },
});

// Add request context
app.use((req, res, next) => {
  req.logger = logger.child({
    requestId: req.id,
    userId: req.user?.id,
  });
  next();
});
```

## Error Logging

```typescript
try {
  await processOrder(order);
} catch (error) {
  logger.error('Failed to process order', {
    orderId: order.id,
    error: error.message,
    stack: error.stack,
  });
  throw error;
}
```

## Performance Logging

```typescript
const start = Date.now();
await processOrder(order);
const duration = Date.now() - start;

logger.info('Order processed', {
  orderId: order.id,
  duration,
});
```

## Best Practices

1. Use structured logging
2. Include context
3. Don't log sensitive data
4. Use appropriate levels
5. Include trace IDs
