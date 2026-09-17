#!/usr/bin/env node

// Loom Generate Adapters Script
// Regenerates adapters/claude/plugin.json and adapters/cursor/rules/*.mdc
// from every skill under skills/, so agent adapters cover the full skill
// library instead of a hand-picked subset.

import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, rmSync } from 'node:fs';
import { join, relative } from 'node:path';
import { getLoader } from '@loom/core';

const rootDir = process.cwd();
const skillsDir = join(rootDir, 'skills');
const claudeAdapterDir = join(rootDir, 'adapters', 'claude');
const cursorRulesDir = join(rootDir, 'adapters', 'cursor', 'rules');

const LANGUAGE_GLOBS = {
  typescript: ['**/*.ts', '**/*.tsx'],
  javascript: ['**/*.js', '**/*.jsx'],
  python: ['**/*.py'],
};

const skills = await getLoader().loadAll(skillsDir);
skills.sort((a, b) => a.definition.name.localeCompare(b.definition.name));

if (skills.length === 0) {
  console.log('No skills found under skills/ — nothing to generate');
  process.exit(0);
}

// ---------------------------------------------------------------------------
// adapters/claude/plugin.json
// ---------------------------------------------------------------------------

const pluginPath = join(claudeAdapterDir, 'plugin.json');
const existingPlugin = JSON.parse(readFileSync(pluginPath, 'utf-8'));

existingPlugin.skills = skills.map((skill) => {
  const shortName = skill.definition.name.replace(/^@[^/]+\//, '');
  const relPath = relative(claudeAdapterDir, skill.path);
  return {
    name: shortName,
    path: relPath.startsWith('.') ? relPath : `./${relPath}`,
    description: skill.definition.description,
  };
});

writeFileSync(pluginPath, `${JSON.stringify(existingPlugin, null, 2)}\n`);
console.log(`✓ adapters/claude/plugin.json: ${skills.length} skill(s)`);

// ---------------------------------------------------------------------------
// adapters/cursor/rules/*.mdc
// ---------------------------------------------------------------------------

if (existsSync(cursorRulesDir)) {
  rmSync(cursorRulesDir, { recursive: true });
}
mkdirSync(cursorRulesDir, { recursive: true });

for (const skill of skills) {
  const shortName = skill.definition.name.replace(/^@[^/]+\//, '');
  const languageContext = (skill.definition.context ?? []).find((c) => c.type === 'language');
  const globs = (languageContext?.values ?? [])
    .flatMap((lang) => LANGUAGE_GLOBS[lang] ?? [])
    .filter((glob, index, all) => all.indexOf(glob) === index);

  const frontmatterLines = [
    '---',
    `description: "Loom ${shortName} — ${skill.definition.description}"`,
  ];
  if (globs.length > 0) {
    frontmatterLines.push('globs:');
    for (const glob of globs) {
      frontmatterLines.push(`  - "${glob}"`);
    }
  }
  frontmatterLines.push('alwaysApply: false', '---', '');

  const mdcContent = `${frontmatterLines.join('\n')}\n${skill.content.trimEnd()}\n`;
  writeFileSync(join(cursorRulesDir, `${shortName}.mdc`), mdcContent);
}

console.log(`✓ adapters/cursor/rules/: ${skills.length} rule(s)`);

// ---------------------------------------------------------------------------
// adapters/claude/commands/<skill>.md (per-skill slash commands)
// ---------------------------------------------------------------------------

const claudeCommandsDir = join(claudeAdapterDir, 'commands');
mkdirSync(claudeCommandsDir, { recursive: true });

for (const skill of skills) {
  const shortName = skill.definition.name.replace(/^@[^/]+\//, '');
  const gates = (skill.definition.quality ?? [])
    .map((g) => `- **${g.id}**: ${g.description}`)
    .join('\n');
  const commandContent = [
    '---',
    `name: loom-${shortName}`,
    `description: "Loom ${shortName} — ${skill.definition.description}"`,
    '---',
    '',
    `# /loom-${shortName}`,
    '',
    skill.definition.description,
    '',
    'Follow the skill at the linked path end to end. Do not skip steps.',
    '',
    `Skill: ${relative(claudeCommandsDir, skill.path) || '.'}`,
    '',
    '## Quality gates (all must hold before you report done)',
    '',
    gates || '- (none declared)',
    '',
  ].join('\n');
  writeFileSync(join(claudeCommandsDir, `loom-${shortName}.md`), commandContent);
}

console.log(`✓ adapters/claude/commands/: per-skill slash commands`);

const usedDirs = readdirSync(skillsDir);
console.log(`\nGenerated adapters for ${skills.length} skill(s) across ${usedDirs.length} categor${usedDirs.length === 1 ? 'y' : 'ies'}.`);
