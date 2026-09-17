# Monitoring golden: checkout-observability

- Log: `logger.info('Order processed', { orderId, userId, total, duration })`
  plus `service`, `traceId` on every event; card numbers never emitted.
- Error tracking: payment exceptions carry
  `fingerprint: ['checkout', error.name]`; alert pages when one fingerprint
  exceeds 10 occurrences in 5 minutes.
- Metrics: request rate (alert < 10% baseline), error rate (> 1%),
  P99 latency (> 500ms), CPU/memory (> 80%).
- Dashboard: single health view readable in under a minute.

Gates demonstrated: **structured-logging**, **error-tracking**, **performance-metrics**.
