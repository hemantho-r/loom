# CI/CD golden: pipeline-review

- Verdict: reject as proposed.
- Added `security` job (`npm audit` + dependency scan) in `needs:` of deploy.
- Rollback: `deploy-prod --rollback <previous-tag>`; every deploy tags the
  release so the previous tag always exists.
- Deploy restricted to `refs/heads/main`; actions pinned (`checkout@v4`,
  `setup-node@v4`); secrets via `${{ secrets.* }}`, nothing inline.

Gates demonstrated: **tests-pass**, **security-scan**, **rollback-plan**.
