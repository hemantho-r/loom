# Monitoring Eval: Checkout Observability

## Scenario

The checkout service logs interpolated strings, swallows payment errors with
a generic `catch {}`, and has no latency metrics. Design its observability.

## Requirements

- Replace string logs with structured JSON including context
- Route exceptions to fingerprinted error tracking, not just logs
- Collect rate, error, latency, and resource metrics with alert thresholds

## Expected Behavior

1. Structured log example with orderId, userId, duration
2. Fingerprinted error event for payment failures with spike alert
3. Metric table (request rate, error rate, P99, CPU/memory) with thresholds
4. No sensitive data in any emitted field

## Quality Gates

- **structured-logging**: Logs are structured
- **error-tracking**: Errors are tracked
- **performance-metrics**: Performance metrics collected
