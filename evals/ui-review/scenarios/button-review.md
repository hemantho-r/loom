# UI Review Eval: Button Review

## Scenario

Review a new Button component: props use `any` types, spacing uses raw pixel
values instead of tokens, the focus ring is removed via CSS, and it renders
at a fixed 200px width.

## Requirements

- Check accessibility (focus, semantics, contrast)
- Check design-token consistency (spacing, colors, typography)
- Check responsive behavior (mobile through desktop)
- Categorize every finding by severity with a concrete fix

## Expected Behavior

1. Flag removed focus ring (accessibility, error)
2. Flag raw pixels instead of tokens (consistency, warning)
3. Flag fixed 200px width (responsiveness, warning)
4. Flag `any` props (component quality, warning)

## Quality Gates

- **check-accessibility**: Must check for accessibility issues
- **check-consistency**: Must check for design consistency
- **check-responsiveness**: Must check for responsive design
