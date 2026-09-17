# Subagent Patterns

## Task Decomposition

### Independent Tasks
- Different files/modules
- No shared mutable state
- Clear interface boundaries
- No circular dependencies

### Dependent Tasks
- Shared state required
- Sequential execution needed
- Integration points defined

## Agent Assignment

### Capability Matching
- Match task to agent strengths
- Consider agent context window
- Provide complete task context

### Context Provision
- Include all relevant files
- Define expected output format
- Specify quality criteria

## Integration Patterns

### Merge Strategy
- Sequential merge (one by one)
- Parallel merge (all at once)
- Conflict resolution rules

### Verification
- Run integration tests
- Verify combined functionality
- Check for regressions

## Anti-Patterns

### Shared State
Don't let agents share mutable state during execution.

### Ambiguous Tasks
Don't assign tasks without clear success criteria.

### Late Integration
Don't wait too long to integrate results.
