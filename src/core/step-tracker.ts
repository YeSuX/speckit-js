/**
 * Step tracking core functionality
 */

import chalk from "chalk";
import type { Step } from "../types/index.js";

/**
 * StepTracker class to track and render hierarchical steps without emojis,
 * similar to Claude Code tree output. Supports live auto-refresh via an attached refresh callback.
 */
export class StepTracker {
  private title: string;
  private steps: Step[] = [];
  private statusOrder = {
    pending: 0,
    running: 1,
    done: 2,
    error: 3,
    skipped: 4,
  };
  private refreshCallback: (() => void) | null = null;

  constructor(title: string) {
    this.title = title;
  }

  /**
   * Attach a refresh callback to trigger UI refresh
   */
  attachRefresh(callback: () => void): void {
    this.refreshCallback = callback;
  }

  /**
   * Add a new step if it doesn't already exist
   */
  add(key: string, label: string): void {
    if (!this.steps.find((s) => s.key === key)) {
      this.steps.push({ key, label, status: "pending", detail: "" });
      this.maybeRefresh();
    }
  }

  /**
   * Start a step (set status to running)
   */
  start(key: string, detail: string = ""): void {
    this.update(key, "running", detail);
  }

  /**
   * Complete a step (set status to done)
   */
  complete(key: string, detail: string = ""): void {
    this.update(key, "done", detail);
  }

  /**
   * Mark a step as error
   */
  error(key: string, detail: string = ""): void {
    this.update(key, "error", detail);
  }

  /**
   * Skip a step
   */
  skip(key: string, detail: string = ""): void {
    this.update(key, "skipped", detail);
  }

  /**
   * Update step status and detail
   */
  private update(key: string, status: Step["status"], detail: string): void {
    const step = this.steps.find((s) => s.key === key);
    if (step) {
      step.status = status;
      if (detail) {
        step.detail = detail;
      }
      this.maybeRefresh();
      return;
    }

    // If not present, add it
    this.steps.push({ key, label: key, status, detail });
    this.maybeRefresh();
  }

  /**
   * Trigger refresh callback if available
   */
  private maybeRefresh(): void {
    if (this.refreshCallback) {
      try {
        this.refreshCallback();
      } catch (error) {
        // Silently ignore refresh errors
      }
    }
  }

  /**
   * Render the step tree with colored output
   */
  render(): string {
    const lines: string[] = [];
    lines.push(chalk.cyan.bold(this.title));

    for (const step of this.steps) {
      const label = step.label;
      const detailText = step.detail.trim();

      // Status symbols (circles)
      let symbol: string;
      switch (step.status) {
        case "done":
          symbol = chalk.green("●");
          break;
        case "pending":
          symbol = chalk.green.dim("○");
          break;
        case "running":
          symbol = chalk.cyan("○");
          break;
        case "error":
          symbol = chalk.red("●");
          break;
        case "skipped":
          symbol = chalk.yellow("○");
          break;
        default:
          symbol = " ";
      }

      let line: string;
      if (step.status === "pending") {
        // Entire line light gray (pending)
        if (detailText) {
          line = `${symbol} ${chalk.gray(`${label} (${detailText})`)}`;
        } else {
          line = `${symbol} ${chalk.gray(label)}`;
        }
      } else {
        // Label white, detail (if any) light gray in parentheses
        if (detailText) {
          line = `${symbol} ${chalk.white(label)} ${chalk.gray(
            `(${detailText})`
          )}`;
        } else {
          line = `${symbol} ${chalk.white(label)}`;
        }
      }

      lines.push(`  ${line}`);
    }

    return lines.join("\n");
  }
}