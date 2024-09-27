// utils/logging.ts
import { Notice } from 'obsidian';

export const DEBUG_MODE = true; // Set this to false to disable debug logs in production

export function debugLog(message: string, data?: unknown): void {
  if (DEBUG_MODE) {
    const logMessage = data ? `${message} ${JSON.stringify(data)}` : message;
    new Notice(`[DEBUG] ${logMessage}`);
  }
}