import {
  DB_CEILING_LIMIT,
  DB_FLOOR_LIMIT,
  FFT_SIZES,
  SAMPLE_RATES,
} from "./constants";
import type {
  DirectSamplingChannel,
  LowFrequencyMethodName,
  PerformanceTradeoff,
} from "./types";

const RECEIVER_SETTINGS_STORAGE_KEY = "sdr-radio-settings-v1";

export type PersistedReceiverSettings = {
  volume?: number;
  ppm?: number;
  wbfmDeemphasisUs?: number;
  biasTEnabled?: boolean;
  lowFrequencyMethod?: LowFrequencyMethodName;
  directSamplingChannel?: DirectSamplingChannel;
  upconverterFrequencyHz?: number;
  upconverterBiasTee?: boolean;
  performanceTradeoff?: PerformanceTradeoff;
  manualGain?: boolean;
  gainDb?: number;
  sampleRate?: number;
  fftSize?: number;
  dbRange?: [number, number];
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function isLowFrequencyMethodName(value: unknown): value is LowFrequencyMethodName {
  return (
    value === "default" ||
    value === "directSampling" ||
    value === "upconverter"
  );
}

function isDirectSamplingChannel(value: unknown): value is DirectSamplingChannel {
  return value === "I" || value === "Q";
}

function isPerformanceTradeoff(value: unknown): value is PerformanceTradeoff {
  return value === "cpu" || value === "latency" || value === "quality";
}

export function loadReceiverSettingsFromStorage(): PersistedReceiverSettings {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(RECEIVER_SETTINGS_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const next: PersistedReceiverSettings = {};

    if (typeof parsed.volume === "number" && Number.isFinite(parsed.volume)) {
      next.volume = clamp(parsed.volume, 0, 1);
    }
    if (typeof parsed.ppm === "number" && Number.isFinite(parsed.ppm)) {
      next.ppm = clamp(Math.round(parsed.ppm), -500, 500);
    }
    if (
      typeof parsed.wbfmDeemphasisUs === "number" &&
      (parsed.wbfmDeemphasisUs === 50 || parsed.wbfmDeemphasisUs === 75)
    ) {
      next.wbfmDeemphasisUs = parsed.wbfmDeemphasisUs;
    }
    if (typeof parsed.biasTEnabled === "boolean") {
      next.biasTEnabled = parsed.biasTEnabled;
    }
    if (isLowFrequencyMethodName(parsed.lowFrequencyMethod)) {
      next.lowFrequencyMethod = parsed.lowFrequencyMethod;
    }
    if (isDirectSamplingChannel(parsed.directSamplingChannel)) {
      next.directSamplingChannel = parsed.directSamplingChannel;
    }
    if (
      typeof parsed.upconverterFrequencyHz === "number" &&
      Number.isFinite(parsed.upconverterFrequencyHz)
    ) {
      next.upconverterFrequencyHz = clamp(
        Math.round(parsed.upconverterFrequencyHz),
        1,
        1_800_000_000,
      );
    }
    if (typeof parsed.upconverterBiasTee === "boolean") {
      next.upconverterBiasTee = parsed.upconverterBiasTee;
    }
    if (isPerformanceTradeoff(parsed.performanceTradeoff)) {
      next.performanceTradeoff = parsed.performanceTradeoff;
    }
    if (typeof parsed.manualGain === "boolean") {
      next.manualGain = parsed.manualGain;
    }
    if (typeof parsed.gainDb === "number" && Number.isFinite(parsed.gainDb)) {
      next.gainDb = clamp(Math.round(parsed.gainDb), 0, 50);
    }
    if (
      typeof parsed.sampleRate === "number" &&
      SAMPLE_RATES.includes(parsed.sampleRate)
    ) {
      next.sampleRate = parsed.sampleRate;
    }
    if (
      typeof parsed.fftSize === "number" &&
      FFT_SIZES.includes(parsed.fftSize)
    ) {
      next.fftSize = parsed.fftSize;
    }
    if (
      Array.isArray(parsed.dbRange) &&
      parsed.dbRange.length === 2 &&
      typeof parsed.dbRange[0] === "number" &&
      typeof parsed.dbRange[1] === "number"
    ) {
      const floor = clamp(parsed.dbRange[0], DB_FLOOR_LIMIT, DB_CEILING_LIMIT);
      const ceiling = clamp(
        parsed.dbRange[1],
        DB_FLOOR_LIMIT,
        DB_CEILING_LIMIT,
      );
      next.dbRange = floor <= ceiling ? [floor, ceiling] : [ceiling, floor];
    }

    return next;
  } catch {
    return {};
  }
}

export function saveReceiverSettingsToStorage(
  settings: PersistedReceiverSettings,
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    RECEIVER_SETTINGS_STORAGE_KEY,
    JSON.stringify(settings),
  );
}
