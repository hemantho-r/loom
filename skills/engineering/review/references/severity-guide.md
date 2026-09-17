# Severity Guide

## Critical

**Blocks merge.** Must be fixed before the change can be merged.

Examples:
- Security vulnerability
- Data loss or corruption
- Broken functionality
- Missing authentication/authorization

## Required

**Must address.** The author needs to fix these before merge, but they're not emergency-level.

Examples:
- Incorrect logic
- Missing error handling
- Poor naming that affects comprehension
- Missing tests for critical paths

## Nit

**Optional.** Minor suggestions that the author may ignore.

Examples:
- Formatting preferences
- Style suggestions
- Minor optimizations
- Alternative approaches that aren't clearly better

## Optional

**Worth considering.** Suggestions that could improve the code but aren't required.

Examples:
- Refactoring opportunities
- Alternative implementations
- Performance improvements
- Documentation suggestions

## FYI

**Informational.** Context for future reference, no action needed.

Examples:
- Related code that might be affected
- Historical context
- Links to relevant documentation
