/**
 * Tool checking utilities
 */

import which from "which";
import type { StepTracker } from "../core/step-tracker.js";

/**
 * Check if a tool is installed and update tracker
 */
export async function checkToolForTracker(
  toolName: string,
  installUrl: string,
  tracker: StepTracker
): Promise<boolean> {
  tracker.start(toolName, "checking");

  try {
    await which(toolName);
    tracker.complete(toolName, "found");
    return true;
  } catch {
    tracker.error(toolName, `not found - ${installUrl}`);
    return false;
  }
}