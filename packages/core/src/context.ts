// Loom Context Manager
// Detects and manages runtime context (language, framework, project structure)

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';
import type { Context, ProjectStructure } from './types.js';

// ============================================================================
// Context Manager
// ============================================================================

export class ContextManager {
  private context: Context = {};
  private detectionResults = new Map<string, unknown>();

  /**
   * Detect context from a project directory
   */
  async detect(projectPath: string): Promise<Context> {
    const structure = this.analyzeProjectStructure(projectPath);

    this.context = {
      projectStructure: structure,
      language: this.detectLanguage(structure),
      framework: this.detectFramework(structure),
      agent: this.detectAgent(),
    };

    return this.context;
  }

  /**
   * Get current context
   */
  getContext(): Context {
    return { ...this.context };
  }

  /**
   * Check if context matches requirements
   */
  matchesRequirements(
    requirements: Array<{ type: string; values?: string[] }>
  ): boolean {
    for (const req of requirements) {
      const value = this.context[req.type];
      if (value === undefined) {
        if (req.values && req.values.length > 0) {
          return false;
        }
        continue;
      }

      if (req.values && !req.values.includes(value as string)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Get context value
   */
  get<T = unknown>(key: string): T | undefined {
    return this.context[key] as T | undefined;
  }

  /**
   * Set context value
   */
  set(key: string, value: unknown): void {
    this.context[key] = value;
  }

  // ==========================================================================
  // Private Methods - Project Analysis
  // ==========================================================================

  private analyzeProjectStructure(root: string): ProjectStructure {
    const files = this.listFiles(root, 2); // 2 levels deep

    return {
      root,
      hasPackageJson: existsSync(join(root, 'package.json')),
      hasTsConfig: existsSync(join(root, 'tsconfig.json')),
      hasTestRunner: this.detectTestRunner(root, files) !== null,
      testRunner: this.detectTestRunner(root, files) || undefined,
      packageManager: this.detectPackageManager(root, files),
      files,
    };
  }

  private listFiles(dir: string, maxDepth: number, currentDepth = 0): string[] {
    const files: string[] = [];

    if (currentDepth >= maxDepth) return files;

    try {
      const entries = readdirSync(dir);
      for (const entry of entries) {
        if (entry.startsWith('.') || entry === 'node_modules') continue;

        const fullPath = join(dir, entry);
        try {
          const stat = statSync(fullPath);
          if (stat.isFile()) {
            files.push(entry);
          } else if (stat.isDirectory()) {
            files.push(`${entry}/`);
            files.push(...this.listFiles(fullPath, maxDepth, currentDepth + 1));
          }
        } catch {
          // Skip inaccessible files
        }
      }
    } catch {
      // Skip inaccessible directories
    }

    return files;
  }

  // ==========================================================================
  // Private Methods - Language Detection
  // ==========================================================================

  private detectLanguage(structure: ProjectStructure): string | undefined {
    // Check for TypeScript
    if (structure.hasTsConfig) return 'typescript';

    // Check file extensions
    const extCounts = new Map<string, number>();
    for (const file of structure.files) {
      if (file.endsWith('/')) continue;
      const ext = file.split('.').pop();
      if (ext) {
        extCounts.set(ext, (extCounts.get(ext) || 0) + 1);
      }
    }

    // Priority order
    const langPriority: [string, string][] = [
      ['ts', 'typescript'],
      ['tsx', 'typescript'],
      ['js', 'javascript'],
      ['jsx', 'javascript'],
      ['py', 'python'],
      ['rb', 'ruby'],
      ['go', 'go'],
      ['rs', 'rust'],
      ['java', 'java'],
    ];

    for (const [ext, lang] of langPriority) {
      if (extCounts.has(ext)) return lang;
    }

    return undefined;
  }

  // ==========================================================================
  // Private Methods - Framework Detection
  // ==========================================================================

  private detectFramework(structure: ProjectStructure): string | undefined {
    if (!structure.hasPackageJson) return undefined;

    try {
      const pkgPath = join(structure.root, 'package.json');
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      const allDeps = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
      };

      // Priority order
      const frameworkPriority: [string, string][] = [
        ['next', 'next'],
        ['nuxt', 'nuxt'],
        ['@sveltejs/kit', 'svelte'],
        ['svelte', 'svelte'],
        ['vue', 'vue'],
        ['react', 'react'],
        ['react-dom', 'react'],
        ['@angular/core', 'angular'],
        ['express', 'express'],
        ['fastify', 'fastify'],
        ['@fastify/fastify', 'fastify'],
        ['hono', 'hono'],
        ['tailwindcss', 'tailwind'],
        ['@prisma/client', 'prisma'],
        ['drizzle-orm', 'drizzle'],
      ];

      for (const [pkg, framework] of frameworkPriority) {
        if (allDeps[pkg]) return framework;
      }
    } catch {
      // Ignore parse errors
    }

    return undefined;
  }

  // ==========================================================================
  // Private Methods - Test Runner Detection
  // ==========================================================================

  private detectTestRunner(
    root: string,
    files: string[]
  ): string | null {
    // Check for test config files
    const configFiles: [string, string][] = [
      ['vitest.config.ts', 'vitest'],
      ['vitest.config.js', 'vitest'],
      ['jest.config.ts', 'jest'],
      ['jest.config.js', 'jest'],
      ['jest.config.mjs', 'jest'],
      ['pytest.ini', 'pytest'],
      ['pyproject.toml', 'pytest'],
      ['.mocharc.yml', 'mocha'],
      ['cypress.config.ts', 'cypress'],
      ['playwright.config.ts', 'playwright'],
    ];

    for (const [file, runner] of configFiles) {
      if (files.includes(file) || existsSync(join(root, file))) {
        return runner;
      }
    }

    // Check package.json scripts
    if (existsSync(join(root, 'package.json'))) {
      try {
        const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8'));
        const scripts = pkg.scripts || {};
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };

        if (scripts.test?.includes('vitest') || deps.vitest) return 'vitest';
        if (scripts.test?.includes('jest') || deps.jest) return 'jest';
        if (scripts.test?.includes('mocha') || deps.mocha) return 'mocha';
      } catch {
        // Ignore
      }
    }

    return null;
  }

  // ==========================================================================
  // Private Methods - Package Manager Detection
  // ==========================================================================

  private detectPackageManager(
    root: string,
    files: string[]
  ): string | undefined {
    if (files.includes('pnpm-lock.yaml') || existsSync(join(root, 'pnpm-lock.yaml'))) {
      return 'pnpm';
    }
    if (files.includes('yarn.lock') || existsSync(join(root, 'yarn.lock'))) {
      return 'yarn';
    }
    if (files.includes('package-lock.json') || existsSync(join(root, 'package-lock.json'))) {
      return 'npm';
    }
    if (files.includes('bun.lockb') || existsSync(join(root, 'bun.lockb'))) {
      return 'bun';
    }
    return undefined;
  }

  // ==========================================================================
  // Private Methods - Agent Detection
  // ==========================================================================

  private detectAgent(): string | undefined {
    // Check environment variables
    if (process.env.LOOM_AGENT) return process.env.LOOM_AGENT;
    if (process.env.CLAUDE_CODE) return 'claude';
    if (process.env.CURSOR_TRACE_ID) return 'cursor';

    // Check for agent-specific files
    const agentFiles: [string, string][] = [
      ['.claude', 'claude'],
      ['.cursor', 'cursor'],
      ['.codex', 'codex'],
      ['.github/copilot-instructions.md', 'copilot'],
      ['.opencode', 'opencode'],
      ['.gemini', 'gemini'],
    ];

    for (const [file, agent] of agentFiles) {
      if (existsSync(file)) return agent;
    }

    return undefined;
  }
}

// ============================================================================
// Convenience Functions
// ============================================================================

let defaultManager: ContextManager | null = null;

export function getContextManager(): ContextManager {
  if (!defaultManager) {
    defaultManager = new ContextManager();
  }
  return defaultManager;
}

export async function detectContext(projectPath: string): Promise<Context> {
  return getContextManager().detect(projectPath);
}
