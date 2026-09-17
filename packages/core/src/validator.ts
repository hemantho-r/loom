// Loom Skill Validator
// Validates skill definitions against schema and quality gates

import type { SkillDefinition, QualityGate, LoadedSkill } from './types.js';

// ============================================================================
// Validator
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  /**
   * IDs of declared quality gates that cannot be automatically verified
   * (behavioral/performance/custom gates) — these describe runtime agent
   * behavior and require manual or agent-level verification.
   */
  unchecked?: string[];
}

// Built-in content gates that can be automatically checked against SKILL.md,
// keyed by the heading they require.
const CONTENT_GATE_HEADINGS: Record<string, RegExp> = {
  'has-overview': /^#{1,6}\s*overview\s*$/im,
  'has-when-to-use': /^#{1,6}\s*when to use\s*$/im,
  'has-workflow': /^#{1,6}\s*workflow\s*$/im,
};

// Built-in gates already enforced by validate()'s structural checks — no
// additional work needed once a skill passes the base validation.
const AUTO_SATISFIED_GATES = new Set([
  'valid-schema',
  'valid-name',
  'valid-version',
  'has-quality-gates',
]);

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export class Validator {
  /**
   * Validate a skill definition
   */
  validate(definition: SkillDefinition): ValidationResult {
    const errors: ValidationError[] = [];

    // Required fields
    this.validateRequired(definition, errors);

    // Format validation
    this.validateFormats(definition, errors);

    // Capability validation
    this.validateCapabilities(definition, errors);

    // Quality gate validation
    this.validateQualityGates(definition, errors);

    const validationErrors = errors.filter((e) => e.severity === 'error');
    const warnings = errors.filter((e) => e.severity === 'warning');

    return {
      valid: validationErrors.length === 0,
      errors: validationErrors,
      warnings,
    };
  }

  /**
   * Validate a loaded skill
   */
  validateLoaded(skill: LoadedSkill): ValidationResult {
    const result = this.validate(skill.definition);

    // Additional checks for loaded skills
    if (!skill.content) {
      result.warnings.push({
        field: 'content',
        message: 'SKILL.md is empty or missing',
        severity: 'warning',
      });
    }

    const unchecked: string[] = [];

    for (const gate of skill.definition.quality ?? []) {
      if (AUTO_SATISFIED_GATES.has(gate.id)) {
        // Already enforced by the structural checks in validate().
        continue;
      }

      const headingPattern = CONTENT_GATE_HEADINGS[gate.id];
      if (gate.type === 'content' && headingPattern) {
        if (!headingPattern.test(skill.content)) {
          const entry: ValidationError = {
            field: `quality.${gate.id}`,
            message: `Quality gate '${gate.id}' failed: SKILL.md is missing a matching section (${gate.description})`,
            severity: gate.severity,
          };
          if (gate.severity === 'error') {
            result.errors.push(entry);
            result.valid = false;
          } else if (gate.severity === 'warning') {
            result.warnings.push(entry);
          }
        }
        continue;
      }

      // Behavioral, performance, and custom gates describe runtime agent
      // behavior and can't be verified from the skill package alone.
      unchecked.push(gate.id);
    }

    result.unchecked = unchecked;
    return result;
  }

  /**
   * Validate skill name format
   */
  validateName(name: string): boolean {
    // @scope/name or name
    const nameRegex = /^(@[a-z0-9-]+\/)?[a-z0-9-]+$/;
    return nameRegex.test(name);
  }

  /**
   * Validate semver version
   */
  validateVersion(version: string): boolean {
    const semverRegex = /^\d+\.\d+\.\d+(-[a-z0-9.]+)?(\+[a-z0-9.]+)?$/;
    return semverRegex.test(version);
  }

  // ==========================================================================
  // Private Methods
  // ==========================================================================

  private validateRequired(
    def: SkillDefinition,
    errors: ValidationError[]
  ): void {
    if (!def.name) {
      errors.push({
        field: 'name',
        message: 'Skill name is required',
        severity: 'error',
      });
    } else if (!this.validateName(def.name)) {
      errors.push({
        field: 'name',
        message: `Invalid skill name format: ${def.name}`,
        severity: 'error',
      });
    }

    if (!def.version) {
      errors.push({
        field: 'version',
        message: 'Skill version is required',
        severity: 'error',
      });
    } else if (!this.validateVersion(def.version)) {
      errors.push({
        field: 'version',
        message: `Invalid semver version: ${def.version}`,
        severity: 'error',
      });
    }

    if (!def.description) {
      errors.push({
        field: 'description',
        message: 'Skill description is required',
        severity: 'error',
      });
    }

    if (!Array.isArray(def.provides) || def.provides.length === 0) {
      errors.push({
        field: 'provides',
        message: 'At least one capability must be provided',
        severity: 'error',
      });
    }
  }

  private validateFormats(
    def: SkillDefinition,
    errors: ValidationError[]
  ): void {
    if (def.version && !this.validateVersion(def.version)) {
      errors.push({
        field: 'version',
        message: `Version must be valid semver: ${def.version}`,
        severity: 'error',
      });
    }

    if (def.authors) {
      for (const author of def.authors) {
        if (author.email && !this.validateEmail(author.email)) {
          errors.push({
            field: 'authors.email',
            message: `Invalid email format: ${author.email}`,
            severity: 'warning',
          });
        }
      }
    }

    if (
      def.invocation !== undefined &&
      !['user', 'model', 'either'].includes(def.invocation)
    ) {
      errors.push({
        field: 'invocation',
        message: `Invalid invocation mode: ${def.invocation} (expected user, model, or either)`,
        severity: 'error',
      });
    }
  }

  private validateCapabilities(
    def: SkillDefinition,
    errors: ValidationError[]
  ): void {
    const capIds = new Set<string>();

    for (const cap of def.provides) {
      // Check for duplicate capabilities
      if (capIds.has(cap.id)) {
        errors.push({
          field: 'provides',
          message: `Duplicate capability ID: ${cap.id}`,
          severity: 'error',
        });
      }
      capIds.add(cap.id);

      // Validate capability ID format
      if (!/^[a-z0-9-]+$/.test(cap.id)) {
        errors.push({
          field: 'provides.id',
          message: `Invalid capability ID format: ${cap.id}`,
          severity: 'error',
        });
      }

      // Validate parameters
      if (cap.input) {
        for (const param of cap.input) {
          this.validateParameter(param, `provides.${cap.id}.input`, errors);
        }
      }
      if (cap.output) {
        for (const param of cap.output) {
          this.validateParameter(param, `provides.${cap.id}.output`, errors);
        }
      }
    }
  }

  private validateParameter(
    param: { name?: string; type?: string },
    path: string,
    errors: ValidationError[]
  ): void {
    if (!param.name) {
      errors.push({
        field: `${path}.name`,
        message: 'Parameter name is required',
        severity: 'error',
      });
    }

    const validTypes = [
      'string',
      'number',
      'boolean',
      'file',
      'file[]',
      'object',
      'array',
      'enum',
    ];
    if (param.type && !validTypes.includes(param.type)) {
      errors.push({
        field: `${path}.type`,
        message: `Invalid parameter type: ${param.type}`,
        severity: 'error',
      });
    }
  }

  private validateQualityGates(
    def: SkillDefinition,
    errors: ValidationError[]
  ): void {
    if (!def.quality) return;

    const gateIds = new Set<string>();

    for (const gate of def.quality) {
      // Check for duplicate gate IDs
      if (gateIds.has(gate.id)) {
        errors.push({
          field: 'quality',
          message: `Duplicate quality gate ID: ${gate.id}`,
          severity: 'error',
        });
      }
      gateIds.add(gate.id);

      // Validate gate ID format
      if (!/^[a-z0-9-]+$/.test(gate.id)) {
        errors.push({
          field: 'quality.id',
          message: `Invalid quality gate ID format: ${gate.id}`,
          severity: 'error',
        });
      }

      // Validate gate type
      const validTypes = ['structural', 'behavioral', 'content', 'performance'];
      if (!validTypes.includes(gate.type)) {
        errors.push({
          field: 'quality.type',
          message: `Invalid quality gate type: ${gate.type}`,
          severity: 'error',
        });
      }

      // Validate gate severity
      const validSeverities = ['error', 'warning', 'info'];
      if (!validSeverities.includes(gate.severity)) {
        errors.push({
          field: 'quality.severity',
          message: `Invalid quality gate severity: ${gate.severity}`,
          severity: 'error',
        });
      }
    }
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// ============================================================================
// Convenience Functions
// ============================================================================

let defaultValidator: Validator | null = null;

export function getValidator(): Validator {
  if (!defaultValidator) {
    defaultValidator = new Validator();
  }
  return defaultValidator;
}

export function validateSkill(definition: SkillDefinition): ValidationResult {
  return getValidator().validate(definition);
}
