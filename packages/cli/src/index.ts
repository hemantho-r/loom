#!/usr/bin/env node

// Loom CLI
// Command-line interface for the Loom skill system

import { Command } from 'commander';
import { installCommand } from './commands/install.js';
import { listCommand } from './commands/list.js';
import { composeCommand } from './commands/compose.js';
import { testCommand } from './commands/test.js';
import { validateCommand } from './commands/validate.js';
import { initCommand } from './commands/init.js';
import { searchCommand } from './commands/search.js';
import { publishCommand } from './commands/publish.js';

const program = new Command();

program
  .name('loom')
  .description('Skills woven together — A skill operating system for AI coding agents')
  .version('0.1.0');

// Register commands
program.addCommand(installCommand);
program.addCommand(listCommand);
program.addCommand(composeCommand);
program.addCommand(testCommand);
program.addCommand(validateCommand);
program.addCommand(initCommand);
program.addCommand(searchCommand);
program.addCommand(publishCommand);

// Parse and run
program.parse();
