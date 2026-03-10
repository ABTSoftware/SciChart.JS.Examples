import { useEffect, useState } from "react";
import { FFT_SIZE } from "../constants";
import { loadPresetsFromStorage, savePresetsToStorage } from "../presetsStorage";
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

const isMobile = /Mobi|Android/i.test(navigator.userAgent);

export function useReceiverSettings() {
  const [savedSettings] = useState(() => loadReceiverSettingsFromStorage());
  const [volume, setVolume] = useState(savedSettings.volume ?? 0.7);
  const [ppm, setPpm] = useState(savedSettings.ppm ?? 0);
  const [wbfmDeemphasisUs, setWbfmDeemphasisUs] = useState(
    savedSettings.wbfmDeemphasisUs ?? 50,
  );
  const [biasTEnabled, setBiasTEnabled] = useState(
    savedSettings.biasTEnabled ?? false,
  );
  const [lowFrequencyMethod, setLowFrequencyMethod] =
    useState<LowFrequencyMethodName>(savedSettings.lowFrequencyMethod ?? "default");
  const [directSamplingChannel, setDirectSamplingChannel] =
    useState<DirectSamplingChannel>(savedSettings.directSamplingChannel ?? "Q");
  const [upconverterFrequencyHz, setUpconverterFrequencyHz] =
    useState(savedSettings.upconverterFrequencyHz ?? 100_000_000);
  const [upconverterBiasTee, setUpconverterBiasTee] = useState(
    savedSettings.upconverterBiasTee ?? false,
  );
  const [performanceTradeoff, setPerformanceTradeoff] =
    useState<PerformanceTradeoff>(
      savedSettings.performanceTradeoff ?? (isMobile ? "latency" : "cpu"),
    );
  const [manualGain, setManualGain] = useState(savedSettings.manualGain ?? false);
  const [gainDb, setGainDb] = useState(savedSettings.gainDb ?? 20);
  const [gainControlDisabled, setGainControlDisabled] = useState(false);
  const [sampleRate, setSampleRate] = useState(
    savedSettings.sampleRate ?? (isMobile ? 1_024_000 : 2_048_000),
  );
  const [fftSize, setFftSize] = useState(
    savedSettings.fftSize ?? (isMobile ? 1024 : FFT_SIZE),
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
  };
}
