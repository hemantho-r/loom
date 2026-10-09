import { describe, it, expect } from 'vitest';
import { Compositor } from '../src/compositor.js';
import type { LoadedSkill, SkillDefinition } from '../src/types.js';

describe('Compositor', () => {
  const compositor = new Compositor();

  function createSkill(overrides: Partial<SkillDefinition>): LoadedSkill {
    return {
      definition: {
        name: '@loom-skills/test',
        version: '1.0.0',
        description: 'Test skill',
        provides: [],
        ...overrides,
      },
      content: '',
      references: new Map(),
      path: '/test',
    };
  }

  describe('compose', () => {
    it('should compose multiple skills', () => {
      const skill1 = createSkill({
        name: '@loom-skills/skill1',
        provides: [{ id: 'cap1', description: 'Capability 1' }],
      });

      const skill2 = createSkill({
        name: '@loom-skills/skill2',
        provides: [{ id: 'cap2', description: 'Capability 2' }],
      });

      const result = compositor.compose([skill1, skill2]);

      expect(result.skills.length).toBe(2);
      expect(result.merged.provides.length).toBe(2);
      expect(result.conflicts.length).toBe(0);
    });

    it('should detect capability conflicts', () => {
      const skill1 = createSkill({
        name: '@loom-skills/skill1',
        provides: [{ id: 'same-cap', description: 'Capability' }],
      });

      const skill2 = createSkill({
        name: '@loom-skills/skill2',
        provides: [{ id: 'same-cap', description: 'Capability' }],
      });

      const result = compositor.compose([skill1, skill2]);

      expect(result.conflicts.length).toBe(1);
      expect(result.conflicts[0].type).toBe('capability');
    });

    it('should merge quality gates', () => {
      const skill1 = createSkill({
        name: '@loom-skills/skill1',
        provides: [{ id: 'cap1', description: 'Capability 1' }],
        quality: [{ id: 'gate1', description: 'Gate 1', type: 'behavioral', severity: 'error' }],
      });

      const skill2 = createSkill({
        name: '@loom-skills/skill2',
        provides: [{ id: 'cap2', description: 'Capability 2' }],
        quality: [{ id: 'gate2', description: 'Gate 2', type: 'structural', severity: 'warning' }],
      });

      const result = compositor.compose([skill1, skill2]);

      expect(result.merged.quality?.length).toBe(2);
    });
  });

  describe('areCompatible', () => {
    it('should return true for compatible skills', () => {
      const skill1 = createSkill({
        name: '@loom-skills/skill1',
        provides: [{ id: 'cap1', description: 'Capability 1' }],
      });

      const skill2 = createSkill({
        name: '@loom-skills/skill2',
        provides: [{ id: 'cap2', description: 'Capability 2' }],
      });

      expect(compositor.areCompatible(skill1, skill2)).toBe(true);
    });

    it('should return false for conflicting skills', () => {
      const skill1 = createSkill({
        name: '@loom-skills/skill1',
        provides: [{ id: 'same-cap', description: 'Capability' }],
      });

      const skill2 = createSkill({
        name: '@loom-skills/skill2',
        provides: [{ id: 'same-cap', description: 'Capability' }],
      });

      expect(compositor.areCompatible(skill1, skill2)).toBe(false);
    });
  });
});
