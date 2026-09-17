// Loom CLI - Search Command

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';

export const searchCommand = new Command('search')
  .description('Search for skills')
  .argument('<query>', 'Search query')
  .action((query: string) => {
    const spinner = ora('Searching...').start();

    try {
      spinner.stop();

      console.log(chalk.bold(`\nSearch results for "${query}":\n`));

      // Placeholder - in production would query registry
      const results = [
        { name: '@loom/tdd', description: 'Test-driven development', category: 'engineering' },
        { name: '@loom/review', description: 'Code review', category: 'engineering' },
        { name: '@loom/debug', description: 'Debugging workflow', category: 'engineering' },
      ];

      const filtered = results.filter(r => 
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.description.toLowerCase().includes(query.toLowerCase())
      );

      if (filtered.length === 0) {
        console.log(chalk.yellow('No results found.'));
        return;
      }

      for (const result of filtered) {
        console.log(`${chalk.bold(result.name)}`);
        console.log(`  ${chalk.gray(result.description)}`);
        console.log(`  Category: ${chalk.cyan(result.category)}`);
        console.log();
      }

      console.log(chalk.gray(`Found ${filtered.length} results`));
    } catch (error) {
      spinner.fail(chalk.red(`Failed: ${error instanceof Error ? error.message : error}`));
      process.exit(1);
    }
  });
