// Loom CLI - Install Command

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { existsSync, mkdirSync, cpSync, writeFileSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

export const installCommand = new Command('install')
  .description('Install a skill package')
  .argument('<package>', 'Package name or path')
  .option('-g, --global', 'Install globally')
  .option('-f, --force', 'Force reinstall')
  .action(async (packagePath: string, options: { global?: boolean; force?: boolean }) => {
    const spinner = ora('Installing skill...').start();

    try {
      const targetDir = options.global
        ? join(process.env.HOME || '~', '.loom', 'skills')
        : join(process.cwd(), '.loom', 'skills');

      if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true });
      }

      let sourcePath: string;
      if (packagePath.startsWith('./') || packagePath.startsWith('/')) {
        sourcePath = resolve(packagePath);
      } else {
        sourcePath = join(process.cwd(), 'skills', packagePath.replace('@loom/', ''));
      }

      if (!existsSync(sourcePath)) {
        throw new Error(`Package not found: ${packagePath}`);
      }

      const yamlPath = join(sourcePath, 'SKILL.yaml');
      if (!existsSync(yamlPath)) {
        throw new Error(`No SKILL.yaml found in: ${sourcePath}`);
      }

      const yamlContent = readFileSync(yamlPath, 'utf-8');
      const nameMatch = yamlContent.match(/name:\s*"?([^"\n]+)"?/);
      const versionMatch = yamlContent.match(/version:\s*"?([^"\n]+)"?/);
      
      const skillName = nameMatch?.[1] || packagePath.split('/').pop() || 'unknown';
      const skillVersion = versionMatch?.[1] || '0.0.0';

      const skillDir = join(targetDir, skillName.replace('@loom/', ''));
      if (existsSync(skillDir) && !options.force) {
        spinner.warn(`Skill already installed: ${skillName}`);
        return;
      }

      cpSync(sourcePath, skillDir, { recursive: true });

      const manifest = {
        name: skillName,
        version: skillVersion,
        installedAt: new Date().toISOString(),
        source: sourcePath,
      };
      writeFileSync(join(skillDir, '.loom-manifest.json'), JSON.stringify(manifest, null, 2));

      spinner.succeed(chalk.green(`Installed ${skillName}@${skillVersion}`));

      const providesMatch = yamlContent.match(/provides:\s*\n([\s\S]*?)(?=\nrequires:|\ncontext:|\ntags:|$)/);
      if (providesMatch) {
        console.log('\n' + chalk.bold('Capabilities:'));
        const capLines = providesMatch[1].split('\n').filter(l => l.includes('id:'));
        for (const line of capLines) {
          const capId = line.match(/id:\s*(\S+)/)?.[1];
          if (capId) console.log(`  ${chalk.cyan(capId)}`);
        }
      }
    } catch (error) {
      spinner.fail(chalk.red(`Failed to install: ${error instanceof Error ? error.message : error}`));
      process.exit(1);
    }
  });
