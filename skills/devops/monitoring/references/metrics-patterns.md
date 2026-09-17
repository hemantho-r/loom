# Metrics Patterns

## Metric Types — Pick the Right One

Using the wrong type is the most common metrics mistake:

| Type | Use for | Example | Wrong use |
|------|---------|---------|-----------|
| **Counter** | Values that only go up (resets on restart) | Total requests served | Tracking current active connections (that goes up *and* down — use a gauge) |
| **Gauge** | A value that goes up and down | Active connections, queue depth, memory used | Tracking total requests (should be a counter, not "requests this second") |
| **Histogram** | Distribution of a value, for percentiles | Request latency, response size | Anything you'd want to average and call it a day — averages hide tail latency |

```typescript
// Counter
requestsTotal.inc({ method: 'GET', route: '/orders', status: '200' });

// Gauge
activeConnections.set(currentConnectionCount);

// Histogram
requestDuration.observe({ route: '/orders' }, durationSeconds);
```

## The RED Method (request-driven services)

For anything that serves requests, track exactly these three:

- **R**ate — requests per second
- **E**rrors — failed requests per second (and error *rate*, errors/requests)
- **D**uration — how long requests take, as a histogram (so you can pull
  P50/P95/P99, not just an average that hides your worst 1%)

```typescript
httpRequestsTotal.inc({ route, status });
if (status >= 500) httpErrorsTotal.inc({ route, status });
httpRequestDuration.observe({ route }, durationSeconds);
```

## The USE Method (resources)

For infrastructure/resources (CPU, memory, disk, connection pools), track:

- **U**tilization — % of time the resource was busy
- **S**aturation — how much work is queued waiting for the resource
- **E**rrors — resource-level errors (disk I/O errors, OOM kills)

A connection pool at 100% utilization with a growing queue is saturated
— that's the leading indicator of an outage, not the utilization number
alone.

## Cardinality — The Silent Cost Killer

Every unique combination of label values creates a new time series. This
is fine:

```typescript
requestsTotal.inc({ method: 'GET', route: '/orders/:id', status: '200' });
```

This is a cardinality explosion that will take down or bankrupt your
metrics backend:

```typescript
// DON'T: userId has millions of unique values — this creates millions
// of time series, one per user, forever.
requestsTotal.inc({ userId: user.id, route: req.path });
```

Rules of thumb:
- Never put a user ID, request ID, email, or raw URL path (use a route
  *template* like `/orders/:id`, not the resolved `/orders/8492`) in a
  metric label.
- If a label's possible values aren't a small, bounded, known-in-advance
  set (HTTP methods, status code buckets, route templates, region names),
  it doesn't belong as a label — put it in a log or trace instead, where
  high-cardinality data belongs.

## Alert on Symptoms, Not Causes

Alert on what the user experiences (error rate, P99 latency breach), not
on every possible internal cause (CPU at 85%). High CPU that isn't
affecting error rate or latency doesn't need to page anyone at 3am.

```typescript
// Alert on this (symptom):
// error_rate > 1% for 5m  →  page
// p99_latency > 500ms for 10m  →  page

// Not on this alone (cause, without user impact evidence):
// cpu_usage > 80%  →  page
```

## Best Practices

1. Use histograms for anything you'll want a percentile from — not averages
2. Keep label cardinality bounded and known in advance
3. Alert on RED-method symptoms, use USE-method resource metrics for
   root-causing after the alert fires, not for triggering it
4. Name metrics consistently (`<namespace>_<subject>_<unit>`, e.g.
   `http_request_duration_seconds`)
