# Component Patterns

## Atomic Design

### Atoms
Basic building blocks:
- Buttons
- Inputs
- Labels
- Icons

### Molecules
Combinations of atoms:
- Search form (input + button)
- Form field (label + input + error)
- Card (image + text + button)

### Organisms
Complex UI sections:
- Header (logo + nav + search)
- Footer (links + social + copyright)
- Product grid (cards + pagination)

### Templates
Page-level layouts:
- Landing page template
- Dashboard template
- Form template

### Pages
Specific instances of templates.

## Component Checklist

### Props
- [ ] Props are well-typed
- [ ] Default props provided
- [ ] Optional props marked
- [ ] Prop naming consistent

### State
- [ ] State managed correctly
- [ ] State lifted when needed
- [ ] Side effects handled

### Styling
- [ ] Styles scoped
- [ ] Themes supported
- [ ] Responsive design
- [ ] Dark mode support

### Accessibility
- [ ] Keyboard accessible
- [ ] Screen reader friendly
- [ ] Focus management
- [ ] ARIA attributes

### Testing
- [ ] Unit tests written
- [ ] Integration tests
- [ ] Visual regression tests
- [ ] Accessibility tests

### Documentation
- [ ] Usage examples
- [ ] Props documented
- [ ] Variations shown
- [ ] Do's and don'ts
