#!/usr/bin/env node

// Loom Excalidraw extractor — structure-first transcription (see
// references/import-redraw.md). Reads an .excalidraw JSON file, pulls text
// labels and arrow bindings, and emits a Mermaid flowchart scaffold plus
// structure counts. Hand-drawn styling is intentionally not preserved.
//
// Usage: node scripts/extract-excalidraw.mjs <drawing.excalidraw>
// Exit 0 with scaffold on stdout, 2 on bad input.

import { readFileSync, existsSync } from 'node:fs';

function main() {
  const [file] = process.argv.slice(2);
  if (!file || !existsSync(file)) {
    console.error('Usage: node scripts/extract-excalidraw.mjs <drawing.excalidraw>');
    process.exit(2);
  }
  let doc;
  try {
    doc = JSON.parse(readFileSync(file, 'utf-8'));
  } catch {
    console.error(`Not valid Excalidraw JSON: ${file}`);
    process.exit(2);
  }
  const elements = doc.elements ?? [];

  const byId = new Map(elements.map((el) => [el.id, el]));
  const labels = new Map();
  for (const el of elements) {
    // Bound text belongs to its container; standalone text is its own node.
    if (el.type === 'text' && el.containerId && byId.has(el.containerId)) {
      labels.set(el.containerId, (el.originalText ?? el.text ?? '').trim());
    } else if (el.type === 'text') {
      labels.set(el.id, (el.originalText ?? el.text ?? '').trim());
    }
  }

  const nodes = [];
  for (const el of elements) {
    if (['rectangle', 'ellipse', 'diamond'].includes(el.type)) {
      const label = labels.get(el.id) ?? '(unlabeled)';
      nodes.push({ id: el.id, label, shape: el.type });
    }
  }
  const nodeIndex = new Map(nodes.map((n, i) => [n.id, `N${i}`]));
  const render = (n) => {
    const node = nodeIndex.get(n.id);
    if (n.shape === 'diamond') return `${node}{${n.label}}`;
    if (n.shape === 'ellipse') return `${node}([${n.label}])`;
    return `${node}[${n.label}]`;
  };

  const edges = [];
  for (const el of elements) {
    if (el.type === 'arrow' || el.type === 'line') {
      const s = el.startBinding?.elementId;
      const t = el.endBinding?.elementId;
      const label = labels.get(el.id) ?? '';
      edges.push({ source: s, target: t, label });
    }
  }

  const lines = ['flowchart TD'];
  for (const n of nodes) lines.push(`    ${render(n)}`);
  for (const e of edges) {
    const s = nodeIndex.get(e.source) ?? 'Unbound';
    const t = nodeIndex.get(e.target) ?? 'Unbound';
    lines.push(e.label ? `    ${s} -->|${e.label}| ${t}` : `    ${s} --> ${t}`);
  }
  console.log(lines.join('\n'));
  console.log(
    `\n<!-- extract-excalidraw: ${nodes.length} nodes, ${edges.length} edges from ${file} -->`
  );
}

main();
