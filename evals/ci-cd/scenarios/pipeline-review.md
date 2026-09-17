# CI/CD Eval: Pipeline Review

## Scenario

Review a proposed pipeline that lints, tests, builds, then deploys main to
production on every green push — with no security scan and no documented
rollback.

## Requirements

- Tests must gate the deploy (no deploy on red)
- A security scan must run and block on failure
- The rollback path must be concrete (versioned redeploy or flag flip)

## Expected Behavior

1. Reject the pipeline as proposed (missing security + rollback)
2. Insert a security-scan job that blocks deploy
3. Add a versioned rollback (redeploy previous tag) with the exact command
4. Pin action versions and restrict deploy to main

## Quality Gates

- **tests-pass**: Tests pass before deploy
- **security-scan**: Security scan passes
- **rollback-plan**: Rollback plan exists
