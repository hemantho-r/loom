# ARIA Patterns

## Common ARIA Patterns

### Landmarks

```html
<header role="banner">...</header>
<nav role="navigation">...</nav>
<main role="main">...</main>
<aside role="complementary">...</aside>
<footer role="contentinfo">...</footer>
```

### Navigation

```html
<nav aria-label="Main">
  <ul>
    <li><a href="/" aria-current="page">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>
```

### Accordion

```html
<div class="accordion">
  <h2>
    <button aria-expanded="false" aria-controls="panel1">
      Section 1
    </button>
  </h2>
  <div id="panel1" role="region" aria-labelledby="heading1" hidden>
    Content 1
  </div>
</div>
```

### Modal Dialog

```html
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Dialog Title</h2>
  <p>Dialog content</p>
  <button>Close</button>
</div>
```

### Tabs

```html
<div class="tabs">
  <div role="tablist" aria-label="Tabs">
    <button role="tab" aria-selected="true" aria-controls="panel1">
      Tab 1
    </button>
    <button role="tab" aria-selected="false" aria-controls="panel2">
      Tab 2
    </button>
  </div>
  <div role="tabpanel" id="panel1" aria-labelledby="tab1">
    Panel 1
  </div>
  <div role="tabpanel" id="panel2" aria-labelledby="tab2" hidden>
    Panel 2
  </div>
</div>
```

### Tooltip

```html
<button aria-describedby="tooltip1">Info</button>
<div id="tooltip1" role="tooltip">Tooltip content</div>
```

### Alert

```html
<div role="alert" aria-live="assertive">
  Error message
</div>
```

### Live Region

```html
<div aria-live="polite" aria-atomic="true">
  Updated content
</div>
```

## Best Practices

1. Use native HTML when possible
2. Add ARIA only when needed
3. Test with screen readers
4. Keep ARIA attributes updated
