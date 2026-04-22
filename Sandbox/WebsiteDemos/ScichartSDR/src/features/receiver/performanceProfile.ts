import {
  FFT_SIZE,
  FFT_SIZES,
  HIGH_SAMPLE_RATE_THRESHOLD,
  SAMPLE_RATES,
  WATERFALL_DECIMATION,
  WATERFALL_ROWS,
} from "./constants";
import type { PerformanceTradeoff } from "./types";

type NavigatorWithDeviceMemory = Navigator & {
  deviceMemory?: number;
};

export type ReceiverHardwareProfile = {
  isMobile: boolean;
  isConstrainedDevice: boolean;
  defaultPerformanceTradeoff: PerformanceTradeoff;
  defaultSampleRate: number;
  defaultFftSize: number;
  fallbackPerformanceTradeoff: PerformanceTradeoff;
  fallbackSampleRate: number;
  fallbackFftSize: number;
};

export type ReceiverRuntimeProfile = {
  liveDataIntervalMs: number;
  radioBuffersPerSecond: number;
  waterfallRows: number;
  waterfallDecimation: number;
};

function pickAllowedValueAtMost(
  values: readonly number[],
  maxValue: number,
  fallback: number
): number {
  let next = fallback;
  for (const value of values) {
    if (value > maxValue) {
      break;
    }
    next = value;
  }
  return next;
}

export function getReceiverHardwareProfile(): ReceiverHardwareProfile {
  if (typeof navigator === "undefined") {
    return {
      isMobile: false,
      isConstrainedDevice: false,
      defaultPerformanceTradeoff: "cpu",
      defaultSampleRate: 2_048_000,
      defaultFftSize: FFT_SIZE,
      fallbackPerformanceTradeoff: "latency",
      fallbackSampleRate: 1_024_000,
      fallbackFftSize: 1024,
    };
  }

  const nav = navigator as NavigatorWithDeviceMemory;
  const isMobile = /Mobi|Android/i.test(nav.userAgent);
  const hardwareConcurrency = nav.hardwareConcurrency ?? 8;
  const deviceMemory = nav.deviceMemory ?? 8;
  const isConstrainedDevice =
    isMobile || hardwareConcurrency <= 4 || deviceMemory <= 4;

  if (isConstrainedDevice) {
    return {
      isMobile,
      isConstrainedDevice,
      defaultPerformanceTradeoff: "latency",
      defaultSampleRate: 1_024_000,
      defaultFftSize: 1024,
      fallbackPerformanceTradeoff: "latency",
      fallbackSampleRate: 1_024_000,
      fallbackFftSize: 1024,
    };
  }

  return {
    isMobile,
    isConstrainedDevice,
    defaultPerformanceTradeoff: "cpu",
    defaultSampleRate: 2_048_000,
    defaultFftSize: FFT_SIZE,
    fallbackPerformanceTradeoff: "latency",
    fallbackSampleRate: 1_024_000,
    fallbackFftSize: 1024,
  };
}

export function clampInitialSampleRate(
  sampleRate: number | undefined,
  profile: ReceiverHardwareProfile
): number {
  const next = sampleRate ?? profile.defaultSampleRate;
  if (!profile.isConstrainedDevice) {
    return next;
  }
  return pickAllowedValueAtMost(
    SAMPLE_RATES,
    Math.min(next, profile.fallbackSampleRate),
    profile.fallbackSampleRate
  );
}

export function clampInitialFftSize(
  fftSize: number | undefined,
  profile: ReceiverHardwareProfile
): number {
  const next = fftSize ?? profile.defaultFftSize;
  if (!profile.isConstrainedDevice) {
    return next;
  }
  return pickAllowedValueAtMost(
    FFT_SIZES,
    Math.min(next, profile.fallbackFftSize),
    profile.fallbackFftSize
  );
}

export function clampInitialPerformanceTradeoff(
  performanceTradeoff: PerformanceTradeoff | undefined,
  profile: ReceiverHardwareProfile
): PerformanceTradeoff {
  const next = performanceTradeoff ?? profile.defaultPerformanceTradeoff;
  if (!profile.isConstrainedDevice || next !== "cpu") {
    return next;
  }
  return profile.fallbackPerformanceTradeoff;
}

export function getReceiverRuntimeProfile(params: {
  isConstrainedDevice: boolean;
  sampleRate: number;
  fftSize: number;
  performanceTradeoff: PerformanceTradeoff;
}): ReceiverRuntimeProfile {
  const { fftSize, isConstrainedDevice, performanceTradeoff, sampleRate } =
    params;
  const shouldReduceUiLoad =
    performanceTradeoff !== "cpu" ||
    sampleRate >= HIGH_SAMPLE_RATE_THRESHOLD ||
    fftSize > FFT_SIZE;

  if (isConstrainedDevice) {
    return {
      liveDataIntervalMs: 140,
      radioBuffersPerSecond: 8,
      waterfallRows: 120,
      waterfallDecimation: 2,
    };
  }

  if (shouldReduceUiLoad) {
    return {
      liveDataIntervalMs: 100,
      radioBuffersPerSecond: 10,
      waterfallRows: 180,
      waterfallDecimation: 2,
    };
  }

  return {
    liveDataIntervalMs: 50,
    radioBuffersPerSecond: 20,
    waterfallRows: WATERFALL_ROWS,
    waterfallDecimation: WATERFALL_DECIMATION,
  };
}
