// Loom CLI - Init Command

import { Command } from 'commander';
import chalk from 'chalk';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const initCommand = new Command('init')
  .description('Initialize a new skill package')
  .argument('<name>', 'Skill name (e.g., my-skill)')
  .option('-c, --category <category>', 'Skill category', 'engineering')
  .action((name: string, options: { category?: string } = {}) => {
    const category = options.category || 'engineering';
    const skillDir = join(process.cwd(), 'skills', category, name);

    // Create directories
    mkdirSync(join(skillDir, 'references'), { recursive: true });
    mkdirSync(join(skillDir, 'tests'), { recursive: true });

    // Create SKILL.yaml
    const yaml = `name: "${name}"
version: "0.1.0"
description: "TODO: Describe what this skill does"
license: "MIT"
authors:
  - name: "Your Name"

provides:
  - id: "${name.replace(/-/g, '_')}"
    description: "TODO: Describe the capability"
    input:
      - name: "target"
        type: "string"
        required: true
    output:
      - name: "result"
        type: "object"

context:
  - type: "language"
    values: ["typescript", "javascript"]
    required: true

quality:
  - id: "has-overview"
    type: "content"
    description: "Skill has overview section"
    severity: "warning"

tags: []
category: "${category}"
difficulty: "intermediate"
`;
    writeFileSync(join(skillDir, 'SKILL.yaml'), yaml);

    // Create SKILL.md
    const md = `# ${name}

## Overview

TODO: Describe what this skill does and when to use it.

## When to Use

- TODO: Add triggering conditions

## Workflow

### Step 1: TODO

[Instructions]

## Quality Gates

- **has-overview**: Skill has overview section
`;
    writeFileSync(join(skillDir, 'SKILL.md'), md);

    // Create reference placeholder
    writeFileSync(join(skillDir, 'references', '.gitkeep'), '');

    // Create test placeholder
    writeFileSync(
      join(skillDir, 'tests', `${name}.test.ts`),
      `// Tests for ${name}
describe('${name}', () => {
  it('should load successfully', () => {
    // TODO: Add test
    expect(true).toBe(true);
  });
});
`
    );

    console.log(chalk.green(`Created skill: ${name}`));
    console.log(`\nLocation: ${skillDir}`);
    console.log('\nFiles created:');
    console.log(`  ${chalk.cyan('SKILL.yaml')} - Skill definition`);
    console.log(`  ${chalk.cyan('SKILL.md')} - Skill instructions`);
    console.log(`  ${chalk.cyan('references/')} - Reference files`);
    console.log(`  ${chalk.cyan('tests/')} - Test files`);
    console.log('\nNext steps:');
    console.log('  1. Edit SKILL.yaml with your skill definition');
    console.log('  2. Write SKILL.md with your skill instructions');
    console.log('  3. Run `loom validate` to check for issues');
  });
