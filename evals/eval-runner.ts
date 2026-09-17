// Loom Eval Runner
// Runs skill evaluations to verify quality
//
// Scope: this performs static traceability checks between an eval scenario
// and the skill it targets (does the skill exist, does it load, does it
// declare the quality gates the scenario references, does a golden
// "expected" artifact exist when the eval folder has one). It does NOT run
// an agent against the scenario and grade the resulting output — that
// requires a human or an LLM-in-the-loop review, which is outside what a
// static Node script can do.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import chalk from 'chalk';
import { getLoader, type LoadedSkill } from '@loom/core';

interface EvalScenario {
  name: string;
  description: string;
  requirements: string[];
  qualityGates: string[];
}

interface EvalResult {
  scenario: string;
  passed: boolean;
  issues: string[];
}

function loadScenario(path: string): EvalScenario {
  const content = readFileSync(path, 'utf-8');

  const nameMatch = content.match(/# (.+)/);
  const descMatch = content.match(/## Scenario\s*\n\s*(.+)/);
  const reqsSection = content.match(/## Requirements\s*\n([\s\S]*?)(?=##|$)/);
  const gatesSection = content.match(/## Quality Gates\s*\n([\s\S]*?)(?=##|$)/);

  const requirements: string[] = [];
  if (reqsSection) {
    const lines = reqsSection[1].split('\n').filter((l: string) => l.startsWith('-'));
    for (const line of lines) {
      requirements.push(line.replace(/^-\s*/, '').trim());
    }
  }

  const qualityGates: string[] = [];
  if (gatesSection) {
    const lines = gatesSection[1].split('\n').filter((l: string) => l.startsWith('-'));
    for (const line of lines) {
      const match = line.match(/\*\*(.+?)\*\*/);
      if (match) qualityGates.push(match[1]);
    }
  }

  return {
    name: nameMatch?.[1] || 'Unknown',
    description: descMatch?.[1] || '',
    requirements,
    qualityGates,
  };
}

async function buildSkillIndex(): Promise<Map<string, LoadedSkill>> {
  const skillsDir = join(process.cwd(), 'skills');
  const skills = await getLoader().loadAll(skillsDir);
  const index = new Map<string, LoadedSkill>();
  for (const skill of skills) {
    const shortName = skill.definition.name.replace(/^@[^/]+\//, '');
    index.set(shortName, skill);
  }
  return index;
}

function checkExpectedArtifact(scenarioPath: string, skillEvalDir: string): string | null {
  const expectedDir = join(skillEvalDir, 'expected');
  if (!existsSync(expectedDir)) return null;

  const scenarioBase = basename(scenarioPath, '.md');
  const hasMatch = readdirSync(expectedDir).some((f) => f.startsWith(`${scenarioBase}.`));
  return hasMatch
    ? null
    : `No expected/ reference artifact found for scenario '${scenarioBase}'`;
}

function runEval(
  skillFolderName: string,
  scenarioPath: string,
  skillEvalDir: string,
  skillIndex: Map<string, LoadedSkill>
): EvalResult {
  const scenario = loadScenario(scenarioPath);
  const issues: string[] = [];

  const skill = skillIndex.get(skillFolderName);
  if (!skill) {
    issues.push(`No skill found matching '${skillFolderName}' under skills/`);
  } else {
    const declaredGateIds = new Set((skill.definition.quality ?? []).map((g) => g.id));
    for (const gateId of scenario.qualityGates) {
      if (!declaredGateIds.has(gateId)) {
        issues.push(
          `Quality gate '${gateId}' referenced by this eval scenario is not declared in ${skill.definition.name}'s SKILL.yaml`
        );
      }
    }
  }

  const expectedIssue = checkExpectedArtifact(scenarioPath, skillEvalDir);
  if (expectedIssue) issues.push(expectedIssue);

  return {
    scenario: scenario.name,
    passed: issues.length === 0,
    issues,
  };
}

export async function runEvals(skillName?: string): Promise<void> {
  const evalsDir = join(process.cwd(), 'evals');

  if (!existsSync(evalsDir)) {
    console.log(chalk.yellow('No evals directory found'));
    return;
  }

  console.log(chalk.bold('\nRunning Evaluations:\n'));
  console.log(
    chalk.gray(
      '(static traceability checks only — skill exists, declared gates match, golden files present; not a graded run)\n'
    )
  );

  const skillIndex = await buildSkillIndex();
  const skills = skillName ? [skillName] : readdirSync(evalsDir);

  let totalPassed = 0;
  let totalFailed = 0;

  for (const skill of skills) {
    const skillDir = join(evalsDir, skill);
    if (!existsSync(skillDir)) continue;

    const scenariosDir = join(skillDir, 'scenarios');
    if (!existsSync(scenariosDir)) continue;

    const scenarios = readdirSync(scenariosDir).filter((f) => f.endsWith('.md'));

    for (const scenario of scenarios) {
      const scenarioPath = join(scenariosDir, scenario);
      const result = runEval(skill, scenarioPath, skillDir, skillIndex);

      if (result.passed) {
        console.log(chalk.green(`  ✓ ${skill}/${scenario}`));
        totalPassed++;
      } else {
        console.log(chalk.red(`  ✗ ${skill}/${scenario}`));
        for (const issue of result.issues) {
          console.log(chalk.red(`    ${issue}`));
        }
        totalFailed++;
      }
    }
  }

  console.log('\n' + chalk.bold('Summary:'));
  console.log(`  ${chalk.green(`Passed: ${totalPassed}`)}`);
  if (totalFailed > 0) {
    console.log(`  ${chalk.red(`Failed: ${totalFailed}`)}`);
  }

  if (totalFailed > 0) {
    process.exitCode = 1;
  }
}

// CLI entry point
if (process.argv[1] === import.meta.url.replace('file://', '')) {
  const skillName = process.argv[2];
  runEvals(skillName);
}
