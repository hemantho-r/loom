import { describe, it, expect, beforeEach } from 'vitest';
import { SkillLoader } from '../src/loader.js';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

describe('SkillLoader', () => {
  const loader = new SkillLoader();
  const testDir = join(process.cwd(), 'test-skills');

  beforeEach(() => {
    loader.clearCache();
    // Clean up test directory
    try {
      rmSync(testDir, { recursive: true });
    } catch {
      // Ignore
    }
  });

  describe('load', () => {
    it('should load a valid skill', async () => {
      // Create test skill
      const skillDir = join(testDir, 'test-skill');
      mkdirSync(skillDir, { recursive: true });

      writeFileSync(
        join(skillDir, 'SKILL.yaml'),
        `name: "@loom-skills/test"
version: "1.0.0"
description: "A test skill"
provides:
  - id: "test"
    description: "Test capability"
`
      );

      writeFileSync(join(skillDir, 'SKILL.md'), '# Test Skill');

      const skill = await loader.load(skillDir);

      expect(skill.definition.name).toBe('@loom-skills/test');
      expect(skill.definition.version).toBe('1.0.0');
      expect(skill.content).toBe('# Test Skill');
    });

    it('should throw when directory does not exist', async () => {
      await expect(loader.load('/nonexistent')).rejects.toThrow('Skill directory not found');
    });

    it('should throw when SKILL.yaml is missing', async () => {
      const skillDir = join(testDir, 'no-yaml');
      mkdirSync(skillDir, { recursive: true });

      await expect(loader.load(skillDir)).rejects.toThrow('SKILL.yaml not found');
    });
  });

  describe('loadAll', () => {
    it('should load all skills from a directory', async () => {
      // Create test skills
      const skillsDir = join(testDir, 'skills');
      mkdirSync(join(skillsDir, 'engineering', 'skill1'), { recursive: true });
      mkdirSync(join(skillsDir, 'engineering', 'skill2'), { recursive: true });

      const yamlContent = `name: "@loom-skills/test"
version: "1.0.0"
description: "A test skill"
provides:
  - id: "test"
    description: "Test capability"
`;

      writeFileSync(join(skillsDir, 'engineering', 'skill1', 'SKILL.yaml'), yamlContent);
      writeFileSync(join(skillsDir, 'engineering', 'skill2', 'SKILL.yaml'), yamlContent);

      const skills = await loader.loadAll(skillsDir);

      expect(skills.length).toBe(2);
    });
  });
});
