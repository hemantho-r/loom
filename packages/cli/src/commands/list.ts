// Loom CLI - List Command

import { Command } from 'commander';
import chalk from 'chalk';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const listCommand = new Command('list')
  .description('List installed skills')
  .option('-g, --global', 'List global skills')
  .option('--json', 'Output as JSON')
  .action((options: { global?: boolean; json?: boolean }) => {
    const skillsDir = options.global
      ? join(process.env.HOME || '~', '.loom', 'skills')
      : join(process.cwd(), '.loom', 'skills');

    if (!existsSync(skillsDir)) {
      console.log(chalk.yellow('No skills installed.'));
      return;
    }

    const skillDirs = readdirSync(skillsDir).filter((f) =>
      existsSync(join(skillsDir, f, 'SKILL.yaml'))
    );

    if (skillDirs.length === 0) {
      console.log(chalk.yellow('No skills installed.'));
      return;
    }

    if (options.json) {
      const skills = skillDirs.map((dir) => {
        const manifestPath = join(skillsDir, dir, '.loom-manifest.json');
        if (existsSync(manifestPath)) {
          return JSON.parse(readFileSync(manifestPath, 'utf-8'));
        }
        return { name: dir, version: 'unknown' };
      });
      console.log(JSON.stringify(skills, null, 2));
      return;
    }

    console.log(chalk.bold('\nInstalled Skills:\n'));

    for (const dir of skillDirs) {
      const manifestPath = join(skillsDir, dir, '.loom-manifest.json');
      let name = dir;
      let version = 'unknown';
      let installedAt = '';

      if (existsSync(manifestPath)) {
        const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
        name = manifest.name || dir;
        version = manifest.version || 'unknown';
        installedAt = manifest.installedAt || '';
      }

      console.log(`${chalk.green('✓')} ${chalk.bold(name)}@${chalk.cyan(version)}`);
      if (installedAt) {
        console.log(`  Installed: ${chalk.gray(new Date(installedAt).toLocaleDateString())}`);
      }
      console.log();
    }
  });
