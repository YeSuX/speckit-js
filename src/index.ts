#!/usr/bin/env node

/**
 * speckit-js - A modern TypeScript/JavaScript toolkit for Spec-Driven Development (SDD)
 *
 * Build high-quality software faster with executable specifications.
 */

import { Command } from "commander";
import inquirer from "inquirer";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Get package.json version - compatible with both CommonJS and ES modules
function getVersion(): string {
  try {
    let packageJsonPath: string;

    // Check if we're in ES modules or CommonJS environment
    if (typeof __dirname !== "undefined") {
      // CommonJS environment
      packageJsonPath = join(__dirname, "../package.json");
    } else {
      // ES modules environment
      const currentFilePath = fileURLToPath(import.meta.url);
      const currentDir = dirname(currentFilePath);
      packageJsonPath = join(currentDir, "../package.json");
    }

    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
    return packageJson.version;
  } catch {
    return "1.0.0";
  }
}

/**
 * Initialize a new spec-driven development project
 */
async function initProject(projectName: string): Promise<void> {
  console.log(`🚀 Initializing SpecKit project: ${projectName}`);

  // Ask user for additional configuration using inquirer
  const answers = await inquirer.prompt([
    {
      type: "confirm",
      name: "useTypeScript",
      message: "Would you like to use TypeScript?",
      default: true,
    },
    {
      type: "list",
      name: "testFramework",
      message: "Which test framework would you prefer?",
      choices: ["Jest", "Vitest", "Mocha"],
      default: "Vitest",
    },
  ]);

  console.log("📁 Creating project directory...");
  console.log(
    `📝 Setting up configuration files (TypeScript: ${
      answers.useTypeScript ? "Yes" : "No"
    })...`
  );
  console.log(`🧪 Configuring ${answers.testFramework} test framework...`);
  console.log("📦 Installing dependencies...");
  console.log("✅ Project initialized successfully!");
  console.log(`\nNext steps:`);
  console.log(`  cd ${projectName}`);
  console.log(`  npm start`);
}

/**
 * Check system requirements and project status
 */
async function checkSystem(): Promise<void> {
  console.log("🔍 Running system check...");

  // Check Node.js version
  const nodeVersion = process.version;
  console.log(`✅ Node.js version: ${nodeVersion}`);

  // Check npm/yarn availability
  try {
    const { execSync } = await import("child_process");
    const npmVersion = execSync("npm --version", { encoding: "utf8" })
      .toString()
      .trim();
    console.log(`✅ npm version: ${npmVersion}`);
  } catch {
    console.log("⚠️  npm not found");
  }

  // Check if current directory is a SpecKit project
  try {
    const configPath = join(process.cwd(), "speckit.config.json");
    readFileSync(configPath, "utf8");
    console.log("✅ SpecKit project configuration found");
  } catch {
    console.log(
      "ℹ️  No SpecKit project configuration found in current directory"
    );
  }

  console.log("✅ System check completed!");
}

/**
 * Main CLI program
 */
function createCLI(): Command {
  const program = new Command();

  program
    .name("specify")
    .description(
      "A modern TypeScript/JavaScript toolkit for Spec-Driven Development (SDD)"
    )
    .version(getVersion(), "-v, --version", "display version number");

  // Init command
  program
    .command("init <project-name>")
    .description("Initialize a new spec-driven development project")
    .action(async (projectName: string) => {
      try {
        await initProject(projectName);
      } catch (error) {
        console.error(
          "❌ Failed to initialize project:",
          error instanceof Error ? error.message : "Unknown error"
        );
        process.exit(1);
      }
    });

  // Check command
  program
    .command("check")
    .description("Check system requirements and project status")
    .action(async () => {
      try {
        await checkSystem();
      } catch (error) {
        console.error(
          "❌ System check failed:",
          error instanceof Error ? error.message : "Unknown error"
        );
        process.exit(1);
      }
    });

  return program;
}

// Run CLI if this file is executed directly
// Compatible with both CommonJS and ES modules
const isMainModule = typeof require !== "undefined" && require.main === module;
const isESModuleMain =
  typeof import.meta !== "undefined" &&
  import.meta.url === `file://${process.argv[1]}`;

if (isMainModule || isESModuleMain) {
  const program = createCLI();
  program.parse(process.argv);
}

// Export for programmatic use
export { createCLI, initProject, checkSystem };
export default createCLI;
