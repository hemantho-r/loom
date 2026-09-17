// Loom CLI - Publish Command

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const publishCommand = new Command('publish')
  .description('Publish a skill to the registry')
  .argument('[path]', 'Path to skill directory', '.')
  .option('--dry-run', 'Preview publish without uploading')
  .action((skillPath: string, options: { dryRun?: boolean } = {}) => {
    const spinner = ora('Preparing to publish...').start();

    try {
      const resolvedPath = skillPath === '.' ? process.cwd() : skillPath;
      const yamlPath = join(resolvedPath, 'SKILL.yaml');

      if (!existsSync(yamlPath)) {
        throw new Error(`No SKILL.yaml found in: ${resolvedPath}`);
      }

      const content = readFileSync(yamlPath, 'utf-8');
      const nameMatch = content.match(/name:\s*"?([^"\n]+)"?/);
      const versionMatch = content.match(/version:\s*"?([^"\n]+)"?/);
      const descMatch = content.match(/description:\s*"?([^"\n]+)"?/);

      const name = nameMatch?.[1] || 'unknown';
      const version = versionMatch?.[1] || '0.0.0';
      const description = descMatch?.[1] || '';

      // Validate
      const errors: string[] = [];
      if (!nameMatch) errors.push('Missing name');
      if (!versionMatch) errors.push('Missing version');
      if (!descMatch) errors.push('Missing description');
      if (!content.includes('provides:')) errors.push('Missing provides section');

      if (errors.length > 0) {
        spinner.fail(chalk.red('Validation failed:'));
        for (const error of errors) {
          console.log(chalk.red(`  ✗ ${error}`));
        }
        process.exit(1);
      }

      spinner.stop();

      console.log(chalk.bold('\nPublish Preview:\n'));
      console.log(`  ${chalk.bold('Name:')} ${name}`);
      console.log(`  ${chalk.bold('Version:')} ${version}`);
      console.log(`  ${chalk.bold('Description:')} ${description}`);

      if (options.dryRun) {
        console.log('\n' + chalk.gray('Dry run - no files uploaded'));
        return;
      }

      console.log('\n' + chalk.green('Publish functionality coming soon!'));
      console.log(chalk.gray('This would upload to the Loom registry.'));
    } catch (error) {
      spinner.fail(chalk.red(`Failed: ${error instanceof Error ? error.message : error}`));
      process.exit(1);
    }
  });
