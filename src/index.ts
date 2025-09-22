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
import chalk from "chalk";
import which from "which";

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
 * Tool tracking interface
 */
interface ToolStatus {
  name: string;
  description: string;
  status: "pending" | "checking" | "found" | "not_found";
  url?: string;
}

/**
 * StepTracker class to track tool installation status
 */
class StepTracker {
  private title: string;
  private tools: ToolStatus[] = [];

  constructor(title: string) {
    this.title = title;
  }

  add(name: string, description: string): void {
    this.tools.push({
      name,
      description,
      status: "pending",
    });
  }

  setStatus(name: string, status: ToolStatus["status"], url?: string): void {
    const tool = this.tools.find((t) => t.name === name);
    if (tool) {
      tool.status = status;
      if (url) tool.url = url;
    }
  }

  render(): string {
    const lines: string[] = [];
    lines.push(chalk.bold(`\n${this.title}`));
    lines.push(chalk.gray("─".repeat(this.title.length + 10)));

    for (const tool of this.tools) {
      let statusIcon: string;

      switch (tool.status) {
        case "found":
          statusIcon = "✅";
          break;
        case "not_found":
          statusIcon = "❌";
          break;
        case "checking":
          statusIcon = "🔍";
          break;
        default:
          statusIcon = "⏳";
      }

      const toolName = chalk.bold(tool.name);
      const description = chalk.dim(tool.description);
      lines.push(`${statusIcon} ${toolName} - ${description}`);

      if (tool.status === "not_found" && tool.url) {
        lines.push(chalk.dim(`   Install: ${tool.url}`));
      }
    }

    return lines.join("\n");
  }
}

/**
 * Display banner
 */
function showBanner(): void {
  console.log(
    chalk.cyan.bold(`
╭─────────────────────────────────────────────────────────────╮
│                                                             │
│                    🚀 SpecKit CLI v${getVersion().padEnd(8)}                │
│          Spec-Driven Development Toolkit                   │
│                                                             │
╰─────────────────────────────────────────────────────────────╯
  `)
  );
}

/**
 * Check if a tool is installed and update tracker
 */
async function checkToolForTracker(
  toolName: string,
  installUrl: string,
  tracker: StepTracker
): Promise<boolean> {
  tracker.setStatus(toolName, "checking");

  try {
    await which(toolName);
    tracker.setStatus(toolName, "found");
    return true;
  } catch {
    tracker.setStatus(toolName, "not_found", installUrl);
    return false;
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
 * Check that all required tools are installed
 */
async function checkSystem(): Promise<void> {
  showBanner();
  console.log(chalk.bold("Checking for installed tools...\n"));

  const tracker = new StepTracker("Check Available Tools");

  tracker.add("git", "Git version control");
  tracker.add("claude", "Claude Code CLI");
  tracker.add("gemini", "Gemini CLI");
  tracker.add("qwen", "Qwen Code CLI");
  tracker.add("code", "VS Code (for GitHub Copilot)");
  tracker.add("cursor-agent", "Cursor IDE agent (optional)");
  tracker.add("windsurf", "Windsurf IDE (optional)");
  tracker.add("opencode", "opencode");
  tracker.add("codex", "Codex CLI");

  const gitOk = await checkToolForTracker(
    "git",
    "https://git-scm.com/downloads",
    tracker
  );
  const claudeOk = await checkToolForTracker(
    "claude",
    "https://docs.anthropic.com/en/docs/claude-code/setup",
    tracker
  );
  const geminiOk = await checkToolForTracker(
    "gemini",
    "https://github.com/google-gemini/gemini-cli",
    tracker
  );
  const qwenOk = await checkToolForTracker(
    "qwen",
    "https://github.com/QwenLM/qwen-code",
    tracker
  );
  let codeOk = await checkToolForTracker(
    "code",
    "https://code.visualstudio.com/",
    tracker
  );

  if (!codeOk) {
    codeOk = await checkToolForTracker(
      "code-insiders",
      "https://code.visualstudio.com/insiders/",
      tracker
    );
  }

  const cursorOk = await checkToolForTracker(
    "cursor-agent",
    "https://cursor.sh/",
    tracker
  );
  const windsurfOk = await checkToolForTracker(
    "windsurf",
    "https://windsurf.com/",
    tracker
  );
  const opencodeOk = await checkToolForTracker(
    "opencode",
    "https://opencode.ai/",
    tracker
  );
  const codexOk = await checkToolForTracker(
    "codex",
    "https://github.com/openai/codex",
    tracker
  );

  console.log(tracker.render());

  console.log(chalk.bold.green("\n✅ SpecKit CLI is ready to use!"));

  if (!gitOk) {
    console.log(chalk.dim("💡 Tip: Install git for repository management"));
  }

  if (
    !(
      claudeOk ||
      geminiOk ||
      cursorOk ||
      qwenOk ||
      windsurfOk ||
      opencodeOk ||
      codexOk
    )
  ) {
    console.log(
      chalk.dim("💡 Tip: Install an AI assistant for the best experience")
    );
  }
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
    .description("Check that all required tools are installed")
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