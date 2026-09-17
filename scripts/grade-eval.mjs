#!/usr/bin/env node

// Loom Grade Eval — Half 1 (coverage) of docs/eval-grading.md.
// Checks that a submission addresses every requirement and quality gate of
// a scenario. This proves coverage, NOT quality — Half 2 (human/LLM rubric)
// still applies. Exit 0 with a score sheet, 1 with missed items.
//
// Usage:
//   node scripts/grade-eval.mjs <scenario.md> <submission.md>

import { readFileSync, existsSync } from 'node:fs';

const STOPWORDS = new Set(
  'a,an,the,and,or,not,no,of,to,in,on,for,with,by,from,as,at,is,are,was,were,be,been,it,its,this,that,these,those,must,should,can,will,each,every,all,any,into,over,under,per,via,must,using,use,used,before,after,when,what,which,who,how,why,one,two,must,also,only,just,than,then,than'.split(
    ','
  )
);

function singularize(w) {
  if (w.endsWith('ies') && w.length > 4) return w.slice(0, -3) + 'y';
  if (w.endsWith('ses') || w.endsWith('xes') || w.endsWith('ches')) return w.slice(0, -2);
  if (w.endsWith('s') && !w.endsWith('ss') && w.length > 3) return w.slice(0, -1);
  return w;
}

function contentWords(text) {
  // Split camelCase and snake_case so `userSchema` and `nextCursor`
  // contribute `user`/`schema`/`next`/`cursor` as matchable words.
  const split = text
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_]+/g, ' ');
  return (split.toLowerCase().match(/[a-z0-9][a-z0-9-]{2,}/g) ?? [])
    .flatMap((w) => (w.includes('-') && w.length > 8 ? w.split('-') : [w]))
    .filter((w) => !STOPWORDS.has(w))
    .map(singularize);
}

function parseScenario(path) {
  const content = readFileSync(path, 'utf-8');
  const reqsSection = content.match(/## Requirements\s*\n([\s\S]*?)(?=##|$)/);
  const gatesSection = content.match(/## Quality Gates\s*\n([\s\S]*?)(?=##|$)/);

  const requirements = [];
  if (reqsSection) {
    for (const line of reqsSection[1].split('\n')) {
      const trimmed = line.trim();
      if (trimmed.startsWith('-')) {
        requirements.push(trimmed.replace(/^-\s*/, '').replace(/`([^`]+)`/g, '$1'));
      }
    }
  }

  const gates = [];
  if (gatesSection) {
    for (const line of gatesSection[1].split('\n')) {
      const m = line.match(/\*\*(.+?)\*\*/);
      if (m) gates.push(m[1].trim());
    }
  }
  return { requirements, gates };
}

function main() {
  const [scenarioPath, submissionPath] = process.argv.slice(2);
  if (!scenarioPath || !submissionPath) {
    console.error('Usage: node scripts/grade-eval.mjs <scenario.md> <submission.md>');
    process.exit(2);
  }
  if (!existsSync(scenarioPath)) {
    console.error(`Scenario not found: ${scenarioPath}`);
    process.exit(2);
  }
  if (!existsSync(submissionPath)) {
    console.error(`Submission not found: ${submissionPath}`);
    process.exit(2);
  }

  const { requirements, gates } = parseScenario(scenarioPath);
  const submission = readFileSync(submissionPath, 'utf-8');
  const submissionLower = submission.toLowerCase();
  const submissionWords = new Set(contentWords(submission));

  const failures = [];

  // Substance check.
  const nonEmptyLines = submission.split('\n').filter((l) => l.trim().length > 0);
  console.log(`Substance: ${nonEmptyLines.length} non-empty lines`);
  if (nonEmptyLines.length < 5) {
    failures.push('Submission has fewer than 5 non-empty lines');
  }

  // Gate coverage.
  console.log('\nGate coverage:');
  for (const gate of gates) {
    const hit = submissionLower.includes(gate.toLowerCase());
    console.log(`  ${hit ? '✓' : '✗'} ${gate}`);
    if (!hit) failures.push(`Quality gate '${gate}' never mentioned in submission`);
  }

  // Requirement coverage via keyword overlap.
  console.log('\nRequirement coverage:');
  requirements.forEach((req, i) => {
    const keywords = [...new Set(contentWords(req))].slice(0, 8);
    const matched = keywords.filter((k) => submissionWords.has(k));
    const ok = keywords.length === 0 || matched.length > 0;
    console.log(`  ${ok ? '✓' : '✗'} req ${i + 1}: matched [${matched.join(', ')}]`);
    if (!ok) {
      failures.push(`Requirement ${i + 1} has zero keyword overlap: "${req.slice(0, 80)}"`);
    }
  });

  console.log('\nHalf 2 (quality) still required: see docs/eval-grading.md rubric.');
  if (failures.length > 0) {
    console.log('\nCOVERAGE: FAIL');
    for (const f of failures) console.log(`  - ${f}`);
    process.exit(1);
  }
  console.log('\nCOVERAGE: PASS');
}

main();
