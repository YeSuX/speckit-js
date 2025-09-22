/**
 * Type definitions for SpecKit CLI
 */

/**
 * Tool tracking interface
 */
export interface ToolStatus {
  name: string;
  description: string;
  status: "pending" | "checking" | "found" | "not_found";
  url?: string;
}

/**
 * Step interface for tracking individual steps
 */
export interface Step {
  key: string;
  label: string;
  status: "pending" | "running" | "done" | "error" | "skipped";
  detail: string;
}

/**
 * Status order mapping for step priorities
 */
export type StatusOrder = {
  pending: 0;
  running: 1;
  done: 2;
  error: 3;
  skipped: 4;
};