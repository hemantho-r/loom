# Diagram Doctor Reference

## Overview

The Diagram Doctor diagnostic (`scripts/doctor.mjs`) provides environment and tooling diagnostics for diagram creation, extractor script integrity, rendering engine fallbacks, and catalog coverage.

## Running Diagnostics

Run the doctor script directly using Node.js:

```bash
node skills/design/diagram-design/scripts/doctor.mjs
```

## Checks Performed

1. **Python 3 Runtime:** Verifies `python3` availability for `self_check.py` structural budget validation.
2. **`self_check.py` Integrity:** Confirms python structural budget validator is present and functional.
3. **Extractor Script Verification:** Verifies brand (`extract-brand.mjs`), Draw.io (`extract-drawio.mjs`), and Excalidraw (`extract-excalidraw.mjs`) extractor scripts.
4. **Mermaid Rendering Engine:** Checks for local `@mermaid-js/mermaid-cli` (`mmdc`) or registers fallback mode for client-side / Live Editor rendering.
5. **Catalog Type Coverage:** Indexes diagram type coverage across `type-catalog.md`, `type-catalog-2.md`, and `type-catalog-3.md`.
