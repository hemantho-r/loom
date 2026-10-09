#!/usr/bin/env node

// Loom Validate Skills Script
// Validates all skill definitions in the repository

import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { loadSkill, Validator } from '@loom-skills/core';

const rootDir = process.cwd();
const skillsDir = join(rootDir, 'skills');

console.log('Validating Loom skills...\n');

if (!existsSync(skillsDir)) {
  console.log('No skills directory found');
  process.exit(0);
}

const validator = new Validator();
let valid = 0;
let invalid = 0;

// Find all skills
const categories = readdirSync(skillsDir).filter((f) =>
  existsSync(join(skillsDir, f)) && !f.startsWith('.')
);

for (const category of categories) {
  const categoryPath = join(skillsDir, category);

  if (!existsSync(categoryPath)) continue;

  const skillDirs = readdirSync(categoryPath).filter((f) =>
    existsSync(join(categoryPath, f, 'SKILL.yaml'))
  );

  for (const skillDir of skillDirs) {
    const skillPath = join(categoryPath, skillDir);

    try {
      const skill = await loadSkill(skillPath);
      const result = validator.validateLoaded(skill);

      if (result.valid) {
        console.log(`✓ ${skill.definition.name}@${skill.definition.version}`);
        valid++;
      } else {
        console.log(`✗ ${skill.definition.name}`);
        for (const error of result.errors) {
          console.log(`  ${error.field}: ${error.message}`);
        }
        invalid++;
      }
      for (const warning of result.warnings) {
        console.log(`  ⚠ ${warning.field}: ${warning.message}`);
      }
      if (result.unchecked && result.unchecked.length > 0) {
        console.log(`  ℹ requires manual verification: ${result.unchecked.join(', ')}`);
      }
    } catch (error) {
      console.log(`✗ ${skillDir}: ${error instanceof Error ? error.message : error}`);
      invalid++;
    }
  }
}

console.log(`\nValidation complete: ${valid} valid, ${invalid} invalid`);

if (invalid > 0) {
  process.exit(1);
}
