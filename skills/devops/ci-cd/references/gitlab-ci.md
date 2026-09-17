# GitLab CI

## Basic Pipeline

```yaml
# .gitlab-ci.yml
stages:
  - lint
  - test
  - build
  - security
  - deploy

variables:
  NODE_VERSION: "20"

default:
  image: node:${NODE_VERSION}
  cache:
    key:
      files:
        - package-lock.json
    paths:
      - node_modules/

lint:
  stage: lint
  script:
    - npm ci
    - npm run lint

test:
  stage: test
  script:
    - npm ci
    - npm test

build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week
```

## Common Workflows

### Test (with matrix)

```yaml
test:
  stage: test
  parallel:
    matrix:
      - NODE_VERSION: ["18", "20", "22"]
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm test
```

### Deploy

```yaml
deploy:
  stage: deploy
  needs: ["lint", "test", "security"]
  script:
    - npm ci
    - npm run build
    - npm run deploy
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
  environment:
    name: production
  variables:
    DEPLOY_TOKEN: $DEPLOY_TOKEN
```

### Security Scan

```yaml
security:
  stage: security
  script:
    - npm audit
    - npm run security-scan
  # GitLab Ultimate/Premium also offers built-in SAST/dependency scanning
  # via `include: - template: Security/SAST.gitlab-ci.yml`
```

## Reusable Pipelines (includes)

```yaml
# .gitlab-ci.yml
include:
  - local: '.gitlab/ci/test-template.yml'

# .gitlab/ci/test-template.yml
.test-template:
  script:
    - npm ci
    - npm test

test:
  extends: .test-template
  stage: test
```

## Variables and Secrets

Set protected/masked variables in Project Settings → CI/CD → Variables
rather than committing them — they're available as `$VARIABLE_NAME`:

```yaml
deploy:
  script:
    - echo "Deploying with token"
  variables:
    API_KEY: $API_KEY
    DATABASE_URL: $DATABASE_URL
```

## Rules vs. `only`/`except`

Prefer `rules:` (the modern, more expressive syntax) over the deprecated
`only`/`except` keywords:

```yaml
deploy:
  rules:
    - if: '$CI_COMMIT_BRANCH == "main" && $CI_PIPELINE_SOURCE == "push"'
      when: on_success
    - when: never
```

## Best Practices

1. Use `cache` keyed on the lockfile, not the branch, to actually get hits
2. Use `needs:` to run independent jobs in parallel instead of relying on
   stage-only ordering
3. Use `rules:` instead of `only`/`except`
4. Use `artifacts:` with `expire_in` to avoid unbounded storage growth
5. Use protected variables for anything deploy-related
