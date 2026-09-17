# Monitoring & Observability

## Overview

Set up comprehensive monitoring, logging, and alerting.

## When to Use

- Setting up new services
- Improving observability
- Debugging production issues
- Meeting SLA requirements

## Workflow

### Step 1: Logging

Implement structured logging:

```typescript
logger.info('User created', {
  userId: user.id,
  email: user.email,
  timestamp: new Date().toISOString(),
});
```

### Step 2: Error Tracking

Structured logs tell you an error happened; error tracking tells you
whether it's a *new* problem or the same one recurring 400 times an hour.
Route exceptions through a dedicated error-tracking pipeline, not just
`logger.error`:

```typescript
try {
  await processOrder(order);
} catch (error) {
  // Structured log for the request-level record...
  logger.error('Failed to process order', { orderId: order.id, error: error.message });
  // ...and a fingerprinted error-tracking event for aggregation/alerting.
  errorTracker.captureException(error, {
    fingerprint: ['process-order', error.name],
    tags: { orderId: order.id },
  });
  throw error;
}
```

Set a threshold that pages someone when a fingerprint's occurrence rate
spikes (e.g. "> 10 occurrences of the same fingerprint in 5 minutes"),
not just "any error at all" — that alert fatigues fast. See
`references/metrics-patterns.md` for how error rate feeds into the RED
method alongside request rate and duration.

### Step 3: Metrics

Collect key metrics:

- Request rate
- Error rate
- Response time
- Resource usage

See `references/metrics-patterns.md` for the RED/USE methods and which
metric type (counter, gauge, histogram) fits each.

### Step 4: Tracing

Implement distributed tracing:

```typescript
const span = tracer.startSpan('process-order');
try {
  await validateOrder(order);
  await calculateTotal(order);
  await saveOrder(order);
} finally {
  span.end();
}
```

### Step 5: Alerting

Set up alerts:

- Error rate threshold
- Error-tracking fingerprint spike threshold
- Response time threshold
- Resource usage threshold

### Step 6: Dashboards

Create dashboards:

- Service health
- Request metrics
- Error metrics
- Performance metrics

## Structured Logging

```typescript
// Good
logger.info('Order processed', {
  orderId: order.id,
  userId: order.userId,
  total: order.total,
  duration: Date.now() - start,
});

// Bad
logger.info(`Order ${order.id} processed`);
```

## Key Metrics

| Metric | Description | Alert Threshold |
|--------|-------------|-----------------|
| Request Rate | Requests per second | < 10% baseline |
| Error Rate | Errors per second | > 1% |
| P99 Latency | 99th percentile response time | > 500ms |
| CPU Usage | CPU utilization | > 80% |
| Memory Usage | Memory utilization | > 80% |

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "We don't need logging" | You can't fix what you can't see. |
| "Logs are too verbose" | Verbose logs are better than no logs. |
| "Alerts are annoying" | Silent failures are worse. |
| "I'll just silence this alert, it fires too often" | A noisy alert usually means the threshold is wrong, not that the underlying condition is fine. Fix the threshold; don't mute the signal. |
| "We'll add monitoring after launch, once we know what matters" | You can't tell what mattered during an incident that happened before you had any instrumentation for it. |
| "This error already has a log line, that's enough" | A log line tells you it happened once. Without fingerprinted error tracking, you can't tell "happened once" from "happening 400 times an hour." |
| "One alert per metric is enough" | A single flat threshold can't distinguish a slow trend (leak) from a sudden spike (outage) — you'll miss one or the other. |
| "The dashboard looks fine, I checked it once" | Dashboards degrade silently when a metric stops reporting — "looks fine" can mean "showing stale data," not "healthy." |
| "I'll route this exception the same way as every other one" | Exceptions with different fingerprints need different alert thresholds — a payment failure and a cache-miss retry are not the same severity. |

## Red Flags — STOP and Reconsider

If you catch yourself thinking or seeing:
- Muting or raising an alert threshold without first checking why it's firing
- A `catch` block that logs but never sends to error tracking
- An alert with no runbook link or owner attached
- A metric with no alert at all because "it's usually fine"
- Log statements using string interpolation (`` `Order ${id} processed` ``) instead of structured fields
- A dashboard nobody has looked at since it was created
- Sensitive data (tokens, PII) flowing into logs or trace spans unredacted

**All of these mean: stop, fix the instrumentation or threshold, then move on — not paper over the noise.**

## Quality Gates

- **structured-logging**: Logs are structured
- **error-tracking**: Errors are tracked
- **performance-metrics**: Performance metrics collected

## Self-Critique Scoring

Before calling observability done, score yourself (1-5):

| Axis | Question | Score |
|------|----------|-------|
| **Structure** | Are logs structured JSON with context, not interpolated strings? | 1-5 |
| **Errors** | Do exceptions route to fingerprinted error tracking, not just logs? | 1-5 |
| **Metrics** | Are rate/error/latency/resource metrics all collected? | 1-5 |
| **Alerts** | Does every alert page someone with a runbook pointer? | 1-5 |
| **Secrets** | Is sensitive data excluded from all log/trace output? | 1-5 |
| **Dashboards** | Can a stranger assess service health in under a minute? | 1-5 |

**Minimum passing score:** 30/30

## References

- [logging-patterns.md](references/logging-patterns.md) — structured logging, levels, context propagation
- [metrics-patterns.md](references/metrics-patterns.md) — key metrics, thresholds, dashboards
