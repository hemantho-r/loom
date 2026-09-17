# Brainstorming golden: rate-limits

Ideas: per-key token buckets; tiered quotas (free/pro/enterprise); progressive
proof-of-work on abuse signals; anomaly-based throttling; cached public
endpoints with long TTLs.

Assumption challenged: "all scrapers are hostile" — several are legitimate
integrations; punishing them pushes users away.

Decision: tiered quotas + anomaly throttling. Why: predictable for good users,
adaptive against abuse. Alternatives considered: blanket IP bans (rejected:
shared-NAT collateral). Trade-off: quota bookkeeping adds a Redis dependency.

Gates demonstrated: **divergent-then-convergent**, **challenge-assumptions**, **document-decisions**.
