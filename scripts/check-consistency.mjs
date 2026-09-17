#!/usr/bin/env node

// Loom Consistency Check — mechanical backing for the skill-authoring gates
// (has-references, has-quality-gates, has-anti-rationalization).
// Verifies structural authoring contracts that the schema validator cannot:
//   1. every SKILL.yaml-declared reference exists on disk,
//   2. every declared reference is named in SKILL.md (progressive disclosure),
//   3. every file under references/ is declared in SKILL.yaml (no strays),
//   4. every declared quality gate id is taught in SKILL.md (not just declared),
//   5. Anti-Rationalization and Self-Critique sections exist with the 30/30 bar.
//
// Usage: node scripts/check-consistency.mjs  (exit 0 clean, 1 with failures)

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, basename } from 'node:path';

const rootDir = process.cwd();
const skillsDir = join(rootDir, 'skills');
let failures = 0;

function fail(skill, message) {
  failures += 1;
  console.log(`  ✗ ${skill}: ${message}`);
}

function skillDirs() {
  const out = [];
  for (const category of readdirSync(skillsDir)) {
    const catDir = join(skillsDir, category);
    let entries = [];
    try {
      entries = readdirSync(catDir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (entry.isDirectory()) out.push(join(catDir, entry.name));
    }
  }
  return out;
}

for (const dir of skillDirs()) {
  const name = `${basename(join(dir, '..'))}/${basename(dir)}`;
  const yamlPath = join(dir, 'SKILL.yaml');
  const mdPath = join(dir, 'SKILL.md');
  if (!existsSync(yamlPath) || !existsSync(mdPath)) {
    fail(name, 'missing SKILL.yaml or SKILL.md');
    continue;
  }
  const yaml = readFileSync(yamlPath, 'utf-8');
  const md = readFileSync(mdPath, 'utf-8');
  let ok = true;
  const markFail = (message) => {
    ok = false;
    fail(name, message);
  };

  // Declared references.
  const declared = [];
  for (const m of yaml.matchAll(/path:\s*["']?(\.\/references\/([^\s"']+))/g)) {
    declared.push({ rel: m[1], file: m[2] });
  }
  for (const { rel, file } of declared) {
    if (!existsSync(join(dir, rel))) {
      markFail(`declared reference missing on disk: ${rel}`);
    } else if (!md.includes(file)) {
      markFail(`declared reference never named in SKILL.md: ${file}`);
    }
  }

  // Files on disk that are not declared.
  const refsDir = join(dir, 'references');
  if (existsSync(refsDir)) {
    const declaredFiles = new Set(declared.map((d) => d.file));
    for (const f of readdirSync(refsDir)) {
      if (!declaredFiles.has(f)) {
        markFail(`references/${f} exists on disk but is not declared in SKILL.yaml`);
      }
    }
  }

  // Declared quality gates taught in the body.
  const qualitySection = yaml.match(/quality:\s*\n([\s\S]*?)(?=\n\w|\nreferences:|\n tags:|$)/);
  if (qualitySection) {
    for (const m of qualitySection[1].matchAll(/id:\s*["']?([a-z0-9-]+)/g)) {
      if (!md.includes(m[1])) {
        markFail(`quality gate '${m[1]}' declared but never taught in SKILL.md`);
      }
    }
  }

  // House patterns.
  if (!/anti-rationalization/i.test(md)) {
    markFail('missing Anti-Rationalization section');
  }
  if (!/self-critique/i.test(md)) {
    markFail('missing Self-Critique section');
  } else if (!md.includes('30/30')) {
    markFail('Self-Critique section missing the 30/30 bar');
  }

  if (ok) console.log(`  ✓ ${name}`);
}

if (failures > 0) {
  console.log(`\nConsistency: FAIL (${failures} issue(s))`);
  process.exit(1);
}
console.log('\nConsistency: PASS');
