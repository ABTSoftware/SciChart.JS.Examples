import type { ReceiverPreset } from "./types";

export const FFT_SIZE = 2048;
export const WATERFALL_ROWS = 300;
export const WATERFALL_DECIMATION = 1; // update the waterfall on every published live snapshot
export const DEFAULT_MODE = "WBFM";
export const DEFAULT_FREQUENCY_HZ = 88_500_000;

export const WATERFALL_MIN_DB = -99;
export const DB_FLOOR_LIMIT = -150;
export const DB_CEILING_LIMIT = 0;
export const PRESETS_STORAGE_KEY = "sdr-radio-presets-v1";
export const PRESETS_SORT_STORAGE_KEY = "sdr-radio-sort-v1";
export const HIGH_SAMPLE_RATE_THRESHOLD = 2_560_000;

export const SAMPLE_RATES: number[] = (() => {
  const rateSet: Set<number> = new Set([256_000]);
  for (let r = 1_024_000; r <= 3_200_000; r += 256_000) rateSet.add(r);
  for (let r = 960_000; r <= 3_200_000; r += 192_000) rateSet.add(r);
  return [...rateSet].filter((r) => r !== 3_072_000).sort((a, b) => a - b);
})();

export const FFT_SIZES: number[] = (() => {
  const sizes: number[] = [];
  for (let s = 32; s <= 32_768; s *= 2) sizes.push(s);
  return sizes;
})();

export const INITIAL_PRESETS: ReceiverPreset[] = [
  { name: "97.0", tunedFrequency: 97_000_000, scale: 1_000_000, tuningStep: 1_000, scheme: "WBFM", bandwidth: 150_000, stereo: true, squelch: 0, gain: null },
  { name: "97.5", tunedFrequency: 97_500_000, scale: 1_000_000, tuningStep: 1_000, scheme: "WBFM", bandwidth: 150_000, stereo: true, squelch: 0, gain: null },
  { name: "98.0", tunedFrequency: 98_000_000, scale: 1_000_000, tuningStep: 1_000, scheme: "WBFM", bandwidth: 150_000, stereo: true, squelch: 0, gain: null },
  { name: "98.5", tunedFrequency: 98_500_000, scale: 1_000_000, tuningStep: 1_000, scheme: "WBFM", bandwidth: 150_000, stereo: true, squelch: 0, gain: null },
  { name: "99.0", tunedFrequency: 99_000_000, scale: 1_000_000, tuningStep: 1_000, scheme: "WBFM", bandwidth: 150_000, stereo: true, squelch: 0, gain: null },
  { name: "145.5", tunedFrequency: 145_500_000, scale: 1_000_000, tuningStep: 1_000, scheme: "NBFM", bandwidth: 12_500, stereo: false, squelch: 0, gain: null },
];
