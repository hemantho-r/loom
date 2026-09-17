#!/usr/bin/env node

// Loom Build Script
// Builds all packages in the monorepo

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();

console.log('Building Loom...\n');

// Build packages in order
const packages = ['core', 'schema', 'cli'];

for (const pkg of packages) {
  const pkgDir = join(rootDir, 'packages', pkg);

  if (!existsSync(pkgDir)) {
    console.log(`Skipping ${pkg} (not found)`);
    continue;
  }

  console.log(`Building @loom/${pkg}...`);

  try {
    execSync('pnpm run build', {
      cwd: pkgDir,
      stdio: 'inherit',
    });
    console.log(`✓ @loom/${pkg} built\n`);
  } catch (error) {
    console.error(`✗ @loom/${pkg} failed\n`);
    process.exit(1);
  }
}

console.log('Build complete!');
