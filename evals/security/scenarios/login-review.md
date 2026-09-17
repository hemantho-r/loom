# Security Eval: Login Review

## Scenario

Review a login handler that builds a SQL query by string concatenation,
returns different error messages for "user not found" vs. "wrong password",
and stores the session token in a URL query parameter.

## Requirements

- Check the report against the OWASP Top 10
- Verify every user input is validated or parameterized
- Confirm no secrets or tokens leak into logs, URLs, or code

## Expected Behavior

1. Flag SQL injection (A03) — parameterize the query
2. Flag user enumeration via distinct error messages (A07) — generic message
3. Flag session token in URL (A01/A07) — HttpOnly cookie instead
4. Each finding maps to an OWASP category with a fix

## Quality Gates

- **owasp-check**: Check against OWASP Top 10
- **input-validation**: All user input must be validated
- **secrets-scan**: No secrets in code
