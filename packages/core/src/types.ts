// Loom Core Type Definitions

// ============================================================================
// Skill Definition
// ============================================================================

export interface SkillDefinition {
  name: string;
  version: string;
  description: string;
  license?: string;
  authors?: Author[];
  provides: Capability[];
  requires?: Requirement[];
  context?: ContextRequirement[];
  quality?: QualityGate[];
  references?: Reference[];
  tags?: string[];
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: string;
  /**
   * Who may invoke the skill: 'user' (explicitly typed/slashed only),
   * 'model' (auto-invoked by the agent on context), or 'either' (default).
   */
  invocation?: 'user' | 'model' | 'either';
}

export interface Author {
  name: string;
  email?: string;
  url?: string;
}

// ============================================================================
// Capabilities
// ============================================================================

export interface Capability {
  id: string;
  description: string;
  input?: Parameter[];
  output?: Parameter[];
}

export interface Parameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'file' | 'file[]' | 'object' | 'array' | 'enum';
  description?: string;
  required?: boolean;
  default?: unknown;
  values?: string[];
  properties?: Record<string, Parameter>;
}

// ============================================================================
// Dependencies
// ============================================================================

export interface Requirement {
  id: string;
  description?: string;
  capabilities?: string[];
  optional?: boolean;
  version?: string;
}

// ============================================================================
// Context
// ============================================================================

export interface ContextRequirement {
  type: string;
  values?: string[];
  required?: boolean;
  default?: string;
}

export interface Context {
  language?: string;
  framework?: string;
  projectStructure?: ProjectStructure;
  agent?: string;
  [key: string]: unknown;
}

export interface ProjectStructure {
  root: string;
  hasPackageJson: boolean;
  hasTsConfig: boolean;
  hasTestRunner: boolean;
  testRunner?: string;
  packageManager?: string;
  files: string[];
}

// ============================================================================
// Quality Gates
// ============================================================================

export interface QualityGate {
  id: string;
  description: string;
  type: 'structural' | 'behavioral' | 'content' | 'performance';
  severity: 'error' | 'warning' | 'info';
  check?: string;
}

// ============================================================================
// References
// ============================================================================

export interface Reference {
  path: string;
  when?: string;
}

// ============================================================================
// Loaded Skill
// ============================================================================

export interface LoadedSkill {
  definition: SkillDefinition;
  content: string;
  references: Map<string, string>;
  path: string;
}

// ============================================================================
// Composition
// ============================================================================

export interface Composition {
  skills: LoadedSkill[];
  merged: SkillDefinition;
  conflicts: Conflict[];
}

export interface Conflict {
  type: 'capability' | 'version' | 'context';
  skills: string[];
  description: string;
  resolution?: string;
}

// ============================================================================
// Registry
// ============================================================================

export interface RegistryPackage {
  name: string;
  version: string;
  description: string;
  author?: string;
  tags?: string[];
  quality?: QualityScore;
  dependencies?: Record<string, string>;
}

export interface QualityScore {
  overall: number;
  schema: number;
  tests: number;
  documentation: number;
}

// ============================================================================
// Agent Adapter
// ============================================================================

export interface AgentAdapter {
  name: string;
  format: string;
  translate(skill: LoadedSkill): AgentSkillOutput;
}

export interface AgentSkillOutput {
  path: string;
  content: string;
  format: 'markdown' | 'yaml' | 'json' | 'toml';
}
