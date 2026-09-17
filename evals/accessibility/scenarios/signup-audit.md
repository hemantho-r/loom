# Accessibility Eval: Signup Audit

## Scenario

Audit a signup page with an email input lacking a label, a password field
with placeholder-only text, a low-contrast gray submit button, and a
div-based custom dropdown operable by mouse only.

## Requirements

- Judge against WCAG 2.1 AA criteria
- Verify the full flow works keyboard-only
- Assess screen-reader compatibility (names, roles, states)

## Expected Behavior

1. Flag unlabeled inputs (1.3.1, 3.3.2) with fixes
2. Flag contrast failure (1.4.3) with measured ratio
3. Flag mouse-only dropdown (2.1.1) with keyboard pattern
4. Severity per finding (Critical/Serious/Moderate/Minor)

## Quality Gates

- **wcag-compliance**: Must check WCAG compliance
- **keyboard-navigation**: Must verify keyboard navigation
- **screen-reader**: Must check screen reader compatibility
