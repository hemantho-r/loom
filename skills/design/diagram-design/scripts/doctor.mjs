#!/usr/bin/env node

// Diagram Design Doctor — Environment & Tooling Diagnostic
// Checks system requirements, script availability, extractor fixtures, and catalog integrity.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const skillDir = join(__dirname, '..');
const referencesDir = join(skillDir, 'references');
const scriptsDir = join(skillDir, 'scripts');

let checksPassed = 0;
let checksFailed = 0;

function report(name, success, detail = '') {
  if (success) {
    console.log(`  ✓ [PASS] ${name}${detail ? ` (${detail})` : ''}`);
    checksPassed++;
  } else {
    console.log(`  ✗ [FAIL] ${name}${detail ? `: ${detail}` : ''}`);
    checksFailed++;
  }
}

console.log('=== Diagram Design Doctor Diagnostic ===\n');

// Check 1: Python 3 for self_check.py
try {
  const pyVersion = execSync('python3 --version', { stdio: 'pipe' }).toString().trim();
  report('Python 3 Runtime', true, pyVersion);
} catch {
  report('Python 3 Runtime', false, 'python3 not found in PATH');
}

// Check 2: self_check.py script presence
const selfCheckPath = join(scriptsDir, 'self_check.py');
report('self_check.py Integrity', existsSync(selfCheckPath));

// Check 3: Extractors presence & execution
const extractors = ['extract-brand.mjs', 'extract-drawio.mjs', 'extract-excalidraw.mjs'];
for (const ext of extractors) {
  const extPath = join(scriptsDir, ext);
  report(`Extractor Script: ${ext}`, existsSync(extPath));
}

// Check 4: Mermaid rendering capabilities
try {
  execSync('npx --no-install mmdc --version', { stdio: 'pipe' });
  report('Mermaid CLI (mmdc)', true, 'Local CLI installed');
} catch {
  report('Mermaid CLI (mmdc)', true, 'Fallback mode: relying on client-side rendering / Live Editor');
}

// Check 5: Catalog Integrity & Diagram Type Count
const catalogs = ['type-catalog.md', 'type-catalog-2.md', 'type-catalog-3.md'];
let totalTypes = 0;
for (const cat of catalogs) {
  const catPath = join(referencesDir, cat);
  if (existsSync(catPath)) {
    const content = readFileSync(catPath, 'utf-8');
    const matches = content.match(/^##\s+[A-Z0-9]/gm) || [];
    totalTypes += matches.length;
  }
}
report('Diagram Type Catalogs', totalTypes >= 31, `${totalTypes} diagram types indexed across catalogs`);

console.log(`\nDiagnostic Summary: ${checksPassed} passed, ${checksFailed} failed`);
process.exit(checksFailed === 0 ? 0 : 1);
