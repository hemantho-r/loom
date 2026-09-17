#!/usr/bin/env node

// Loom draw.io extractor — structure-first transcription (see
// references/import-redraw.md). Reads a .drawio XML file, pulls labeled
// vertices and edges out of <mxCell> elements, and emits a Mermaid flowchart
// scaffold plus structure counts for verification.
//
// Usage: node scripts/extract-drawio.mjs <diagram.drawio>
// Exit 0 with scaffold on stdout, 2 on bad input.

import { readFileSync, existsSync } from 'node:fs';

function main() {
  const [file] = process.argv.slice(2);
  if (!file || !existsSync(file)) {
    console.error('Usage: node scripts/extract-drawio.mjs <diagram.drawio>');
    process.exit(2);
  }
  const xml = readFileSync(file, 'utf-8');

  const vertices = [];
  for (const m of xml.matchAll(/<mxCell[^>]*vertex="1"[^>]*>/g)) {
    const tag = m[0];
    const value = (tag.match(/value="([^"]*)"/) ?? [])[1] ?? '';
    const id = (tag.match(/id="([^"]*)"/) ?? [])[1] ?? `v${vertices.length}`;
    const style = (tag.match(/style="([^"]*)"/) ?? [])[1] ?? '';
    const label = value.replace(/<[^>]*>/g, '').trim();
    // Preserve node semantics draw.io encodes as shapes: decisions,
    // datastores, and terminators survive translation, not just boxes.
    let shape = 'box';
    if (/rhombus/.test(style)) shape = 'decision';
    else if (/cylinder/.test(style)) shape = 'datastore';
    else if (/ellipse/.test(style)) shape = 'terminator';
    if (label) vertices.push({ id, label, shape });
  }

  const edges = [];
  for (const m of xml.matchAll(/<mxCell[^>]*edge="1"[^>]*>/g)) {
    const tag = m[0];
    const source = (tag.match(/source="([^"]*)"/) ?? [])[1] ?? '';
    const target = (tag.match(/target="([^"]*)"/) ?? [])[1] ?? '';
    const value = (tag.match(/value="([^"]*)"/) ?? [])[1] ?? '';
    edges.push({ source, target, label: value.replace(/<[^>]*>/g, '').trim() });
  }

  const ids = new Map(vertices.map((v, i) => [v.id, `N${i}`]));
  const render = (v) => {
    const node = ids.get(v.id);
    if (v.shape === 'decision') return `${node}{${v.label}}`;
    if (v.shape === 'datastore') return `${node}[(${v.label})]`;
    if (v.shape === 'terminator') return `${node}([${v.label}])`;
    return `${node}[${v.label}]`;
  };
  const lines = ['flowchart TD'];
  for (const v of vertices) lines.push(`    ${render(v)}`);
  for (const e of edges) {
    const s = ids.get(e.source) ?? 'Unbound';
    const t = ids.get(e.target) ?? 'Unbound';
    lines.push(e.label ? `    ${s} -->|${e.label}| ${t}` : `    ${s} --> ${t}`);
  }
  console.log(lines.join('\n'));
  console.log(`\n<!-- extract-drawio: ${vertices.length} nodes, ${edges.length} edges from ${file} -->`);
}

main();
