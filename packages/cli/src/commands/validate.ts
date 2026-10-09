// Loom CLI - Validate Command

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { loadSkill, getValidator } from '@loom-skills/core';

export const validateCommand = new Command('validate')
  .description('Validate skill definitions')
  .argument('[skill]', 'Skill to validate')
  .option('--strict', 'Treat warnings as errors')
  .action(async (skillName?: string, options: { strict?: boolean } = {}) => {
    const spinner = ora('Validating skills...').start();

    try {
      const skillsDir = join(process.cwd(), 'skills');

      if (!existsSync(skillsDir)) {
        spinner.fail(chalk.red('No skills directory found'));
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
        spinner.warn(chalk.yellow('No skills found to validate'));
        return;
      }

      spinner.stop();

      const validator = getValidator();
      let valid = 0;
      let invalid = 0;

      for (const skillPath of skillDirs) {
        const label = skillPath.split('/').pop() || 'unknown';

        try {
          const skill = await loadSkill(skillPath);
          const result = validator.validateLoaded(skill);
          const name = `${skill.definition.name}@${skill.definition.version}`;

          const failsStrict = options.strict && result.warnings.length > 0;

          if (result.valid && !failsStrict) {
            console.log(chalk.green(`  ${name}: valid`));
            valid++;
          } else {
            console.log(chalk.red(`  ${name}: invalid`));
            invalid++;
          }

          for (const error of result.errors) {
            console.log(chalk.red(`    ✗ ${error.field}: ${error.message}`));
          }
          for (const warning of result.warnings) {
            console.log(chalk.yellow(`    ⚠ ${warning.field}: ${warning.message}`));
          }
          if (result.unchecked && result.unchecked.length > 0) {
            console.log(
              chalk.gray(
                `    ℹ requires manual verification: ${result.unchecked.join(', ')}`
              )
            );
          }
        } catch (error) {
          console.log(chalk.red(`  ${label}: invalid`));
          console.log(
            chalk.red(`    ✗ ${error instanceof Error ? error.message : error}`)
          );
          invalid++;
        }
      }

      console.log('\n' + chalk.bold('Summary:'));
      console.log(`  ${chalk.green(`Valid: ${valid}`)}`);
      if (invalid > 0) {
        console.log(`  ${chalk.red(`Invalid: ${invalid}`)}`);
      }

      if (invalid > 0) process.exit(1);
    } catch (error) {
      spinner.fail(chalk.red(`Failed: ${error instanceof Error ? error.message : error}`));
      process.exit(1);
    }
  });
