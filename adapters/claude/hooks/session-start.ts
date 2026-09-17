// Loom Claude Hook - Session Start
// Loads installed Loom skills at session start

import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export function sessionStart(): string[] {
  const messages: string[] = [];

  // Check for .loom directory
  const loomDir = join(process.cwd(), '.loom', 'skills');
  if (!existsSync(loomDir)) {
    return messages;
  }

  // Find installed skills
  const skillDirs = readdirSync(loomDir).filter((f) =>
    existsSync(join(loomDir, f, 'SKILL.yaml'))
  );

  if (skillDirs.length > 0) {
    messages.push(`Loom skills available: ${skillDirs.join(', ')}`);
  }

  return messages;
}
