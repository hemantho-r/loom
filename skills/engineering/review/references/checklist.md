# Review Checklist

## Context

- [ ] I understand what this change does and why
- [ ] I've read the related issue or spec

## Correctness

- [ ] Change matches spec/task requirements
- [ ] Edge cases handled
- [ ] Error paths handled
- [ ] Tests cover the change adequately

## Readability

- [ ] Names are clear and consistent
- [ ] Logic is straightforward
- [ ] No unnecessary complexity

## Architecture

- [ ] Follows existing patterns
- [ ] No unnecessary coupling
- [ ] Appropriate abstraction level

## Security

- [ ] No secrets in code
- [ ] Input validated at boundaries
- [ ] No injection vulnerabilities

## Performance

- [ ] No N+1 patterns
- [ ] No unbounded operations
- [ ] Pagination on list endpoints

## Verification

- [ ] Tests pass
- [ ] Build succeeds
- [ ] Manual verification done (if applicable)

## Verdict

- [ ] **Approve** — Ready to merge
- [ ] **Request changes** — Issues must be addressed
