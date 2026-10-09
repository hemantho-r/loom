// Loom SessionStart hook (Claude-native, plain Node 18+, no dependencies).
// Announces locally installed Loom skills (.loom/skills/<name>/SKILL.yaml)
// so the agent knows what's available in this project.
// Protocol: reads the hook JSON payload from stdin (tolerates none) and
// prints {"additionalContext": "..."} on stdout. Silent when nothing installed.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function readStdin() {
  return new Promise((resolve) => {
    if (process.stdin.isTTY) {
      resolve('');
      return;
    }
    let data = '';
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => resolve(data));
  });
}

async function main() {
  await readStdin(); // payload not needed; presence of .loom/ is the signal
  const loomDir = join(process.cwd(), '.loom', 'skills');
  if (!existsSync(loomDir)) return;
  let names = [];
  try {
    names = readdirSync(loomDir).filter((f) => {
      try {
        return existsSync(join(loomDir, f, 'SKILL.yaml'));
      } catch {
        return false;
      }
    });
  } catch {
    return;
  }
  if (names.length === 0) return;
  const details = names
    .map((n) => {
      try {
        const yaml = readFileSync(join(loomDir, n, 'SKILL.yaml'), 'utf-8');
        const desc = (yaml.match(/^description:\s*["']?(.+?)["']?\s*$/m) ?? [])[1];
        return desc ? `${n} — ${desc}` : n;
      } catch {
        return n;
      }
    })
    .join('\n- ');
  process.stdout.write(
    JSON.stringify({
      additionalContext: `Loom skills installed in this project:\n- ${details}`,
    })
  );
}

main();
