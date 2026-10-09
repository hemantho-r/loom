import { describe, it, expect } from 'vitest';
import { Validator } from '../src/validator.js';
import type { SkillDefinition, LoadedSkill } from '../src/types.js';

describe('Validator', () => {
  const validator = new Validator();

  const validSkill: SkillDefinition = {
    name: '@loom-skills/test',
    version: '1.0.0',
    description: 'A test skill for validation',
    provides: [
      {
        id: 'test-capability',
        description: 'Test capability',
      },
    ],
  };

  describe('validate', () => {
    it('should validate a correct skill definition', () => {
      const result = validator.validate(validSkill);
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('should fail when name is missing', () => {
      const skill = { ...validSkill, name: '' };
      const result = validator.validate(skill);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === 'name')).toBe(true);
    });

    it('should fail when version is missing', () => {
      const skill = { ...validSkill, version: '' };
      const result = validator.validate(skill);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === 'version')).toBe(true);
    });

    it('should fail when description is missing', () => {
      const skill = { ...validSkill, description: '' };
      const result = validator.validate(skill);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === 'description')).toBe(true);
    });

    it('should fail when provides is empty', () => {
      const skill = { ...validSkill, provides: [] };
      const result = validator.validate(skill);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === 'provides')).toBe(true);
    });

    it('should fail when name has invalid format', () => {
      const skill = { ...validSkill, name: 'Invalid Name!' };
      const result = validator.validate(skill);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === 'name')).toBe(true);
    });

    it('should fail when version is not semver', () => {
      const skill = { ...validSkill, version: 'invalid' };
      const result = validator.validate(skill);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === 'version')).toBe(true);
    });

    it('should accept valid invocation modes', () => {
      for (const invocation of ['user', 'model', 'either'] as const) {
        const result = validator.validate({ ...validSkill, invocation });
        expect(result.valid).toBe(true);
      }
    });

    it('should fail on an invalid invocation mode', () => {
      const skill = { ...validSkill, invocation: 'sometimes' as never };
      const result = validator.validate(skill);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === 'invocation')).toBe(true);
    });
  });

  describe('validateName', () => {
    it('should accept valid names', () => {
      expect(validator.validateName('my-skill')).toBe(true);
      expect(validator.validateName('@scope/my-skill')).toBe(true);
      expect(validator.validateName('skill123')).toBe(true);
    });

    it('should reject invalid names', () => {
      expect(validator.validateName('My Skill')).toBe(false);
      expect(validator.validateName('skill!')).toBe(false);
      expect(validator.validateName('@Invalid/skill')).toBe(false);
    });
  });

  describe('validateLoaded', () => {
    function makeLoaded(overrides: Partial<LoadedSkill> = {}): LoadedSkill {
      return {
        definition: validSkill,
        content: '',
        references: new Map(),
        path: '/tmp/fake-skill',
        ...overrides,
      };
    }

    it('fails an error-severity content gate when the required heading is missing', () => {
      const definition: SkillDefinition = {
        ...validSkill,
        quality: [
          {
            id: 'has-overview',
            description: 'Skill has overview section',
            type: 'content',
            severity: 'error',
          },
        ],
      };

      const result = validator.validateLoaded(
        makeLoaded({ definition, content: '# Test Skill\n\nNo overview here.' })
      );

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === 'quality.has-overview')).toBe(true);
    });

    it('passes a content gate when the required heading is present', () => {
      const definition: SkillDefinition = {
        ...validSkill,
        quality: [
          {
            id: 'has-overview',
            description: 'Skill has overview section',
            type: 'content',
            severity: 'error',
          },
        ],
      };

      const result = validator.validateLoaded(
        makeLoaded({ definition, content: '# Test Skill\n\n## Overview\n\nDoes things.' })
      );

      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('lists behavioral gates as unchecked rather than silently passing them', () => {
      const definition: SkillDefinition = {
        ...validSkill,
        quality: [
          {
            id: 'red-before-green',
            description: 'Must watch test fail before implementing',
            type: 'behavioral',
            severity: 'error',
          },
        ],
      };

      const result = validator.validateLoaded(makeLoaded({ definition, content: '# Test Skill' }));

      expect(result.valid).toBe(true);
      expect(result.unchecked).toContain('red-before-green');
    });

    it('treats built-in structural gates as already satisfied by base validation', () => {
      const definition: SkillDefinition = {
        ...validSkill,
        quality: [
          {
            id: 'valid-schema',
            description: 'Skill definition follows schema',
            type: 'structural',
            severity: 'error',
          },
        ],
      };

      const result = validator.validateLoaded(makeLoaded({ definition, content: '# Test Skill' }));

      expect(result.valid).toBe(true);
      expect(result.unchecked).not.toContain('valid-schema');
    });
  });

  describe('validateVersion', () => {
    it('should accept valid semver', () => {
      expect(validator.validateVersion('1.0.0')).toBe(true);
      expect(validator.validateVersion('0.1.0')).toBe(true);
      expect(validator.validateVersion('1.0.0-beta.1')).toBe(true);
      expect(validator.validateVersion('1.0.0+build.1')).toBe(true);
    });

    it('should reject invalid versions', () => {
      expect(validator.validateVersion('invalid')).toBe(false);
      expect(validator.validateVersion('1.0')).toBe(false);
      expect(validator.validateVersion('v1.0.0')).toBe(false);
    });
  });
});
