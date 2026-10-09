// Loom CLI - Test Command

import { Command } from 'commander';
import chalk from 'chalk';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

/**
 * Resolve the vitest CLI entry point from @loom-skills/cli's own dependency,
 * regardless of where `loom test` is invoked from.
 */
function resolveVitestBin(): string {
  const vitestPkgPath = require.resolve('vitest/package.json');
  const vitestPkg = JSON.parse(readFileSync(vitestPkgPath, 'utf-8')) as {
    bin?: string | Record<string, string>;
  };
  const binEntry =
    typeof vitestPkg.bin === 'string' ? vitestPkg.bin : vitestPkg.bin?.vitest;
  if (!binEntry) {
    throw new Error('Could not resolve vitest executable');
  }
  return join(dirname(vitestPkgPath), binEntry);
}

function runSkillTests(testDir: string, testFiles: string[]): { passed: boolean; output: string } {
  const vitestBin = resolveVitestBin();
  const result = spawnSync(
    process.execPath,
    [vitestBin, 'run', ...testFiles, '--root', testDir, '--globals'],
    { cwd: testDir, encoding: 'utf-8' }
  );

  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  return { passed: result.status === 0, output };
}

export const testCommand = new Command('test')
  .description('Run skill tests')
  .argument('[skill]', 'Skill to test')
  .action((skillName?: string) => {
    try {
      const skillsDir = join(process.cwd(), 'skills');

      if (!existsSync(skillsDir)) {
        console.log(chalk.red('No skills directory found'));
        process.exit(1);
      }

      const skillDirs: string[] = [];

      if (skillName) {
        let skillPath = /^@[^/]+\//.test(skillName)
          ? join(skillsDir, skillName.replace(/^@[^/]+\//, ''))
          : join(skillsDir, skillName);

        if (!existsSync(skillPath)) {
          // Fall back to category scan: skills/*/<shortName>
          const short = skillName.replace(/^@[^/]+\//, '');
          const found = readdirSync(skillsDir, { withFileTypes: true })
            .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
            .map((d) => join(skillsDir, d.name, short))
            .find((p) => existsSync(join(p, 'SKILL.yaml')));
          if (found) skillPath = found;
        }

        if (!existsSync(skillPath)) {
          throw new Error(`Skill not found: ${skillName}`);
        }
        skillDirs.push(skillPath);
      } else {
        const categories = readdirSync(skillsDir).filter((f) =>
          existsSync(join(skillsDir, f)) && !f.startsWith('.')
        );

        for (const category of categories) {
          const categoryPath = join(skillsDir, category);
          if (!existsSync(categoryPath)) continue;

          const skills = readdirSync(categoryPath).filter((f) =>
            existsSync(join(categoryPath, f, 'SKILL.yaml'))
          );

          for (const skill of skills) {
            skillDirs.push(join(categoryPath, skill));
          }
        }
      }

      if (skillDirs.length === 0) {
        console.log(chalk.yellow('No skills found to test'));
        return;
      }

      console.log(chalk.bold('Running tests...\n'));

      let passed = 0;
      let failed = 0;
      let skipped = 0;

      for (const skillPath of skillDirs) {
        const yamlPath = join(skillPath, 'SKILL.yaml');
        const content = existsSync(yamlPath) ? readFileSync(yamlPath, 'utf-8') : '';
        const nameMatch = content.match(/name:\s*"?([^"\n]+)"?/);
        const currentSkillName = nameMatch?.[1] || skillPath.split('/').pop() || 'unknown';

        const testDir = join(skillPath, 'tests');
        if (!existsSync(testDir)) {
          console.log(chalk.gray(`  ${currentSkillName}: no tests (skipped)`));
          skipped++;
          continue;
        }

        const testFiles = readdirSync(testDir).filter((f) => f.endsWith('.test.ts') || f.endsWith('.test.js'));
        if (testFiles.length === 0) {
          console.log(chalk.gray(`  ${currentSkillName}: no test files (skipped)`));
          skipped++;
          continue;
        }

        const { passed: skillPassed, output } = runSkillTests(testDir, testFiles);

        if (skillPassed) {
          console.log(chalk.green(`  ${currentSkillName}: ${testFiles.length} test file(s) passed ✓`));
          passed++;
        } else {
          console.log(chalk.red(`  ${currentSkillName}: tests failed ✗`));
          console.log(
            output
              .split('\n')
              .map((line) => `    ${line}`)
              .join('\n')
          );
          failed++;
        }
      }

      console.log('\n' + chalk.bold('Summary:'));
      console.log(`  ${chalk.green(`Passed: ${passed}`)}`);
      if (failed > 0) {
        console.log(`  ${chalk.red(`Failed: ${failed}`)}`);
      }
      if (skipped > 0) {
        console.log(`  ${chalk.yellow(`Skipped: ${skipped}`)}`);
      }

      if (failed > 0) {
        process.exit(1);
      }
    } catch (error) {
      console.log(chalk.red(`Failed: ${error instanceof Error ? error.message : error}`));
      process.exit(1);
    }
  });
