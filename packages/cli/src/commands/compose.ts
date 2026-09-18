// Loom CLI - Compose Command

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

function resolveSkillPath(skillsDir: string, name: string): string | null {
  const shortName = name.replace('@loom/', '');

  const flatPath = join(skillsDir, shortName);
  if (existsSync(join(flatPath, 'SKILL.yaml'))) {
    return flatPath;
  }

  const categories = existsSync(skillsDir)
    ? readdirSync(skillsDir).filter((f) => existsSync(join(skillsDir, f)))
    : [];

  for (const category of categories) {
    const candidate = join(skillsDir, category, shortName);
    if (existsSync(join(candidate, 'SKILL.yaml'))) {
      return candidate;
    }
  }

  return null;
}

interface SkillDefinition {
  name: string;
  version: string;
  description: string;
  provides: Array<{ id: string; description: string }>;
  quality?: Array<{ id: string; description: string; severity: string }>;
}

function parseSkillYaml(yamlPath: string): SkillDefinition {
  const content = readFileSync(yamlPath, 'utf-8');
  
  const nameMatch = content.match(/name:\s*"?([^"\n]+)"?/);
  const versionMatch = content.match(/version:\s*"?([^"\n]+)"?/);
  const descMatch = content.match(/description:\s*"?([^"\n]+)"?/);
  
  const provides: Array<{ id: string; description: string }> = [];
  const providesSection = content.match(/provides:\s*\n([\s\S]*?)(?=\nrequires:|\ncontext:|\ntags:|$)/);
  if (providesSection) {
    const capBlocks = providesSection[1].split(/(?=^\s*- id:)/m);
    for (const block of capBlocks) {
      const idMatch = block.match(/id:\s*(\S+)/);
      const descMatch = block.match(/description:\s*"?([^"\n]+)"?/);
      if (idMatch) {
        provides.push({ id: idMatch[1], description: descMatch?.[1] || '' });
      }
    }
  }

  const quality: Array<{ id: string; description: string; severity: string }> = [];
  const qualitySection = content.match(/quality:\s*\n([\s\S]*?)(?=\nreferences:|\ntags:|$)/);
  if (qualitySection) {
    const gateBlocks = qualitySection[1].split(/(?=^\s*- id:)/m);
    for (const block of gateBlocks) {
      const idMatch = block.match(/id:\s*(\S+)/);
      const descMatch = block.match(/description:\s*"?([^"\n]+)"?/);
      const sevMatch = block.match(/severity:\s*(\S+)/);
      if (idMatch) {
        quality.push({ 
          id: idMatch[1], 
          description: descMatch?.[1] || '',
          severity: sevMatch?.[1] || 'warning'
        });
      }
    }
  }

  return {
    name: nameMatch?.[1] || 'unknown',
    version: versionMatch?.[1] || '0.0.0',
    description: descMatch?.[1] || '',
    provides,
    quality,
  };
}

export const composeCommand = new Command('compose')
  .description('Compose multiple skills into a workflow')
  .argument('<skills...>', 'Skills to compose')
  .option('-o, --output <file>', 'Output file')
  .option('--dry-run', 'Show composition without writing')
  .action((skillNames: string[], options: { output?: string; dryRun?: boolean }) => {
    const spinner = ora('Composing skills...').start();

    try {
      const skills: SkillDefinition[] = [];
      
      const skillsDir = join(process.cwd(), 'skills');

      for (const name of skillNames) {
        const skillPath = resolveSkillPath(skillsDir, name);

        if (!skillPath) {
          throw new Error(`Skill not found: ${name}`);
        }

        skills.push(parseSkillYaml(join(skillPath, 'SKILL.yaml')));
      }

      spinner.stop();

      // Merge capabilities
      const allCapabilities = skills.flatMap(s => s.provides);
      const allQuality = skills.flatMap(s => s.quality || []);

      // Generate output
      const lines: string[] = [
        '# Loom Composed Workflow',
        '',
        `Generated: ${new Date().toISOString()}`,
        '',
        '## Skills',
        '',
      ];

      for (const skill of skills) {
        lines.push(`- **${skill.name}**@${skill.version}: ${skill.description}`);
      }

      lines.push('', '## Capabilities', '');
      for (const cap of allCapabilities) {
        lines.push(`- **${cap.id}**: ${cap.description}`);
      }

      if (allQuality.length > 0) {
        lines.push('', '## Quality Gates', '');
        for (const gate of allQuality) {
          lines.push(`- **${gate.id}**: ${gate.description} (${gate.severity})`);
        }
      }

      const output = lines.join('\n');

      if (options.dryRun) {
        console.log(output);
        return;
      }

      const outputFile = options.output || 'loom-workflow.md';
      writeFileSync(outputFile, output);

      console.log(chalk.green(`Composed workflow written to ${outputFile}`));
      console.log(`\nSkills: ${skills.length} | Capabilities: ${allCapabilities.length}`);
    } catch (error) {
      spinner.fail(chalk.red(`Failed: ${error instanceof Error ? error.message : error}`));
      process.exit(1);
    }
  });
