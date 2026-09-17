# Review Eval: PR Triage

## Scenario

Review a small pull request that adds email validation to a signup handler.
The diff introduces a regex check but no tests for invalid input, and it logs
the raw email on failure.

## Requirements

- Cover all five axes: correctness, readability, architecture, security, performance
- Label every finding with a severity (Required, Critical, Nit, Optional)
- Each finding must state the file/line and a concrete fix
- Approve or reject with a one-line rationale

## Expected Behavior

1. Flag missing invalid-input tests (correctness, Required)
2. Flag raw-email logging as a privacy issue (security, Critical)
3. Note regex readability or suggest a named validator (readability, Nit/Optional)
4. Give a final approve/reject verdict

## Quality Gates

- **five-axis-review**: Review covers all five axes
- **severity-labels**: Every finding has a severity label
- **actionable-feedback**: Every finding states a concrete fix
