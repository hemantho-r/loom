# UI Review

## Overview

Systematic review of UI components for quality, consistency, accessibility, and responsiveness.

## When to Use

- After creating or modifying UI components
- During code review for frontend PRs
- When establishing design system standards
- Before releasing component libraries

## Workflow

### Step 1: Accessibility Check

Review components for accessibility:

- [ ] Semantic HTML elements used
- [ ] ARIA labels and roles present
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Color contrast sufficient (4.5:1 minimum)
- [ ] Alt text for images
- [ ] Form labels associated with inputs

### Step 2: Consistency Check

Review components for design consistency:

- [ ] Follows design system tokens (colors, spacing, typography)
- [ ] Consistent naming conventions
- [ ] Consistent prop patterns
- [ ] Consistent styling approach (CSS modules, Tailwind, etc.)

### Step 3: Responsiveness Check

Review components for responsive design:

- [ ] Works on mobile (320px+)
- [ ] Works on tablet (768px+)
- [ ] Works on desktop (1024px+)
- [ ] Touch targets adequate (44px minimum)
- [ ] Text readable without zoom

### Step 4: Component Quality

Review component implementation:

- [ ] Props are well-typed
- [ ] Default props provided
- [ ] Component is composable
- [ ] No unnecessary re-renders
- [ ] Memoization where needed

### Step 5: Generate Report

Create review report with:

- Issues found (categorized by severity)
- Suggestions for improvement
- Examples of fixes

## Quality Gates

- **check-accessibility**: Must check for accessibility issues
- **check-consistency**: Must check for design consistency
- **check-responsiveness**: Must check for responsive design

## Self-Critique Scoring

Before submitting review, score yourself (1-5):

| Axis | Question | Score |
|------|----------|-------|
| **Accessibility** | Did I check all accessibility criteria? | 1-5 |
| **Consistency** | Did I check design consistency? | 1-5 |
| **Responsiveness** | Did I check responsive design? | 1-5 |
| **Specificity** | Are my findings specific? | 1-5 |
| **Actionability** | Can the developer fix the issues? | 1-5 |
| **Completeness** | Did I review all components? | 1-5 |

**Minimum passing score:** 30/30

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "It looks fine on my screen" | Your screen isn't everyone's screen. |
| "Accessibility is optional" | 15% of users have disabilities. It's not optional. |
| "We'll fix the UI later" | Technical debt in UI is still debt. |
| "It's just a small pixel issue" | Small issues compound into bad UX. |
| "I clicked through it with a mouse, that's enough testing" | Mouse testing can't reveal a keyboard focus trap, a missing tab stop, or a focus ring that never appears — those only show up tabbing through by keyboard. |
| "It looked right at my browser's default width" | A component tested at one width and never resized will hide overflow, wrapping, and touch-target problems that only appear at 320px or at 768px. |
| "The component renders, so the review is done" | Rendering without error only proves the component compiles — it says nothing about whether it's usable, consistent, or accessible. |
| "This is a minor internal admin page, lower the bar" | The review checklist doesn't have an "internal" exception — the same users who need accessible controls need them regardless of which URL they're on. |
| "The design system component should already handle this" | A design-system `<Button>` being accessible doesn't guarantee the page composing five of them into a form is keyboard-navigable end to end. |

## Red Flags — STOP and Reconsider

If you catch yourself thinking or seeing:
- Reviewing at only one browser width instead of mobile/tablet/desktop
- Never having pressed Tab through the component to check focus order
- A severity-less finding ("this seems off") instead of a categorized, actionable one
- Approving because "it looks the same as the design mockup" without checking behavior
- A touch target under 44px waved through as "close enough"
- Skipping the report step because the issues found were "minor"

**All of these mean: stop, actually test keyboard-only and at real breakpoints, then finish the report.**

## Output Format

```json
{
  "accessibility": [
    { "severity": "error", "issue": "Missing alt text", "file": "Avatar.tsx", "line": 42 }
  ],
  "consistency": [
    { "severity": "warning", "issue": "Inconsistent spacing", "file": "Button.tsx" }
  ],
  "responsiveness": [
    { "severity": "warning", "issue": "Fixed width on mobile", "file": "Card.tsx" }
  ]
}
```

## References

- [accessibility-checklist.md](references/accessibility-checklist.md) — quick a11y checks and common fixes
- [component-patterns.md](references/component-patterns.md) — atomic-design patterns and component checklist
