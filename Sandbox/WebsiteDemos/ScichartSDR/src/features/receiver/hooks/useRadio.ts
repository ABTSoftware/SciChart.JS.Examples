import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Demodulator } from "@jtarrio/signals/demod/demodulator.js";
import { Spectrum } from "@jtarrio/signals/demod/spectrum.js";
import { CompositeReceiver } from "@jtarrio/signals/radio/sample_receiver.js";
import { Radio, RtlProvider } from "@jtarrio/webrtlsdr/radio.js";
import { getReceiverRuntimeProfile } from "../performanceProfile";
import {
  clamp,
  getDemodModeOptions,
  getRadioErrorMessage,
  isNoDeviceSelectedError,
  isTransferInterruptedError,
  isUsbDisconnectError,
} from "../radioHelpers";
import { WATERFALL_MIN_DB } from "../constants";
import type { RadioEventDetail, RadioLiveDataSnapshot } from "../types";
import type { useFrequency } from "./useFrequency";
import type { useReceiverSettings } from "./useReceiverSettings";

type FrequencyState = ReturnType<typeof useFrequency>;
type SettingsState = ReturnType<typeof useReceiverSettings>;

interface UseRadioParams {
  frequency: FrequencyState;
  settings: SettingsState;
}

function createSpectrumBuffers(size: number): [Float64Array, Float64Array] {
  return [new Float64Array(size), new Float64Array(size)];
}

export function useRadio({ frequency, settings }: UseRadioParams) {
  const [connected, setConnected] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stereoDetected, setStereoDetected] = useState(false);

  const radioRef = useRef<Radio | null>(null);
  const demodRef = useRef<Demodulator | null>(null);
  const spectrumRef = useRef<Spectrum | null>(null);
  const spectrumBufferRef = useRef<Float32Array>(
    new Float32Array(settings.fftSize),
  );
  const liveSpectrumBuffersRef = useRef(createSpectrumBuffers(settings.fftSize));
  const liveSpectrumBufferIndexRef = useRef(0);
  const stopRequestedRef = useRef(false);
  const prevCenterForDeviceHzRef = useRef<number | null>(null);
  const prevFrequencyOffsetRef = useRef<number | null>(null);
  const hardwareUpdateTimerRef = useRef<number | null>(null);
  const usbOperationChainRef = useRef<Promise<void>>(Promise.resolve());
  const stabilityFallbackAppliedRef = useRef(false);
  const lastWrittenHwRef = useRef<{
    centerHz: number;
    ppm: number;
    gain: number | null;
    biasTee: boolean;
    directSampling: number;
  } | null>(null);
  const pipelineConfigRef = useRef<{
    performanceTradeoff: SettingsState["performanceTradeoff"];
    wbfmDeemphasisUs: SettingsState["wbfmDeemphasisUs"];
  } | null>(null);
  const liveDataRef = useRef<RadioLiveDataSnapshot>({
    spectrumDb: null,
    signalPeakDb: WATERFALL_MIN_DB,
  });
  const liveDataListenersRef = useRef(new Set<() => void>());
  const frequencyRef = useRef(frequency);
  const settingsRef = useRef(settings);
  const busyRef = useRef(busy);
  const playingRef = useRef(playing);

  useLayoutEffect(() => {
    frequencyRef.current = frequency;
    settingsRef.current = settings;
    busyRef.current = busy;
    playingRef.current = playing;
  }, [busy, frequency, playing, settings]);

  const clearPendingHardwareUpdate = useCallback(() => {
    if (hardwareUpdateTimerRef.current !== null) {
      window.clearTimeout(hardwareUpdateTimerRef.current);
      hardwareUpdateTimerRef.current = null;
    }
  }, []);

  const resetRadioInternals = useCallback(() => {
    radioRef.current = null;
    demodRef.current = null;
    spectrumRef.current = null;
    prevCenterForDeviceHzRef.current = null;
    prevFrequencyOffsetRef.current = null;
    lastWrittenHwRef.current = null;
    pipelineConfigRef.current = null;
  }, []);

  const publishLiveData = useCallback((nextLiveData: RadioLiveDataSnapshot) => {
    liveDataRef.current = nextLiveData;
    liveDataListenersRef.current.forEach((listener) => {
      listener();
    });
  }, []);

  const resetLiveData = useCallback(() => {
    publishLiveData({
      spectrumDb: null,
      signalPeakDb: WATERFALL_MIN_DB,
    });
  }, [publishLiveData]);

  const subscribeLiveData = useCallback((listener: () => void) => {
    liveDataListenersRef.current.add(listener);
    return () => {
      liveDataListenersRef.current.delete(listener);
    };
  }, []);

  const getLiveDataSnapshot = useCallback(() => liveDataRef.current, []);

  const applyPerformanceFallback = useCallback(() => {
    const currentSettings = settingsRef.current;
    const fallbackSampleRate =
      currentSettings.performanceProfile.fallbackSampleRate;
    const fallbackFftSize = currentSettings.performanceProfile.fallbackFftSize;
    const fallbackPerformanceTradeoff =
      currentSettings.performanceProfile.fallbackPerformanceTradeoff;

    const shouldLowerSampleRate = currentSettings.sampleRate > fallbackSampleRate;
    const shouldLowerFftSize = currentSettings.fftSize > fallbackFftSize;
    const shouldLowerTradeoff =
      currentSettings.performanceTradeoff === "cpu" &&
      currentSettings.performanceTradeoff !== fallbackPerformanceTradeoff;

    if (!shouldLowerSampleRate && !shouldLowerFftSize && !shouldLowerTradeoff) {
      return false;
    }

    stabilityFallbackAppliedRef.current = true;
    if (shouldLowerSampleRate) {
      currentSettings.setSampleRate(fallbackSampleRate);
    }
    if (shouldLowerFftSize) {
      currentSettings.setFftSize(fallbackFftSize);
    }
    if (shouldLowerTradeoff) {
      currentSettings.setPerformanceTradeoff(fallbackPerformanceTradeoff);
    }
    return true;
  }, []);

  useEffect(() => {
    spectrumBufferRef.current = new Float32Array(settings.fftSize);
    liveSpectrumBuffersRef.current = createSpectrumBuffers(settings.fftSize);
    liveSpectrumBufferIndexRef.current = 0;
    if (spectrumRef.current) {
      spectrumRef.current.size = settings.fftSize;
    }
    resetLiveData();
  }, [resetLiveData, settings.fftSize]);

  const applyRadioSettings = useCallback(() => {
    const radio = radioRef.current;
    const demod = demodRef.current;
    if (!radio || !demod) {
      return;
    }
    const currentFrequency = frequencyRef.current;
    const currentSettings = settingsRef.current;
    const isPlaying = playingRef.current;

    const frequencyOffset =
      currentFrequency.tunedFrequencyHz - currentFrequency.centerFrequencyHz;
    const inLowBand = currentFrequency.tunedFrequencyHz < 28_800_000;
    const directSamplingMethod =
      inLowBand && currentSettings.lowFrequencyMethod === "directSampling"
        ? currentSettings.directSamplingChannel === "I"
          ? 1
          : 2
        : 0;
    const centerForDeviceHz =
      inLowBand && currentSettings.lowFrequencyMethod === "upconverter"
        ? currentFrequency.centerFrequencyHz + currentSettings.upconverterFrequencyHz
        : currentFrequency.centerFrequencyHz;
    const biasTeeEffective =
      inLowBand && currentSettings.lowFrequencyMethod === "upconverter"
        ? currentSettings.upconverterBiasTee
        : currentSettings.biasTEnabled;

    void radio.setSampleRate(currentSettings.sampleRate);

    if (!isPlaying) {
      demod.setSampleRate(currentSettings.sampleRate);
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
    demod.setVolume(currentSettings.volume);
    demod.setMode(currentFrequency.modeState);

    if (!isPlaying) {
      return;
    }

    clearPendingHardwareUpdate();
    const capturedRadio = radio;
    const capturedCenterHz = centerForDeviceHz;
    const capturedPpm = currentSettings.ppm;
    const capturedGain =
      currentSettings.manualGain && !currentSettings.gainControlDisabled
        ? currentSettings.gainDb
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
  }, [clearPendingHardwareUpdate]);

  const connectAndStart = useCallback(() => {
    if (busyRef.current || playingRef.current) {
      return;
    }
    const currentSettings = settingsRef.current;
    if (
      currentSettings.sampleRate >
        currentSettings.performanceProfile.fallbackSampleRate ||
      currentSettings.fftSize >
        currentSettings.performanceProfile.fallbackFftSize ||
      currentSettings.performanceTradeoff === "cpu"
    ) {
      stabilityFallbackAppliedRef.current = false;
    }
    const runtimeProfile = getReceiverRuntimeProfile({
      isConstrainedDevice: currentSettings.performanceProfile.isConstrainedDevice,
      sampleRate: currentSettings.sampleRate,
      fftSize: currentSettings.fftSize,
      performanceTradeoff: currentSettings.performanceTradeoff,
    });

    stopRequestedRef.current = false;
    setBusy(true);
    setError(null);

    const pipelineConfig = pipelineConfigRef.current;
    const needsPipelineRebuild =
      !!radioRef.current &&
      (!pipelineConfig ||
        pipelineConfig.performanceTradeoff !==
          currentSettings.performanceTradeoff ||
          pipelineConfig.wbfmDeemphasisUs !== currentSettings.wbfmDeemphasisUs);

    if (needsPipelineRebuild) {
      clearPendingHardwareUpdate();
      resetRadioInternals();
      setConnected(false);
      setStereoDetected(false);
      resetLiveData();
    }

    if (!radioRef.current) {
      const demod = new Demodulator({
        modeOptions: getDemodModeOptions(
          currentSettings.performanceTradeoff,
          currentSettings.wbfmDeemphasisUs,
        ),
      });
      const spectrum = new Spectrum(currentSettings.fftSize);
      const receiver = CompositeReceiver.of(spectrum, demod);
      const radio = new Radio(new RtlProvider(), receiver, {
        buffersPerSecond: runtimeProfile.radioBuffersPerSecond,
      });

      radio.addEventListener("radio", (event) => {
        const detail = (event as CustomEvent<RadioEventDetail>).detail;
        if (detail.type === "started") {
          setConnected(true);
          setPlaying(true);
          playingRef.current = true;
          setBusy(false);
          resetLiveData();
          applyRadioSettings();
        }
        if (detail.type === "stopped") {
          setPlaying(false);
          playingRef.current = false;
          setBusy(false);
          resetLiveData();
        }
        if (detail.type === "directSampling") {
          settingsRef.current.setGainControlDisabled(detail.active);
          if (detail.active) {
            settingsRef.current.setManualGain(false);
          }
        }
        if (detail.type === "error") {
          const disconnected = isUsbDisconnectError(detail.exception);
          const appliedFallback =
            !stopRequestedRef.current &&
            !stabilityFallbackAppliedRef.current &&
            !disconnected &&
            isTransferInterruptedError(detail.exception) &&
            applyPerformanceFallback();
          if (isNoDeviceSelectedError(detail.exception)) {
            setPlaying(false);
            playingRef.current = false;
            setBusy(false);
            resetLiveData();
            stopRequestedRef.current = false;
            return;
          }
          if (
            stopRequestedRef.current &&
            (isTransferInterruptedError(detail.exception) ||
              disconnected)
          ) {
            setPlaying(false);
            playingRef.current = false;
            setBusy(false);
            setError(null);
            resetLiveData();
            return;
          }
          // Clear radio so user can reconnect without page refresh
          clearPendingHardwareUpdate();
          resetRadioInternals();
          setError(
            appliedFallback
              ? "USB transfer failed. Lower-load settings were applied automatically. Press START to reconnect."
              : getRadioErrorMessage(detail.exception),
          );
          setPlaying(false);
          playingRef.current = false;
          setConnected(false);
          setBusy(false);
          setStereoDetected(false);
          resetLiveData();
          stopRequestedRef.current = false;
        }
      });

      demod.addEventListener("stereo-status", (event) => {
        setStereoDetected(Boolean((event as CustomEvent<boolean>).detail));
      });

      demodRef.current = demod;
      spectrumRef.current = spectrum;
      radioRef.current = radio;
      pipelineConfigRef.current = {
        performanceTradeoff: currentSettings.performanceTradeoff,
        wbfmDeemphasisUs: currentSettings.wbfmDeemphasisUs,
      };
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
    applyPerformanceFallback,
    applyRadioSettings,
    clearPendingHardwareUpdate,
    resetLiveData,
    resetRadioInternals,
  ]);

  const stopRadio = useCallback(() => {
    if (!radioRef.current) {
      return;
    }

    stopRequestedRef.current = true;
    setBusy(true);
    clearPendingHardwareUpdate();
    usbOperationChainRef.current = Promise.resolve();
    lastWrittenHwRef.current = null;
    void radioRef.current.stop().finally(() => {
      resetRadioInternals();
      setConnected(false);
      setPlaying(false);
      playingRef.current = false;
      setBusy(false);
      setStereoDetected(false);
      resetLiveData();
    });
  }, [clearPendingHardwareUpdate, resetLiveData, resetRadioInternals]);

  const disconnectRadio = useCallback(async () => {
    stopRequestedRef.current = true;
    setBusy(true);
    try {
      await radioRef.current?.stop();
    } catch {
      // Ignore stop errors while disconnecting.
    }

    clearPendingHardwareUpdate();
    usbOperationChainRef.current = Promise.resolve();
    lastWrittenHwRef.current = null;
    resetRadioInternals();
    setConnected(false);
    setPlaying(false);
    playingRef.current = false;
    setStereoDetected(false);
    setBusy(false);
    resetLiveData();
  }, [clearPendingHardwareUpdate, resetLiveData, resetRadioInternals]);

  useEffect(() => {
    applyRadioSettings();
  }, [
    applyRadioSettings,
    frequency.centerFrequencyHz,
    settings.biasTEnabled,
    settings.directSamplingChannel,
    settings.gainControlDisabled,
    settings.gainDb,
    settings.lowFrequencyMethod,
    settings.manualGain,
    frequency.modeState,
    settings.ppm,
    playing,
    settings.sampleRate,
    frequency.tunedFrequencyHz,
    settings.upconverterBiasTee,
    settings.upconverterFrequencyHz,
    settings.volume,
  ]);

  useEffect(() => {
    if (!playing) {
      return;
    }
    const runtimeProfile = getReceiverRuntimeProfile({
      isConstrainedDevice: settings.performanceProfile.isConstrainedDevice,
      sampleRate: settings.sampleRate,
      fftSize: settings.fftSize,
      performanceTradeoff: settings.performanceTradeoff,
    });
    const [minDb, maxDb] = settings.dbRange;

    const tick = () => {
      const spectrum = spectrumRef.current;
      if (!spectrum) {
        return;
      }

      const raw = spectrumBufferRef.current;
      spectrum.getSpectrum(raw);
      const nextBufferIndex = liveSpectrumBufferIndexRef.current === 0 ? 1 : 0;
      const nextSpectrumDb = liveSpectrumBuffersRef.current[nextBufferIndex];
      const half = Math.floor(raw.length / 2);
      let peak = minDb;

      for (let i = 0; i < raw.length; i += 1) {
        const shiftedIndex = i < half ? i + half : i - half;
        const value = raw[shiftedIndex];
        const clampedValue = clamp(
          Number.isFinite(value) ? value : minDb,
          minDb,
          maxDb,
        );
        nextSpectrumDb[i] = clampedValue;
        if (clampedValue > peak) {
          peak = clampedValue;
        }
      }

      liveSpectrumBufferIndexRef.current = nextBufferIndex;
      publishLiveData({
        spectrumDb: nextSpectrumDb,
        signalPeakDb: peak,
      });
    };

    const id = window.setInterval(tick, runtimeProfile.liveDataIntervalMs);
    return () => window.clearInterval(id);
  }, [
    playing,
    publishLiveData,
    settings.dbRange,
    settings.fftSize,
    settings.performanceProfile.isConstrainedDevice,
    settings.performanceTradeoff,
    settings.sampleRate,
  ]);

  useEffect(() => {
    return () => {
      const radio = radioRef.current;
      stopRequestedRef.current = true;
      clearPendingHardwareUpdate();
      resetRadioInternals();
      if (radio) {
        void radio.stop();
      }
    };
  }, [clearPendingHardwareUpdate, resetRadioInternals]);

  return {
    connected,
    playing,
    busy,
    error,
    setError,
    stereoDetected,
    subscribeLiveData,
    getLiveDataSnapshot,
    resetLiveData,
    connectAndStart,
    stopRadio,
    disconnectRadio,
  };
}
