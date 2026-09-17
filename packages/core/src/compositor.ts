// Loom Skill Compositor
// Resolves dependencies, detects conflicts, and merges skills

import type {
  LoadedSkill,
  SkillDefinition,
  Composition,
  Conflict,
  Capability,
  Requirement,
} from './types.js';

// ============================================================================
// Compositor
// ============================================================================

export class Compositor {
  /**
   * Compose multiple skills into a single workflow
   */
  compose(skills: LoadedSkill[]): Composition {
    const conflicts: Conflict[] = [];
    const merged = this.mergeDefinitions(skills);

    // Detect conflicts
    conflicts.push(...this.detectCapabilityConflicts(skills));
    conflicts.push(...this.detectVersionConflicts(skills));
    conflicts.push(...this.detectContextConflicts(skills));

    return {
      skills,
      merged,
      conflicts,
    };
  }

  /**
   * Resolve dependencies for a set of skills
   */
  resolve(
    skills: LoadedSkill[],
    available: LoadedSkill[]
  ): { resolved: LoadedSkill[]; missing: Requirement[] } {
    const resolved = new Map<string, LoadedSkill>();
    const missing: Requirement[] = [];

    // Add all provided skills
    for (const skill of skills) {
      resolved.set(skill.definition.name, skill);
    }

    // Resolve dependencies
    for (const skill of skills) {
      const deps = skill.definition.requires || [];
      for (const dep of deps) {
        if (dep.optional) continue;

        // Check if already resolved
        const depName = dep.id;
        if (resolved.has(depName)) continue;

        // Find in available
        const availableSkill = available.find(
          (a) =>
            a.definition.name === depName ||
            a.definition.provides.some((p) => dep.capabilities?.includes(p.id))
        );

        if (availableSkill) {
          resolved.set(availableSkill.definition.name, availableSkill);
        } else {
          missing.push(dep);
        }
      }
    }

    return {
      resolved: Array.from(resolved.values()),
      missing,
    };
  }

  /**
   * Check if two skills are compatible
   */
  areCompatible(a: LoadedSkill, b: LoadedSkill): boolean {
    const conflicts = [
      ...this.detectCapabilityConflicts([a, b]),
      ...this.detectVersionConflicts([a, b]),
    ];
    return conflicts.filter((c) => c.type !== 'context').length === 0;
  }

  // ==========================================================================
  // Private Methods
  // ==========================================================================

  private mergeDefinitions(skills: LoadedSkill[]): SkillDefinition {
    const first = skills[0]?.definition;
    if (!first) {
      throw new Error('No skills to merge');
    }

    const merged: SkillDefinition = {
      name: first.name,
      version: first.version,
      description: first.description,
      provides: [],
      requires: [],
      context: [],
      quality: [],
      references: [],
      tags: [],
    };

    const seenCapabilities = new Set<string>();
    const seenRequirements = new Set<string>();
    const seenContext = new Set<string>();
    const seenQuality = new Set<string>();
    const seenTags = new Set<string>();

    for (const skill of skills) {
      const def = skill.definition;

      // Merge capabilities
      for (const cap of def.provides || []) {
        if (!seenCapabilities.has(cap.id)) {
          seenCapabilities.add(cap.id);
          merged.provides.push(cap);
        }
      }

      // Merge requirements
      for (const req of def.requires || []) {
        if (!seenRequirements.has(req.id)) {
          seenRequirements.add(req.id);
          merged.requires!.push(req);
        }
      }

      // Merge context
      for (const ctx of def.context || []) {
        if (!seenContext.has(ctx.type)) {
          seenContext.add(ctx.type);
          merged.context!.push(ctx);
        }
      }

      // Merge quality gates
      for (const q of def.quality || []) {
        if (!seenQuality.has(q.id)) {
          seenQuality.add(q.id);
          merged.quality!.push(q);
        }
      }

      // Merge tags
      for (const tag of def.tags || []) {
        if (!seenTags.has(tag)) {
          seenTags.add(tag);
          merged.tags!.push(tag);
        }
      }
    }

    return merged;
  }

  private detectCapabilityConflicts(skills: LoadedSkill[]): Conflict[] {
    const conflicts: Conflict[] = [];
    const capabilityMap = new Map<string, string[]>();

    for (const skill of skills) {
      for (const cap of skill.definition.provides || []) {
        const existing = capabilityMap.get(cap.id) || [];
        existing.push(skill.definition.name);
        capabilityMap.set(cap.id, existing);
      }
    }

    for (const [capId, skillNames] of capabilityMap) {
      if (skillNames.length > 1) {
        conflicts.push({
          type: 'capability',
          skills: skillNames,
          description: `Multiple skills provide capability '${capId}'`,
        });
      }
    }

    return conflicts;
  }

  private detectVersionConflicts(skills: LoadedSkill[]): Conflict[] {
    const conflicts: Conflict[] = [];
    const versionMap = new Map<string, Map<string, string[]>>();

    for (const skill of skills) {
      for (const req of skill.definition.requires || []) {
        if (req.version) {
          const versions = versionMap.get(req.id) || new Map();
          const skillVersions = versions.get(req.version) || [];
          skillVersions.push(skill.definition.name);
          versions.set(req.version, skillVersions);
          versionMap.set(req.id, versions);
        }
      }
    }

    for (const [reqId, versions] of versionMap) {
      if (versions.size > 1) {
        conflicts.push({
          type: 'version',
          skills: Array.from(versions.values()).flat(),
          description: `Conflicting version requirements for '${reqId}'`,
        });
      }
    }

    return conflicts;
  }

  private detectContextConflicts(skills: LoadedSkill[]): Conflict[] {
    const conflicts: Conflict[] = [];
    const contextMap = new Map<string, string[]>();

    for (const skill of skills) {
      for (const ctx of skill.definition.context || []) {
        if (ctx.required && ctx.values) {
          const existing = contextMap.get(ctx.type) || [];
          existing.push(skill.definition.name);
          contextMap.set(ctx.type, existing);
        }
      }
    }

    // Check for incompatible context requirements
    // This is simplified - real implementation would check value overlap
    for (const [ctxType, skillNames] of contextMap) {
      if (skillNames.length > 1) {
        // Would need to check if context values are compatible
        // For now, just flag as potential conflict
      }
    }

    return conflicts;
  }
}

// ============================================================================
// Convenience Functions
// ============================================================================

let defaultCompositor: Compositor | null = null;

export function getCompositor(): Compositor {
  if (!defaultCompositor) {
    defaultCompositor = new Compositor();
  }
  return defaultCompositor;
}

export function composeSkills(skills: LoadedSkill[]): Composition {
  return getCompositor().compose(skills);
}
