# App.tsx Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Extract App.tsx logic into three custom hooks — `useFrequency`, `useReceiverSettings`, `useRadio` — leaving App.tsx as ~80 lines of composition + JSX with zero behavior changes.

**Architecture:** Three focused hooks under `src/features/receiver/hooks/`. `useFrequency(sampleRate)` manages all frequency/mode/scheme state and derivations. `useReceiverSettings` manages hardware and display settings. `useRadio({ frequency, settings })` owns the radio lifecycle, hardware writes, and spectrum polling. Cross-hook handlers (`onSetSampleRate`, `onApplyPreset`) live as inline callbacks in App.tsx.

**Tech Stack:** React hooks (useState, useCallback, useMemo, useEffect, useRef), TypeScript, @jtarrio/signals, @jtarrio/webrtlsdr

---

### Task 1: Create hooks directory and `useFrequency` hook

**Files:**
- Create: `src/features/receiver/hooks/useFrequency.ts`

**Step 1: Create the file with complete implementation**

```typescript
import { useCallback, useMemo, useState } from "react";
import { getSchemes, modeParameters } from "@jtarrio/signals/demod/modes.js";
import { DEFAULT_FREQUENCY_HZ, DEFAULT_MODE } from "../constants";
import { createModeState } from "../modeHelpers";
import { clamp, reconcileFrequency, sideBandsForMode } from "../radioHelpers";
import type { DisplayScale, ModeState } from "../types";

export function useFrequency(sampleRate: number) {
  const schemes = useMemo(() => getSchemes(), []);
  const initialMode = useMemo(() => {
    if (schemes.includes(DEFAULT_MODE)) return DEFAULT_MODE;
    return schemes[0] ?? DEFAULT_MODE;
  }, [schemes]);

  const [centerFrequencyHz, setCenterFrequencyHz] = useState(DEFAULT_FREQUENCY_HZ);
  const [tunedFrequencyHz, setTunedFrequencyHz] = useState(DEFAULT_FREQUENCY_HZ);
  const [mode, setMode] = useState(initialMode);
  const [modeState, setModeState] = useState<ModeState>(() =>
    createModeState(initialMode, schemes),
  );
  const [stepHz, setStepHz] = useState(1000);
  const [displayScale, setDisplayScale] = useState<DisplayScale>("MHz");

  const modeConfig = useMemo(() => modeParameters(modeState), [modeState]);
  const hasBandwidth = modeConfig.hasBandwidth();
  const hasStereoControl = modeConfig.hasStereo();
  const bandwidthHz = hasBandwidth ? Math.round(modeConfig.getBandwidth()) : 0;
  const effectiveBandwidthHz = hasBandwidth ? bandwidthHz : 180_000;
  const { leftBandHz, rightBandHz } = useMemo(
    () => sideBandsForMode(modeState.scheme, effectiveBandwidthHz),
    [effectiveBandwidthHz, modeState.scheme],
  );
  const stereoEnabled = hasStereoControl ? modeConfig.getStereo() : false;
  const squelch = modeConfig.hasSquelch() ? modeConfig.getSquelch() : 0;

  const scaleFactor = useMemo(() => {
    if (displayScale === "MHz") return 1_000_000;
    if (displayScale === "kHz") return 1_000;
    return 1;
  }, [displayScale]);

  const displayDecimals = displayScale === "MHz" ? 3 : displayScale === "kHz" ? 1 : 0;
  const centerFrequencyDisplay = Number(
    (centerFrequencyHz / scaleFactor).toFixed(displayDecimals),
  );
  const tunedFrequencyDisplay = Number(
    (tunedFrequencyHz / scaleFactor).toFixed(displayDecimals),
  );

  const safeZoom = clamp(1, 0.25, 4);
  const visibleSpanHz = sampleRate / safeZoom;
  const visibleMinHz = centerFrequencyHz - visibleSpanHz / 2;
  const tunedCenterPct = ((tunedFrequencyHz - visibleMinHz) / visibleSpanHz) * 100;
  const tunedWindowWidthPct = ((leftBandHz + rightBandHz) / visibleSpanHz) * 100;

  const updateCenterFrequency = useCallback(
    (nextCenterHz: number) => {
      const next = reconcileFrequency(
        nextCenterHz,
        tunedFrequencyHz,
        sampleRate,
        leftBandHz,
        rightBandHz,
      );
      setCenterFrequencyHz(next.centerHz);
      setTunedFrequencyHz(next.tunedHz);
    },
    [leftBandHz, rightBandHz, sampleRate, tunedFrequencyHz],
  );

  const updateTunedFrequency = useCallback(
    (nextTunedHz: number) => {
      const next = reconcileFrequency(
        centerFrequencyHz,
        nextTunedHz,
        sampleRate,
        leftBandHz,
        rightBandHz,
      );
      setCenterFrequencyHz(next.centerHz);
      setTunedFrequencyHz(next.tunedHz);
    },
    [centerFrequencyHz, leftBandHz, rightBandHz, sampleRate],
  );

  const updateModeState = useCallback(
    (mutator: (config: ReturnType<typeof modeParameters>) => void) => {
      const config = modeParameters({ ...modeState });
      mutator(config);
      const nextModeState = { ...(config.mode as ModeState) };
      setModeState(nextModeState);

      const nextBandwidthHz = config.hasBandwidth()
        ? Math.round(config.getBandwidth())
        : 180_000;
      const nextSideBands = sideBandsForMode(nextModeState.scheme, nextBandwidthHz);
      const nextFrequency = reconcileFrequency(
        centerFrequencyHz,
        tunedFrequencyHz,
        sampleRate,
        nextSideBands.leftBandHz,
        nextSideBands.rightBandHz,
      );
      setCenterFrequencyHz(nextFrequency.centerHz);
      setTunedFrequencyHz(nextFrequency.tunedHz);
    },
    [centerFrequencyHz, modeState, sampleRate, tunedFrequencyHz],
  );

  const applyScheme = useCallback(
    (schemeName: string) => {
      const nextModeState = createModeState(schemeName, schemes);
      setMode(schemeName);
      setModeState(nextModeState);

      const modeCfg = modeParameters(nextModeState);
      const nextBandwidthHz = modeCfg.hasBandwidth()
        ? Math.round(modeCfg.getBandwidth())
        : 180_000;
      const nextSideBands = sideBandsForMode(nextModeState.scheme, nextBandwidthHz);
      const nextFrequency = reconcileFrequency(
        centerFrequencyHz,
        tunedFrequencyHz,
        sampleRate,
        nextSideBands.leftBandHz,
        nextSideBands.rightBandHz,
      );
      setCenterFrequencyHz(nextFrequency.centerHz);
      setTunedFrequencyHz(nextFrequency.tunedHz);
    },
    [centerFrequencyHz, sampleRate, schemes, tunedFrequencyHz],
  );

  const stepTune = useCallback(
    (direction: -1 | 1) => {
      updateTunedFrequency(tunedFrequencyHz + direction * stepHz);
    },
    [stepHz, tunedFrequencyHz, updateTunedFrequency],
  );

  return {
    schemes,
    centerFrequencyHz,
    setCenterFrequencyHz,
    tunedFrequencyHz,
    setTunedFrequencyHz,
    mode,
    modeState,
    setModeState,
    stepHz,
    setStepHz,
    displayScale,
    setDisplayScale,
    modeConfig,
    hasBandwidth,
    hasStereoControl,
    bandwidthHz,
    effectiveBandwidthHz,
    leftBandHz,
    rightBandHz,
    stereoEnabled,
    squelch,
    scaleFactor,
    displayDecimals,
    centerFrequencyDisplay,
    tunedFrequencyDisplay,
    visibleSpanHz,
    tunedCenterPct,
    tunedWindowWidthPct,
    updateCenterFrequency,
    updateTunedFrequency,
    updateModeState,
    applyScheme,
    stepTune,
  };
}
```

**Step 2: Verify TypeScript compiles**

```bash
cd /Users/igor/Documents/coding/scicharts/sdr/radio/sdr-radio && npx tsc --noEmit
```

Expected: no errors (or same errors as before if any pre-existed).

**Step 3: Commit**

```bash
git add src/features/receiver/hooks/useFrequency.ts
git commit -m "refactor: add useFrequency hook"
```

---

### Task 2: Create `useReceiverSettings` hook

**Files:**
- Create: `src/features/receiver/hooks/useReceiverSettings.ts`

**Step 1: Create the file**

```typescript
import { useEffect, useState } from "react";
import { FFT_SIZE } from "../constants";
import { loadPresetsFromStorage, savePresetsToStorage } from "../presetsStorage";
import type {
  DirectSamplingChannel,
  LowFrequencyMethodName,
  PerformanceTradeoff,
  ReceiverPreset,
} from "../types";

export function useReceiverSettings() {
  const [volume, setVolume] = useState(0.7);
  const [ppm, setPpm] = useState(0);
  const [wbfmDeemphasisUs, setWbfmDeemphasisUs] = useState(50);
  const [biasTEnabled, setBiasTEnabled] = useState(false);
  const [lowFrequencyMethod, setLowFrequencyMethod] =
    useState<LowFrequencyMethodName>("default");
  const [directSamplingChannel, setDirectSamplingChannel] =
    useState<DirectSamplingChannel>("Q");
  const [upconverterFrequencyHz, setUpconverterFrequencyHz] =
    useState(100_000_000);
  const [upconverterBiasTee, setUpconverterBiasTee] = useState(false);
  const [performanceTradeoff, setPerformanceTradeoff] =
    useState<PerformanceTradeoff>("cpu");
  const [manualGain, setManualGain] = useState(false);
  const [gainDb, setGainDb] = useState(20);
  const [gainControlDisabled, setGainControlDisabled] = useState(false);
  const [sampleRate, setSampleRate] = useState(2_048_000);
  const [fftSize, setFftSize] = useState(FFT_SIZE);
  const [dbRange, setDbRange] = useState<[number, number]>([-85, -15]);
  const [presets, setPresets] = useState<ReceiverPreset[]>(() =>
    loadPresetsFromStorage(),
  );
  const [presetsOpen, setPresetsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    savePresetsToStorage(presets);
  }, [presets]);

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
```

**Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add src/features/receiver/hooks/useReceiverSettings.ts
git commit -m "refactor: add useReceiverSettings hook"
```

---

### Task 3: Create `useRadio` hook

**Files:**
- Create: `src/features/receiver/hooks/useRadio.ts`

**Step 1: Create the file**

```typescript
import { useCallback, useEffect, useRef, useState } from "react";
import { Demodulator } from "@jtarrio/signals/demod/demodulator.js";
import { Spectrum } from "@jtarrio/signals/demod/spectrum.js";
import { CompositeReceiver } from "@jtarrio/signals/radio/sample_receiver.js";
import { Radio, RtlProvider } from "@jtarrio/webrtlsdr/radio.js";
import { RdsReceiver } from "../rdsReceiver";
import {
  clamp,
  fftShift,
  getDemodModeOptions,
  getRadioErrorMessage,
  isNoDeviceSelectedError,
  isTransferInterruptedError,
} from "../radioHelpers";
import { WATERFALL_MIN_DB } from "../constants";
import type { RadioEventDetail } from "../types";
import type { useFrequency } from "./useFrequency";
import type { useReceiverSettings } from "./useReceiverSettings";

type FrequencyState = ReturnType<typeof useFrequency>;
type SettingsState = ReturnType<typeof useReceiverSettings>;

interface UseRadioParams {
  frequency: FrequencyState;
  settings: SettingsState;
}

export function useRadio({ frequency, settings }: UseRadioParams) {
  const [connected, setConnected] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spectrumDb, setSpectrumDb] = useState<number[] | null>(null);
  const [signalPeakDb, setSignalPeakDb] = useState(WATERFALL_MIN_DB);
  const [stereoDetected, setStereoDetected] = useState(false);
  const [stationName, setStationName] = useState("");

  const radioRef = useRef<Radio | null>(null);
  const demodRef = useRef<Demodulator | null>(null);
  const rdsRef = useRef<RdsReceiver | null>(null);
  const spectrumRef = useRef<Spectrum | null>(null);
  const spectrumBufferRef = useRef<Float32Array>(
    new Float32Array(settings.fftSize),
  );
  const stopRequestedRef = useRef(false);
  const prevCenterForDeviceHzRef = useRef<number | null>(null);
  const prevFrequencyOffsetRef = useRef<number | null>(null);
  const hardwareUpdateTimerRef = useRef<number | null>(null);
  const usbOperationChainRef = useRef<Promise<void>>(Promise.resolve());
  const lastWrittenHwRef = useRef<{
    centerHz: number;
    ppm: number;
    gain: number | null;
    biasTee: boolean;
    directSampling: number;
  } | null>(null);

  useEffect(() => {
    spectrumBufferRef.current = new Float32Array(settings.fftSize);
  }, [settings.fftSize]);

  const applyRadioSettings = useCallback(() => {
    const radio = radioRef.current;
    const demod = demodRef.current;
    if (!radio || !demod) {
      return;
    }

    const frequencyOffset =
      frequency.tunedFrequencyHz - frequency.centerFrequencyHz;
    const inLowBand = frequency.tunedFrequencyHz < 28_800_000;
    const directSamplingMethod =
      inLowBand && settings.lowFrequencyMethod === "directSampling"
        ? settings.directSamplingChannel === "I"
          ? 1
          : 2
        : 0;
    const centerForDeviceHz =
      inLowBand && settings.lowFrequencyMethod === "upconverter"
        ? frequency.centerFrequencyHz + settings.upconverterFrequencyHz
        : frequency.centerFrequencyHz;
    const biasTeeEffective =
      inLowBand && settings.lowFrequencyMethod === "upconverter"
        ? settings.upconverterBiasTee
        : settings.biasTEnabled;

    void radio.setSampleRate(settings.sampleRate);

    if (!playing) {
      demod.setSampleRate(settings.sampleRate);
      rdsRef.current?.setSampleRate(settings.sampleRate);
      setStationName("");
    }

    const prevCenter = prevCenterForDeviceHzRef.current;
    const prevOffset = prevFrequencyOffsetRef.current;
    const centerChanged = prevCenter === null || prevCenter !== centerForDeviceHz;
    const offsetChanged = prevOffset === null || prevOffset !== frequencyOffset;
    if (centerChanged && offsetChanged) {
      demod.expectFrequencyAndSetOffset(centerForDeviceHz, frequencyOffset);
    } else if (offsetChanged) {
      demod.setFrequencyOffset(frequencyOffset);
    }
    prevCenterForDeviceHzRef.current = centerForDeviceHz;
    prevFrequencyOffsetRef.current = frequencyOffset;
    demod.setVolume(settings.volume);
    demod.setMode(frequency.modeState);

    if (!playing) {
      return;
    }

    if (hardwareUpdateTimerRef.current !== null) {
      window.clearTimeout(hardwareUpdateTimerRef.current);
    }
    const capturedRadio = radio;
    const capturedCenterHz = centerForDeviceHz;
    const capturedPpm = settings.ppm;
    const capturedGain =
      settings.manualGain && !settings.gainControlDisabled
        ? settings.gainDb
        : null;
    const capturedBiasTee = biasTeeEffective;
    const capturedDirectSampling = directSamplingMethod;
    hardwareUpdateTimerRef.current = window.setTimeout(() => {
      hardwareUpdateTimerRef.current = null;
      usbOperationChainRef.current = usbOperationChainRef.current.then(
        async () => {
          const last = lastWrittenHwRef.current;
          try {
            if (!last || last.centerHz !== capturedCenterHz) {
              await capturedRadio.setFrequency(capturedCenterHz);
            }
            if (!last || last.ppm !== capturedPpm) {
              await capturedRadio.setFrequencyCorrection(capturedPpm);
            }
            if (!last || last.gain !== capturedGain) {
              await capturedRadio.setGain(capturedGain);
            }
            if (!last || last.biasTee !== capturedBiasTee) {
              await capturedRadio.enableBiasTee(capturedBiasTee);
            }
            if (!last || last.directSampling !== capturedDirectSampling) {
              await capturedRadio.setDirectSamplingMethod(
                capturedDirectSampling,
              );
            }
            lastWrittenHwRef.current = {
              centerHz: capturedCenterHz,
              ppm: capturedPpm,
              gain: capturedGain,
              biasTee: capturedBiasTee,
              directSampling: capturedDirectSampling,
            };
          } catch (exception) {
            lastWrittenHwRef.current = null;
            setError(getRadioErrorMessage(exception));
          }
        },
      );
    }, 50);
  }, [
    settings.biasTEnabled,
    frequency.centerFrequencyHz,
    settings.directSamplingChannel,
    settings.gainControlDisabled,
    settings.gainDb,
    settings.lowFrequencyMethod,
    settings.manualGain,
    frequency.modeState,
    playing,
    settings.ppm,
    settings.sampleRate,
    frequency.tunedFrequencyHz,
    settings.upconverterBiasTee,
    settings.upconverterFrequencyHz,
    settings.volume,
  ]);

  const connectAndStart = useCallback(() => {
    if (busy || playing) {
      return;
    }

    stopRequestedRef.current = false;
    setBusy(true);
    setError(null);

    if (!radioRef.current) {
      const demod = new Demodulator({
        modeOptions: getDemodModeOptions(
          settings.performanceTradeoff,
          settings.wbfmDeemphasisUs,
        ),
      });
      const spectrum = new Spectrum(settings.fftSize);
      const rds = new RdsReceiver(
        settings.sampleRate,
        () => demod.getFrequencyOffset(),
        (name) => {
          setStationName(name);
        },
      );
      const receiver = CompositeReceiver.of(rds, spectrum, demod);
      const radio = new Radio(new RtlProvider(), receiver);

      radio.addEventListener("radio", (event) => {
        const detail = (event as CustomEvent<RadioEventDetail>).detail;
        if (detail.type === "started") {
          setConnected(true);
          setPlaying(true);
          setBusy(false);
          applyRadioSettings();
        }
        if (detail.type === "stopped") {
          setPlaying(false);
          setBusy(false);
          setStationName("");
        }
        if (detail.type === "directSampling") {
          settings.setGainControlDisabled(detail.active);
          if (detail.active) {
            settings.setManualGain(false);
          }
        }
        if (detail.type === "error") {
          if (isNoDeviceSelectedError(detail.exception)) {
            setPlaying(false);
            setBusy(false);
            stopRequestedRef.current = false;
            return;
          }
          if (
            stopRequestedRef.current &&
            isTransferInterruptedError(detail.exception)
          ) {
            setPlaying(false);
            setBusy(false);
            setError(null);
            return;
          }
          setError(getRadioErrorMessage(detail.exception));
          setPlaying(false);
          setConnected(false);
          setBusy(false);
          stopRequestedRef.current = false;
        }
      });

      demod.addEventListener("stereo-status", (event) => {
        setStereoDetected(Boolean((event as CustomEvent<boolean>).detail));
      });

      demodRef.current = demod;
      rdsRef.current = rds;
      spectrumRef.current = spectrum;
      radioRef.current = radio;
    }

    applyRadioSettings();
    const radio = radioRef.current;
    if (!radio) {
      setBusy(false);
      return;
    }
    void radio.start().finally(() => {
      setBusy(false);
    });
  }, [
    applyRadioSettings,
    busy,
    settings.fftSize,
    settings.performanceTradeoff,
    playing,
    settings.sampleRate,
    settings.setGainControlDisabled,
    settings.setManualGain,
    settings.wbfmDeemphasisUs,
  ]);

  const stopRadio = useCallback(() => {
    if (!radioRef.current) {
      return;
    }

    stopRequestedRef.current = true;
    setBusy(true);
    if (hardwareUpdateTimerRef.current !== null) {
      window.clearTimeout(hardwareUpdateTimerRef.current);
      hardwareUpdateTimerRef.current = null;
    }
    usbOperationChainRef.current = Promise.resolve();
    lastWrittenHwRef.current = null;
    void radioRef.current.stop().finally(() => {
      radioRef.current = null;
      demodRef.current = null;
      rdsRef.current = null;
      spectrumRef.current = null;
      prevCenterForDeviceHzRef.current = null;
      prevFrequencyOffsetRef.current = null;
      setConnected(false);
      setPlaying(false);
      setBusy(false);
    });
  }, []);

  const disconnectRadio = useCallback(async () => {
    stopRequestedRef.current = true;
    setBusy(true);
    try {
      await radioRef.current?.stop();
    } catch {
      // Ignore stop errors while disconnecting.
    }

    if (hardwareUpdateTimerRef.current !== null) {
      window.clearTimeout(hardwareUpdateTimerRef.current);
      hardwareUpdateTimerRef.current = null;
    }
    usbOperationChainRef.current = Promise.resolve();
    lastWrittenHwRef.current = null;
    radioRef.current = null;
    demodRef.current = null;
    rdsRef.current = null;
    spectrumRef.current = null;
    prevCenterForDeviceHzRef.current = null;
    prevFrequencyOffsetRef.current = null;
    setConnected(false);
    setPlaying(false);
    setStereoDetected(false);
    setBusy(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    applyRadioSettings();
  }, [applyRadioSettings]);

  useEffect(() => {
    if (!playing) {
      return;
    }

    const tick = () => {
      const spectrum = spectrumRef.current;
      if (!spectrum) {
        return;
      }

      const raw = spectrumBufferRef.current;
      spectrum.getSpectrum(raw);
      const shifted = fftShift(raw);
      const nextSpectrumDb = Array.from(shifted, (value) =>
        clamp(
          Number.isFinite(value) ? value : settings.dbRange[0],
          settings.dbRange[0],
          settings.dbRange[1],
        ),
      );

      setSpectrumDb(nextSpectrumDb);

      let peak = -999;
      for (let i = 0; i < nextSpectrumDb.length; i += 1) {
        if (nextSpectrumDb[i] > peak) {
          peak = nextSpectrumDb[i];
        }
      }
      setSignalPeakDb(peak);
    };

    const id = window.setInterval(tick, 50);
    return () => window.clearInterval(id);
  }, [settings.dbRange, playing]);

  useEffect(() => {
    return () => {
      const radio = radioRef.current;
      stopRequestedRef.current = true;
      radioRef.current = null;
      demodRef.current = null;
      rdsRef.current = null;
      spectrumRef.current = null;
      if (radio) {
        void radio.stop();
      }
    };
  }, []);

  return {
    connected,
    playing,
    busy,
    error,
    spectrumDb,
    signalPeakDb,
    stereoDetected,
    stationName,
    connectAndStart,
    stopRadio,
    disconnectRadio,
  };
}
```

**Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add src/features/receiver/hooks/useRadio.ts
git commit -m "refactor: add useRadio hook"
```

---

### Task 4: Rewrite App.tsx to use the three hooks

**Files:**
- Modify: `src/App.tsx`

**Step 1: Replace App.tsx content**

The new App.tsx delegates all state and logic to the three hooks. Cross-hook handlers (`onSetSampleRate`, `onApplyPreset`) are inline callbacks here because they need both `frequency` and `settings`.

```tsx
import React, {
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Box, Paper, Slider, Typography } from "@mui/material";
import { modeParameters } from "@jtarrio/signals/demod/modes.js";
import { ReceiverControls } from "./components/ReceiverControls";
import { SpectrumChart } from "./components/SpectrumChart";
import { WaterfallChart } from "./components/WaterfallChart";
import {
  DB_CEILING_LIMIT,
  DB_FLOOR_LIMIT,
  FFT_SIZES,
  HIGH_SAMPLE_RATE_THRESHOLD,
  SAMPLE_RATES,
  WATERFALL_ROWS,
} from "./features/receiver/constants";
import { useFrequency } from "./features/receiver/hooks/useFrequency";
import { useReceiverSettings } from "./features/receiver/hooks/useReceiverSettings";
import { useRadio } from "./features/receiver/hooks/useRadio";
import { reconcileFrequency, sideBandsForMode } from "./features/receiver/radioHelpers";
import type { ModeState } from "./features/receiver/types";
import "./App.css";

function App() {
  const settings = useReceiverSettings();
  const frequency = useFrequency(settings.sampleRate);
  const radio = useRadio({ frequency, settings });

  const chartsContainerRef = useRef<HTMLDivElement | null>(null);
  const windowDragStartXRef = useRef(0);
  const windowDragStartFreqRef = useRef(0);

  const [spectrumChartReady, setSpectrumChartReady] = useState(false);
  const [waterfallChartReady, setWaterfallChartReady] = useState(false);

  const currentPreset = useMemo(
    () => ({
      name: `Preset ${(settings.presets.length + 1).toString()}`,
      tunedFrequency: frequency.tunedFrequencyHz,
      scale:
        frequency.displayScale === "MHz"
          ? 1_000_000
          : frequency.displayScale === "kHz"
            ? 1_000
            : 1,
      tuningStep: frequency.stepHz,
      scheme: frequency.modeState.scheme,
      bandwidth: frequency.bandwidthHz,
      stereo: frequency.stereoEnabled,
      squelch: frequency.squelch,
      gain: settings.manualGain ? settings.gainDb : null,
    }),
    [
      frequency.bandwidthHz,
      frequency.displayScale,
      frequency.modeState.scheme,
      frequency.squelch,
      frequency.stepHz,
      frequency.stereoEnabled,
      frequency.tunedFrequencyHz,
      settings.gainDb,
      settings.manualGain,
      settings.presets.length,
    ],
  );

  const handleWindowPointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    windowDragStartXRef.current = event.clientX;
    windowDragStartFreqRef.current = frequency.tunedFrequencyHz;
  };

  const handleWindowPointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (event.buttons === 0) return;
    const container = chartsContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    if (rect.width <= 0) return;
    const deltaHz =
      ((event.clientX - windowDragStartXRef.current) / rect.width) *
      frequency.visibleSpanHz;
    frequency.updateTunedFrequency(
      Math.max(
        100_000,
        Math.round(windowDragStartFreqRef.current + deltaHz),
      ),
    );
  };

  return (
    <Box className="receiver-page">
      <Paper className="receiver-frame" elevation={0}>
        <Box className="receiver-charts" ref={chartsContainerRef}>
          <SpectrumChart
            frequencyHz={frequency.centerFrequencyHz}
            sampleRate={settings.sampleRate}
            zoomLevel={1}
            fftSize={settings.fftSize}
            minDb={settings.dbRange[0]}
            maxDb={settings.dbRange[1]}
            spectrumDb={radio.spectrumDb}
            onTune={frequency.updateTunedFrequency}
            onError={(e) => { /* error handled by radio hook */ }}
            onReadyChange={setSpectrumChartReady}
          />
          <Box className="waterfall-layer">
            <WaterfallChart
              frequencyHz={frequency.centerFrequencyHz}
              sampleRate={settings.sampleRate}
              zoomLevel={1}
              fftSize={settings.fftSize}
              rows={WATERFALL_ROWS}
              minDb={settings.dbRange[0]}
              maxDb={settings.dbRange[1]}
              spectrumDb={radio.spectrumDb}
              onTune={frequency.updateTunedFrequency}
              onError={(e) => { /* error handled by radio hook */ }}
              onReadyChange={setWaterfallChartReady}
            />
          </Box>
          <div
            className="tuned-window"
            style={
              {
                "--tuned-left": `${frequency.tunedCenterPct - frequency.tunedWindowWidthPct / 2}%`,
                "--tuned-width": `${frequency.tunedWindowWidthPct}%`,
              } as React.CSSProperties
            }
            onPointerDown={handleWindowPointerDown}
            onPointerMove={handleWindowPointerMove}
          />
        </Box>

        {radio.stationName ? (
          <Box className="rds-station-bar">
            <Typography className="rds-station-name">
              {radio.stationName}
            </Typography>
          </Box>
        ) : null}

        <ReceiverControls
          playing={radio.playing}
          busy={radio.busy}
          connected={radio.connected}
          error={radio.error}
          presetsOpen={settings.presetsOpen}
          settingsOpen={settings.settingsOpen}
          centerFrequencyDisplay={frequency.centerFrequencyDisplay}
          tunedFrequencyDisplay={frequency.tunedFrequencyDisplay}
          displayScale={frequency.displayScale}
          scaleFactor={frequency.scaleFactor}
          stepHz={frequency.stepHz}
          mode={frequency.mode}
          schemes={frequency.schemes}
          hasStereoControl={frequency.hasStereoControl}
          stereoEnabled={frequency.stereoEnabled}
          gainDb={settings.gainDb}
          manualGain={settings.manualGain}
          gainControlDisabled={settings.gainControlDisabled}
          volume={settings.volume}
          presets={settings.presets}
          currentPreset={currentPreset}
          sampleRate={settings.sampleRate}
          sampleRates={SAMPLE_RATES}
          ppm={settings.ppm}
          fftSize={settings.fftSize}
          fftSizes={FFT_SIZES}
          wbfmDeemphasisUs={settings.wbfmDeemphasisUs}
          biasTEnabled={settings.biasTEnabled}
          lowFrequencyMethod={settings.lowFrequencyMethod}
          directSamplingChannel={settings.directSamplingChannel}
          upconverterFrequencyHz={settings.upconverterFrequencyHz}
          upconverterBiasTee={settings.upconverterBiasTee}
          performanceTradeoff={settings.performanceTradeoff}
          signalPeakDb={radio.signalPeakDb}
          modeScheme={frequency.modeState.scheme}
          stereoDetected={radio.stereoDetected}
          centerFrequencyHz={frequency.centerFrequencyHz}
          tunedFrequencyHz={frequency.tunedFrequencyHz}
          onStartStop={() =>
            void (radio.playing ? radio.stopRadio() : radio.connectAndStart())
          }
          onOpenPresets={() => settings.setPresetsOpen(true)}
          onClosePresets={() => settings.setPresetsOpen(false)}
          onOpenSettings={() => settings.setSettingsOpen(true)}
          onCloseSettings={() => settings.setSettingsOpen(false)}
          onSetCenterFrequency={frequency.updateCenterFrequency}
          onSetTunedFrequency={frequency.updateTunedFrequency}
          onSetStepHz={frequency.setStepHz}
          onSetDisplayScale={frequency.setDisplayScale}
          onStepDown={() => frequency.stepTune(-1)}
          onStepUp={() => frequency.stepTune(1)}
          onApplyScheme={frequency.applyScheme}
          onToggleMono={(mono) => {
            frequency.updateModeState((config) => {
              if (config.hasStereo()) {
                config.setStereo(!mono);
              }
            });
          }}
          onSetGain={settings.setGainDb}
          onToggleAutoGain={(autoGain) => settings.setManualGain(!autoGain)}
          onSetVolume={settings.setVolume}
          onSetFftSize={(value) => {
            settings.setFftSize(value);
            // spectrumDb is managed inside useRadio; clearing it on fftSize change
            // is handled automatically via spectrumBufferRef resize in useRadio
          }}
          onSetWbfmDeemphasisUs={settings.setWbfmDeemphasisUs}
          onSetBiasTEnabled={settings.setBiasTEnabled}
          onSetLowFrequencyMethod={settings.setLowFrequencyMethod}
          onSetDirectSamplingChannel={settings.setDirectSamplingChannel}
          onSetUpconverterFrequencyHz={settings.setUpconverterFrequencyHz}
          onSetUpconverterBiasTee={settings.setUpconverterBiasTee}
          onSetPerformanceTradeoff={settings.setPerformanceTradeoff}
          onApplyPreset={(preset) => {
            frequency.updateCenterFrequency(preset.tunedFrequency);
            frequency.updateTunedFrequency(preset.tunedFrequency);
            frequency.setStepHz(preset.tuningStep);
            if (frequency.schemes.includes(preset.scheme)) {
              frequency.applyScheme(preset.scheme);
            }
            settings.setManualGain(preset.gain !== null);
            if (preset.gain !== null) {
              settings.setGainDb(preset.gain);
            }
            const cfg = modeParameters({
              ...frequency.modeState,
              scheme: preset.scheme,
            });
            if (cfg.hasBandwidth()) {
              cfg.setBandwidth(preset.bandwidth);
            }
            if (cfg.hasStereo()) {
              cfg.setStereo(preset.stereo);
            }
            if (cfg.hasSquelch()) {
              cfg.setSquelch(preset.squelch);
            }
            const nextModeState = { ...(cfg.mode as ModeState) };
            frequency.setModeState(nextModeState);
            const nextSideBands = sideBandsForMode(
              nextModeState.scheme,
              preset.bandwidth,
            );
            const nextFrequency = reconcileFrequency(
              frequency.centerFrequencyHz,
              preset.tunedFrequency,
              settings.sampleRate,
              nextSideBands.leftBandHz,
              nextSideBands.rightBandHz,
            );
            frequency.setCenterFrequencyHz(nextFrequency.centerHz);
            frequency.setTunedFrequencyHz(nextFrequency.tunedHz);
          }}
          onPresetsChange={settings.setPresets}
          onSetSampleRate={(nextSampleRate) => {
            settings.setSampleRate(nextSampleRate);
            settings.setPerformanceTradeoff(
              nextSampleRate >= HIGH_SAMPLE_RATE_THRESHOLD
                ? "latency"
                : "cpu",
            );
            const next = reconcileFrequency(
              frequency.centerFrequencyHz,
              frequency.tunedFrequencyHz,
              nextSampleRate,
              frequency.leftBandHz,
              frequency.rightBandHz,
            );
            frequency.setCenterFrequencyHz(next.centerHz);
            frequency.setTunedFrequencyHz(next.tunedHz);
          }}
          onSetPpm={settings.setPpm}
          onDisconnect={() => void radio.disconnectRadio()}
        />

        <Box className="db-range-row">
          <Typography className="db-label">{settings.dbRange[0]} dB</Typography>
          <Box className="db-gradient">
            <Slider
              size="small"
              value={settings.dbRange}
              min={DB_FLOOR_LIMIT}
              max={DB_CEILING_LIMIT}
              step={1}
              disableSwap
              onChange={(_, value) =>
                settings.setDbRange(value as [number, number])
              }
              onPointerDown={(event) => event.stopPropagation()}
              aria-label="dB range"
            />
          </Box>
          <Typography className="db-label">{settings.dbRange[1]} dB</Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default App;
```

**Step 2: Check TypeScript**

```bash
npx tsc --noEmit
```

Fix any type errors before proceeding.

**Step 3: Check the app runs**

```bash
npm run dev
```

Open the app in the browser. Verify:
- Spectrum and waterfall charts render
- Connect button works
- Frequency tuning works (click on spectrum, drag tuned window)
- Mode/scheme selector works
- Volume, gain, presets work
- RDS station name appears for FM stations

**Step 4: Note about `onError` in charts**

The original `onError` passed `setError` directly to SpectrumChart and WaterfallChart. The `error` state is now inside `useRadio`. If those chart components call `onError`, the error won't propagate to the radio's error state. Check [ReceiverControls.tsx](src/components/ReceiverControls.tsx) and the chart components to see if `onError` is actually called — if so, expose a `setError` from `useRadio` and wire it up. If not, the no-op lambda is fine.

**Step 5: Commit**

```bash
git add src/App.tsx
git commit -m "refactor: simplify App.tsx using useFrequency, useReceiverSettings, useRadio hooks"
```

---

### Task 5: Create hooks index barrel (optional cleanup)

**Files:**
- Create: `src/features/receiver/hooks/index.ts`

**Step 1: Create barrel export**

```typescript
export { useFrequency } from "./useFrequency";
export { useRadio } from "./useRadio";
export { useReceiverSettings } from "./useReceiverSettings";
```

**Step 2: Commit**

```bash
git add src/features/receiver/hooks/index.ts
git commit -m "refactor: add hooks barrel export"
```
