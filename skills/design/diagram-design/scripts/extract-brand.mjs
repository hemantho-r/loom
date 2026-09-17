#!/usr/bin/env node

// Loom brand extractor — site-to-tokens step of references/import-redraw.md.
// Fetches a URL (or reads a local HTML file) and reports the dominant
// colors, font families, and spacing rhythm as a brand.ts skeleton.
// Network use requires the consumer skill's web-fetch capability.
//
// Usage:
//   node scripts/extract-brand.mjs <url-or-local-html-file>
// Exit 0 with skeleton on stdout, 2 on bad input.

import { readFileSync, existsSync } from 'node:fs';

function topEntries(freq, n) {
  return [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}

async function loadSource(arg) {
  if (/^https?:\/\//.test(arg)) {
    const res = await fetch(arg);
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${arg}`);
    return await res.text();
  }
  if (existsSync(arg)) return readFileSync(arg, 'utf-8');
  throw new Error(`Not a URL or file: ${arg}`);
}

function main() {
  const [arg] = process.argv.slice(2);
  if (!arg) {
    console.error('Usage: node scripts/extract-brand.mjs <url-or-local-html-file>');
    process.exit(2);
  }
  loadSource(arg).then((html) => {
    const colors = new Map();
    for (const m of html.matchAll(/#([0-9a-fA-F]{6})\b/g)) {
      const hex = `#${m[1].toLowerCase()}`;
      colors.set(hex, (colors.get(hex) ?? 0) + 1);
    }

    const fonts = new Map();
    for (const m of html.matchAll(/font-family\s*:\s*([^;}]+)/gi)) {
      const first = m[1].split(',')[0].trim().replace(/["']/g, '');
      if (first && !/^(inherit|initial|unset)/i.test(first)) {
        fonts.set(first, (fonts.get(first) ?? 0) + 1);
      }
    }

    const spacings = new Map();
    for (const m of html.matchAll(/(?:padding|margin|gap)(?:-[a-z]+)?\s*:\s*([0-9]+)px/gi)) {
      spacings.set(`${m[1]}px`, (spacings.get(m[1] + 'px') ?? 0) + 1);
    }

    const [topColor] = topEntries(colors, 1);
    const [secondColor] = topEntries(colors, 2).slice(1);
    const [topFont] = topEntries(fonts, 1);
    const [topSpacing] = topEntries(spacings, 1);

    console.log('// brand.ts — sampled, verify against the live site before use');
    console.log('// Source: ' + arg);
    console.log('export const brand = {');
    console.log('  colors: {');
    console.log(`    primary: '${topColor?.[0] ?? '#000000'}',`);
    console.log(`    secondary: '${secondColor?.[0] ?? '#666666'}',`);
    console.log('  },');
    console.log('  fonts: {');
    console.log(`    heading: '${topFont?.[0] ?? 'system-ui'}',`);
    console.log(`    body: '${topFont?.[0] ?? 'system-ui'}',`);
    console.log('  },');
    console.log('  spacing: {');
    console.log(`    unit: '${topSpacing?.[0] ?? '8px'}',`);
    console.log('  },');
    console.log('};');
  }).catch((err) => {
    console.error(`extract-brand: ${err.message}`);
    process.exit(2);
  });
}

main();
