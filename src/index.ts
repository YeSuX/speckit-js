#!/usr/bin/env node

/**
 * speckit-js - A modern TypeScript/JavaScript toolkit for Spec-Driven Development (SDD)
 *
 * Build high-quality software faster with executable specifications.
 */

import { createProgram } from "./cli/commands.js";

/**
 * Main CLI entry point
 */
async function main(): Promise<void> {
  try {
    const program = createProgram();
    await program.parseAsync(process.argv);
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run the CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}