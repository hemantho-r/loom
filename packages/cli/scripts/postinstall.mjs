#!/usr/bin/env node

// Loom - postinstall
// Runs automatically after `npm install -g @loom-skills/loom`. Copies the
// bundled skills (shipped under dist/skills/ at publish time — see the
// `build` script in package.json) into the global ~/.loom/skills/ directory,
// so a plain npm install is enough to get the full skill library.
//
// Must never throw: a failing postinstall script aborts the entire
// `npm install`, which would be a much worse outcome than silently skipping
// the auto-setup.

import { existsSync, mkdirSync, cpSync, writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

function main() {
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const bundledSkillsDir = join(scriptDir, '..', 'dist', 'skills');

  if (!existsSync(bundledSkillsDir)) {
    // Nothing bundled (e.g. installed from a source checkout without a full
    // build) - nothing to auto-install, not an error.
    return;
  }

  const globalSkillsDir = join(homedir(), '.loom', 'skills');
  mkdirSync(globalSkillsDir, { recursive: true });

  let installed = 0;

  const categories = readdirSync(bundledSkillsDir, { withFileTypes: true }).filter((d) => d.isDirectory());

  for (const category of categories) {
    const categoryPath = join(bundledSkillsDir, category.name);
    const skillDirs = readdirSync(categoryPath, { withFileTypes: true }).filter((d) => d.isDirectory());

    for (const skillDir of skillDirs) {
      const sourcePath = join(categoryPath, skillDir.name);
      const yamlPath = join(sourcePath, 'SKILL.yaml');
      if (!existsSync(yamlPath)) continue;

      const yamlContent = readFileSync(yamlPath, 'utf-8');
      const nameMatch = yamlContent.match(/name:\s*"?([^"\n]+)"?/);
      const versionMatch = yamlContent.match(/version:\s*"?([^"\n]+)"?/);
      const skillName = (nameMatch?.[1] || skillDir.name).replace(/^@[^/]+\//, '');
      const skillVersion = versionMatch?.[1] || '0.0.0';

      const targetDir = join(globalSkillsDir, skillName);
      cpSync(sourcePath, targetDir, { recursive: true });

      const manifest = {
        name: nameMatch?.[1] || skillName,
        version: skillVersion,
        installedAt: new Date().toISOString(),
        source: 'bundled (@loom-skills/loom postinstall)',
      };
      writeFileSync(join(targetDir, '.loom-manifest.json'), JSON.stringify(manifest, null, 2));
      installed++;
    }
  }

  console.log(`loom: installed ${installed} skill(s) into ${globalSkillsDir}`);
}

try {
  main();
} catch (error) {
  console.warn(`loom: postinstall skill setup skipped (${error instanceof Error ? error.message : error})`);
}
