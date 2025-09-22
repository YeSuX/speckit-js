/**
 * Version utilities for SpecKit CLI
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

/**
 * Get package.json version - compatible with both CommonJS and ES modules
 */
export function getVersion(): string {
  try {
    let packageJsonPath: string;

    // Check if we're in ES modules or CommonJS environment
    if (typeof __dirname !== "undefined") {
      // CommonJS environment
      packageJsonPath = join(__dirname, "../../package.json");
    } else {
      // ES modules environment
      const currentFilePath = fileURLToPath(import.meta.url);
      const currentDir = dirname(currentFilePath);
      packageJsonPath = join(currentDir, "../../package.json");
    }

    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
    return packageJson.version;
  } catch {
    return "1.0.0";
  }
}