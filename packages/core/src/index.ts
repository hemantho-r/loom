// Loom Core
// The skill operating system for AI coding agents

export type {
  // Skill Definition
  SkillDefinition,
  Author,
  // Capabilities
  Capability,
  Parameter,
  // Dependencies
  Requirement,
  // Context
  Context,
  ContextRequirement,
  ProjectStructure,
  // Quality
  QualityGate,
  // References
  Reference,
  // Loaded Skill
  LoadedSkill,
  // Composition
  Composition,
  Conflict,
  // Registry
  RegistryPackage,
  QualityScore,
  // Agent
  AgentAdapter,
  AgentSkillOutput,
} from './types.js';

export { SkillLoader, loadSkill, loadSkillByName, getLoader } from './loader.js';
export { Compositor, composeSkills, getCompositor } from './compositor.js';
export { ContextManager, detectContext, getContextManager } from './context.js';
export {
  Validator,
  validateSkill,
  getValidator,
  type ValidationResult,
  type ValidationError,
} from './validator.js';
