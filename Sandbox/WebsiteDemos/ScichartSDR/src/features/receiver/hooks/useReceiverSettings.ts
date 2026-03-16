import { useEffect, useState } from "react";
import { loadPresetsFromStorage, savePresetsToStorage } from "../presetsStorage";
import { FFT_SIZE } from "../constants";
import { getReceiverHardwareProfile } from "../performanceProfile";
import {
  loadReceiverSettingsFromStorage,
  saveReceiverSettingsToStorage,
} from "../settingsStorage";
import type {
  DirectSamplingChannel,
  LowFrequencyMethodName,
  PerformanceTradeoff,
  ReceiverPreset,
} from "../types";

const DEFAULT_SAMPLE_RATE = 2_048_000;
const DEFAULT_LOW_FREQUENCY_METHOD: LowFrequencyMethodName = "directSampling";
const DEFAULT_PERFORMANCE_TRADEOFF: PerformanceTradeoff = "cpu";

export function useReceiverSettings() {
  const [performanceProfile] = useState(() => getReceiverHardwareProfile());
  const [savedSettings] = useState(() => loadReceiverSettingsFromStorage());
  const [volume, setVolume] = useState(savedSettings.volume ?? 0.7);
  const [keepScreenAwake, setKeepScreenAwake] = useState(
    savedSettings.keepScreenAwake ?? performanceProfile.isMobile,
  );
  const [ppm, setPpm] = useState(savedSettings.ppm ?? 0);
  const [wbfmDeemphasisUs, setWbfmDeemphasisUs] = useState(
    savedSettings.wbfmDeemphasisUs ?? 50,
  );
  const [biasTEnabled, setBiasTEnabled] = useState(
    savedSettings.biasTEnabled ?? false,
  );
  const [lowFrequencyMethod, setLowFrequencyMethod] =
    useState<LowFrequencyMethodName>(
      savedSettings.lowFrequencyMethod ?? DEFAULT_LOW_FREQUENCY_METHOD,
    );
  const [directSamplingChannel, setDirectSamplingChannel] =
    useState<DirectSamplingChannel>(savedSettings.directSamplingChannel ?? "Q");
  const [upconverterFrequencyHz, setUpconverterFrequencyHz] =
    useState(savedSettings.upconverterFrequencyHz ?? 100_000_000);
  const [upconverterBiasTee, setUpconverterBiasTee] = useState(
    savedSettings.upconverterBiasTee ?? false,
  );
  const [performanceTradeoff, setPerformanceTradeoff] =
    useState<PerformanceTradeoff>(
      savedSettings.performanceTradeoff ?? DEFAULT_PERFORMANCE_TRADEOFF,
    );
  const [manualGain, setManualGain] = useState(savedSettings.manualGain ?? false);
  const [gainDb, setGainDb] = useState(savedSettings.gainDb ?? 20);
  const [gainControlDisabled, setGainControlDisabled] = useState(false);
  const [sampleRate, setSampleRate] = useState(
    savedSettings.sampleRate ?? DEFAULT_SAMPLE_RATE,
  );
  const [fftSize, setFftSize] = useState(
    savedSettings.fftSize ?? FFT_SIZE,
  );
  const [dbRange, setDbRange] = useState<[number, number]>(
    savedSettings.dbRange ?? [-85, -15],
  );
  const [presets, setPresets] = useState<ReceiverPreset[]>(() =>
    loadPresetsFromStorage(),
  );
  const [presetsOpen, setPresetsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    savePresetsToStorage(presets);
  }, [presets]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      saveReceiverSettingsToStorage({
        volume,
        keepScreenAwake,
        ppm,
        wbfmDeemphasisUs,
        biasTEnabled,
        lowFrequencyMethod,
        directSamplingChannel,
        upconverterFrequencyHz,
        upconverterBiasTee,
        performanceTradeoff,
        manualGain,
        gainDb,
        sampleRate,
        fftSize,
        dbRange,
      });
    }, 150);

    return () => window.clearTimeout(id);
  }, [
    biasTEnabled,
    dbRange,
    directSamplingChannel,
    fftSize,
    gainDb,
    keepScreenAwake,
    lowFrequencyMethod,
    manualGain,
    performanceTradeoff,
    ppm,
    sampleRate,
    upconverterBiasTee,
    upconverterFrequencyHz,
    volume,
    wbfmDeemphasisUs,
  ]);

  return {
    volume,
    setVolume,
    keepScreenAwake,
    setKeepScreenAwake,
    ppm,
    setPpm,
    wbfmDeemphasisUs,
    setWbfmDeemphasisUs,
    biasTEnabled,
    setBiasTEnabled,
    lowFrequencyMethod,
    setLowFrequencyMethod,
    directSamplingChannel,
    setDirectSamplingChannel,
    upconverterFrequencyHz,
    setUpconverterFrequencyHz,
    upconverterBiasTee,
    setUpconverterBiasTee,
    performanceTradeoff,
    setPerformanceTradeoff,
    manualGain,
    setManualGain,
    gainDb,
    setGainDb,
    gainControlDisabled,
    setGainControlDisabled,
    sampleRate,
    setSampleRate,
    fftSize,
    setFftSize,
    dbRange,
    setDbRange,
    presets,
    setPresets,
    presetsOpen,
    setPresetsOpen,
    settingsOpen,
    setSettingsOpen,
    performanceProfile,
  };
}
