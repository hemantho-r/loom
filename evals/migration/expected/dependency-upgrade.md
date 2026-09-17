# Migration golden: dependency-upgrade

- Backup: `git tag pre-v3-migration` pushed to origin before any change.
- Strategy: strangler fig over route groups (auth → billing → rest), because
  route groups are independently testable; a middleware adapter bridges v2/v3
  signatures during the transition.
- Verification: route-group suite green after each group; full suite before
  removing the adapter.
- Rollback: `deploy-prod --rollback pre-v3-migration` — the tagged build
  redeploys through the standard pipeline, no manual steps.

Gates demonstrated: **backup**, **incremental**, **rollback-plan**.
