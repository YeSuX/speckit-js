import { spawn } from "child_process";
import { StepTracker } from "../core/StepTracker";

/**
 * Check if a tool is installed and update tracker
 * @param tool - The tool name to check
 * @param installHint - Installation hint message if tool is not found
 * @param tracker - StepTracker instance to update
 * @returns Promise<boolean> - true if tool is available, false otherwise
 */
export async function checkToolForTracker(
  tool: string,
  installHint: string,
  tracker: StepTracker
): Promise<boolean> {
  return new Promise((resolve) => {
    // Try to check if tool exists using 'which' command on Unix-like systems
    // or 'where' command on Windows
    const command = process.platform === "win32" ? "where" : "which";

    const child = spawn(command, [tool], {
      stdio: "pipe",
      shell: true,
    });

    child.on("close", (code) => {
      if (code === 0) {
        tracker.complete(tool, "available");
        resolve(true);
      } else {
        tracker.error(tool, `not found - ${installHint}`);
        resolve(false);
      }
    });

    child.on("error", () => {
      tracker.error(tool, `not found - ${installHint}`);
      resolve(false);
    });
  });
}
