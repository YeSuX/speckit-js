/**
 * CLI banner display functionality
 */

import chalk from "chalk";
import { getVersion } from "../utils/version.js";

/**
 * Display banner
 */
export function showBanner(): void {
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