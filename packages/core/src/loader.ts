// Loom Skill Loader
// Loads skill definitions from disk, parses SKILL.yaml, and resolves references

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';
import type { SkillDefinition, LoadedSkill, Reference } from './types.js';

// ============================================================================
// Skill Loader
// ============================================================================

export class SkillLoader {
  private cache = new Map<string, LoadedSkill>();

  /**
   * Load a skill from a directory path
   */
  async load(skillPath: string): Promise<LoadedSkill> {
    // Check cache
    const canonical = resolve(skillPath);
    if (this.cache.has(canonical)) {
      return this.cache.get(canonical)!;
    }

    // Validate directory exists
    if (!existsSync(skillPath) || !statSync(skillPath).isDirectory()) {
      throw new Error(`Skill directory not found: ${skillPath}`);
    }

    // Load SKILL.yaml
    const yamlPath = join(skillPath, 'SKILL.yaml');
    if (!existsSync(yamlPath)) {
      throw new Error(`SKILL.yaml not found in: ${skillPath}`);
    }

    const yamlContent = readFileSync(yamlPath, 'utf-8');
    const definition = parseYaml(yamlContent) as SkillDefinition;

    // Validate required fields
    this.validateDefinition(definition, skillPath);

    // Load SKILL.md content
    const mdPath = join(skillPath, 'SKILL.md');
    let content = '';
    if (existsSync(mdPath)) {
      content = readFileSync(mdPath, 'utf-8');
    }

    // Load references
    const references = this.loadReferences(skillPath, definition.references || []);

    const loaded: LoadedSkill = {
      definition,
      content,
      references,
      path: skillPath,
    };

    this.cache.set(canonical, loaded);
    return loaded;
  }

  /**
   * Load a skill by package name (e.g., @loom-skills/tdd).
   * The scope prefix is stripped generically so any scope works.
   */
  async loadByName(name: string, searchPaths: string[] = []): Promise<LoadedSkill> {
    // Convert package name to path
    // @loom-skills/tdd -> skills/engineering/tdd
    const skillDir = name.replace(/^@[^/]+\//, '');

    // Search in provided paths
    for (const searchPath of searchPaths) {
      const candidate = join(searchPath, skillDir);
      if (existsSync(candidate)) {
        return this.load(candidate);
      }
    }

    // Try relative to current working directory
    const localCandidate = join(process.cwd(), 'skills', skillDir);
    if (existsSync(localCandidate)) {
      return this.load(localCandidate);
    }

    throw new Error(`Skill not found: ${name}`);
  }

  /**
   * Load all skills from a directory
   */
  async loadAll(skillsDir: string): Promise<LoadedSkill[]> {
    const skills: LoadedSkill[] = [];

    if (!existsSync(skillsDir)) {
      return skills;
    }

    const categories = readdirSync(skillsDir).filter((f) =>
      statSync(join(skillsDir, f)).isDirectory()
    );

    for (const category of categories) {
      const categoryPath = join(skillsDir, category);
      const skillDirs = readdirSync(categoryPath).filter((f) =>
        statSync(join(categoryPath, f)).isDirectory()
      );

      for (const skillDir of skillDirs) {
        const skillPath = join(categoryPath, skillDir);
        try {
          const skill = await this.load(skillPath);
          skills.push(skill);
        } catch {
          // Skip invalid skills
        }
      }
    }

    return skills;
  }

  /**
   * Clear the load cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  // ==========================================================================
  // Private Methods
  // ==========================================================================

  private validateDefinition(def: SkillDefinition, path: string): void {
    if (!def.name) {
      throw new Error(`Skill missing 'name' field: ${path}`);
    }
    if (!def.version) {
      throw new Error(`Skill missing 'version' field: ${path}`);
    }
    if (!def.description) {
      throw new Error(`Skill missing 'description' field: ${path}`);
    }
    if (!Array.isArray(def.provides)) {
      throw new Error(`Skill missing 'provides' array: ${path}`);
    }
  }

  private loadReferences(
    skillPath: string,
    refs: Reference[]
  ): Map<string, string> {
    const references = new Map<string, string>();

    for (const ref of refs) {
      const refPath = join(skillPath, ref.path);
      if (existsSync(refPath)) {
        const content = readFileSync(refPath, 'utf-8');
        references.set(ref.path, content);
      }
    }

    return references;
  }
}

// ============================================================================
// Convenience Functions
// ============================================================================

let defaultLoader: SkillLoader | null = null;

export function getLoader(): SkillLoader {
  if (!defaultLoader) {
    defaultLoader = new SkillLoader();
  }
  return defaultLoader;
}

export async function loadSkill(path: string): Promise<LoadedSkill> {
  return getLoader().load(path);
}

export async function loadSkillByName(
  name: string,
  searchPaths?: string[]
): Promise<LoadedSkill> {
  return getLoader().loadByName(name, searchPaths);
}
