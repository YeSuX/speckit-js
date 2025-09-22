/**
 * CLI command definitions and handlers
 */

import { Command } from "commander";
import inquirer from "inquirer";
import { getVersion } from "../utils/version.js";
import { showBanner } from "./banner.js";

/**
 * Create and configure the main CLI program
 */
export function createProgram(): Command {
  const program = new Command();

  program
    .name("speckit")
    .description("A modern TypeScript/JavaScript toolkit for Spec-Driven Development (SDD)")
    .version(getVersion());

  // Add commands here as the CLI grows
  program
    .command("init")
    .description("Initialize a new SpecKit project")
    .action(async () => {
      showBanner();
      console.log("🚧 Init command coming soon!");
    });

  program
    .command("check")
    .description("Check development environment and tools")
    .action(async () => {
      showBanner();
      console.log("🚧 Check command coming soon!");
    });

  return program;
}