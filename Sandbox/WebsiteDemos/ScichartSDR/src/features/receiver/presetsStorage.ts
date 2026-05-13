import {
  INITIAL_PRESETS,
  PRESETS_SORT_STORAGE_KEY,
  PRESETS_STORAGE_KEY,
} from "./constants";
import type { PresetSortColumn, ReceiverPreset } from "./types";

function isReceiverPreset(value: unknown): value is ReceiverPreset {
  if (!value || typeof value !== "object") {
    return false;
  }
  const preset = value as Partial<ReceiverPreset>;
  return (
    typeof preset.name === "string" &&
    typeof preset.tunedFrequency === "number" &&
    typeof preset.scale === "number" &&
    typeof preset.tuningStep === "number" &&
    typeof preset.scheme === "string" &&
    typeof preset.bandwidth === "number" &&
    typeof preset.stereo === "boolean" &&
    typeof preset.squelch === "number" &&
    (preset.gain === null || typeof preset.gain === "number")
  );
}

export function loadPresetsFromStorage(): ReceiverPreset[] {
  if (typeof window === "undefined") {
    return INITIAL_PRESETS;
  }
  try {
    const raw = window.localStorage.getItem(PRESETS_STORAGE_KEY);
    if (!raw) {
      return INITIAL_PRESETS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return INITIAL_PRESETS;
    }
    const valid = parsed.filter(isReceiverPreset);
    return valid.length > 0 ? valid : INITIAL_PRESETS;
  } catch {
    return INITIAL_PRESETS;
  }
}

export function savePresetsToStorage(presets: ReceiverPreset[]): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets));
}

const VALID_SORT_COLUMNS: PresetSortColumn[] = [
  "name",
  "frequency",
  "mode",
  "-name",
  "-frequency",
  "-mode",
];

export function loadSortColumnFromStorage(): PresetSortColumn {
  if (typeof window === "undefined") return "frequency";
  const raw = window.localStorage.getItem(PRESETS_SORT_STORAGE_KEY);
  if (raw && (VALID_SORT_COLUMNS as string[]).includes(raw)) {
    return raw as PresetSortColumn;
  }
  return "frequency";
}

export function saveSortColumnToStorage(sortColumn: PresetSortColumn): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PRESETS_SORT_STORAGE_KEY, sortColumn);
}
