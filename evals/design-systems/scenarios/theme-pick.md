# Design Systems Eval: Theme Pick

## Scenario

A new marketing page needs a visual direction. Choose a genre, theme, and
macrostructure from the catalog, run the slop test, and log the result.

## Requirements

- Pick an explicit theme and macrostructure (no defaults)
- Rotate relative to the previous pair (Modern minimal/Fog + bento-grid)
- Pass the slop test with zero error failures
- Document the versioning decision (new tokens minor-bump v1.3.0) and the component API entry (documented props table)

## Expected Behavior

1. Theme chosen and justified (e.g. Bold & vibrant/Signal for a launch)
2. Macrostructure chosen and justified (e.g. centered hero)
3. Rotation respected (different genre from Fog/minimal)
4. Slop-test pass logged with the theme + macro pair

## Quality Gates

- **token-coverage**: Design tokens cover all use cases
- **slop-test**: Must pass the slop-test checklist before emitting UI
- **theme-rotation**: Must select an explicit theme and macrostructure, rotating across runs
- **versioning**: Proper versioning strategy (new tokens = minor bump + changelog)
- **component-documentation**: All components documented (props table for touched components)
