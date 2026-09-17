# Gemini Configuration for Loom

## Skills

Loom provides the following skills:

### Test-Driven Development
```
/use @loom/tdd
```

### Code Review
```
/use @loom/review
```

### Debugging
```
/use @loom/debug
```

### Security Review
```
/use @loom/security
```

### Performance Optimization
```
/use @loom/performance
```

## Quality Gates

All skills enforce quality gates:
- **error**: Must be satisfied
- **warning**: Should be satisfied
- **info**: For reference only

## Context

Skills adapt to your project's context automatically:
- Language detection
- Framework detection
- Test runner detection
