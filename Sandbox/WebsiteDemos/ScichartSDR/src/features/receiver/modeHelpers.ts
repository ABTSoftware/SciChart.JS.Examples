import { getMode } from "@jtarrio/signals/demod/modes.js";
import type { ModeState } from "./types";

export function createModeState(
  scheme: string,
  fallbackSchemes: string[]
): ModeState {
  const candidates = [scheme, ...fallbackSchemes];
  for (const name of candidates) {
    if (!name) {
      continue;
    }
    try {
      return { ...(getMode(name) as ModeState) };
    } catch {
      // Try the next candidate.
    }
  }
  return { scheme };
}
