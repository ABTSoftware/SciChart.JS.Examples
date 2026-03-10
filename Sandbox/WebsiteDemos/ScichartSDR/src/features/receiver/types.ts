export type ModeState = { scheme: string; [key: string]: unknown };
export type DisplayScale = "Hz" | "kHz" | "MHz";
export type LowFrequencyMethodName = "default" | "directSampling" | "upconverter";
export type DirectSamplingChannel = "I" | "Q";
export type PerformanceTradeoff = "cpu" | "latency" | "quality";
export type PresetSortColumn = "name" | "frequency" | "mode" | "-name" | "-frequency" | "-mode";

export type ReceiverPreset = {
  name: string;
  tunedFrequency: number;
  scale: number;
  tuningStep: number;
  scheme: string;
  bandwidth: number;
  stereo: boolean;
  squelch: number;
  gain: number | null;
};

export type RadioLiveDataSnapshot = {
  spectrumDb: Float64Array | null;
  signalPeakDb: number;
};

export type RadioLiveDataSource = {
  subscribeLiveData: (listener: () => void) => () => void;
  getLiveDataSnapshot: () => RadioLiveDataSnapshot;
};

export type RadioEventDetail =
  | { type: "started" }
  | { type: "stopped" }
  | { type: "error"; exception: unknown }
  | { type: "directSampling"; active: boolean };
