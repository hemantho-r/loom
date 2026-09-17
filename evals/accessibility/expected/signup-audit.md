# Accessibility golden: signup-audit

- Critical (WCAG 3.3.2/1.3.1): email input has no associated label; fix:
  `<label for="email">` bound to the input.
- Serious (WCAG 1.4.3): submit button contrast 2.8:1, needs 4.5:1; fix:
  darken text or background.
- Critical (WCAG 2.1.1): custom dropdown mouse-only; fix: button trigger with
  arrow-key navigation and `aria-expanded`.
- Moderate: password placeholder-only text disappears on input; fix:
  persistent visible label.
- Screen reader: dropdown needs `role="listbox"`/`option` with selected state.
- Keyboard: full flow (email → password → dropdown → submit) verified tabbable
  with visible focus.

WCAG 2.1 AA: not achieved until Critical items are fixed.

Gates demonstrated: **wcag-compliance**, **keyboard-navigation**, **screen-reader**.
