# Component API Documentation

## Component Structure

```
ComponentName/
├── ComponentName.tsx        # Main component
├── ComponentName.test.tsx   # Tests
├── ComponentName.stories.tsx # Storybook stories
├── index.ts                 # Exports
└── styles.ts                # Styled components/styles
```

## Component Template

```typescript
// ComponentName.tsx
import React from 'react';

export interface ComponentNameProps {
  /** Primary content */
  children: React.ReactNode;
  /** Variant style */
  variant?: 'primary' | 'secondary';
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Disabled state */
  disabled?: boolean;
  /** Click handler */
  onClick?: () => void;
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
}) => {
  return (
    <button
      className={`component ${variant} ${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

## Documentation Template

```markdown
# ComponentName

Brief description of the component.

## Usage

\`\`\`tsx
import { ComponentName } from '@design-system';

<ComponentName variant="primary" size="md">
  Click me
</ComponentName>
\`\`\`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | ReactNode | - | Yes | Primary content |
| variant | 'primary' \| 'secondary' | 'primary' | No | Variant style |
| size | 'sm' \| 'md' \| 'lg' | 'md' | No | Size |
| disabled | boolean | false | No | Disabled state |
| onClick | () => void | - | No | Click handler |

## Variants

### Primary
Description of primary variant.

### Secondary
Description of secondary variant.

## Accessibility

- Uses semantic button element
- Keyboard accessible
- Focus visible

## Examples

### Basic Usage
[Example code]

### With Icons
[Example code]

### In Forms
[Example code]
```
