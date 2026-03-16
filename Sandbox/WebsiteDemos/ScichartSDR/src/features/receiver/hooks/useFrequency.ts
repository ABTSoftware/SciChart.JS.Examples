import { useCallback, useEffect, useMemo, useState } from "react";
import { getSchemes, modeParameters } from "@jtarrio/signals/demod/modes.js";
import { DEFAULT_FREQUENCY_HZ, DEFAULT_MODE } from "../constants";
import { createModeState } from "../modeHelpers";
import { clamp, reconcileFrequency, sideBandsForMode } from "../radioHelpers";
import type { DisplayScale, ModeState } from "../types";

const FREQ_STORAGE_KEY = "sdr-radio-freq-v2";

function isDisplayScale(value: unknown): value is DisplayScale {
  return value === "Hz" || value === "kHz" || value === "MHz";
}

function loadSavedFreq(): {
  centerHz: number;
  tunedHz: number;
  scheme: string;
  stepHz?: number;
  displayScale?: DisplayScale;
} | null {
  try {
    const raw = window.localStorage.getItem(FREQ_STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as {
      centerHz?: unknown;
      tunedHz?: unknown;
      scheme?: unknown;
      stepHz?: unknown;
      displayScale?: unknown;
    };
    if (typeof p.centerHz === "number" && typeof p.tunedHz === "number" && typeof p.scheme === "string") {
      return {
        centerHz: p.centerHz,
        tunedHz: p.tunedHz,
        scheme: p.scheme,
        stepHz:
          typeof p.stepHz === "number" && Number.isFinite(p.stepHz)
            ? Math.max(1, Math.round(p.stepHz))
            : undefined,
        displayScale: isDisplayScale(p.displayScale) ? p.displayScale : undefined,
      };
    }
  } catch { /* ignore */ }
  return null;
}

export function useFrequency(sampleRate: number) {
  const schemes = useMemo(() => getSchemes(), []);
  const initialMode = useMemo(() => {
    if (schemes.includes(DEFAULT_MODE)) return DEFAULT_MODE;
    return schemes[0] ?? DEFAULT_MODE;
  }, [schemes]);
  const [savedFrequency] = useState(() => loadSavedFreq());

  const [centerFrequencyHz, setCenterFrequencyHz] = useState(
    () => savedFrequency?.centerHz ?? DEFAULT_FREQUENCY_HZ,
  );
  const [tunedFrequencyHz, setTunedFrequencyHz] = useState(
    () => savedFrequency?.tunedHz ?? DEFAULT_FREQUENCY_HZ,
  );
  const [modeState, setModeState] = useState<ModeState>(() => {
    const s = savedFrequency?.scheme;
    return createModeState(s && schemes.includes(s) ? s : initialMode, schemes);
  });
  const [stepHz, setStepHz] = useState(savedFrequency?.stepHz ?? 1000);
  const [displayScale, setDisplayScale] = useState<DisplayScale>(
    savedFrequency?.displayScale ?? "MHz",
  );
  const [zoomLevel, setZoomLevel] = useState(1);
  const mode = modeState.scheme;

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

  const safeZoom = clamp(zoomLevel, 1, 4);
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

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        window.localStorage.setItem(FREQ_STORAGE_KEY, JSON.stringify({
          centerHz: centerFrequencyHz,
          tunedHz: tunedFrequencyHz,
          scheme: modeState.scheme,
          stepHz,
          displayScale,
        }));
      } catch { /* ignore */ }
    }, 150);

    return () => window.clearTimeout(id);
  }, [centerFrequencyHz, tunedFrequencyHz, modeState.scheme, stepHz, displayScale]);

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
    zoomLevel,
    setZoomLevel,
    updateCenterFrequency,
    updateTunedFrequency,
    updateModeState,
    applyScheme,
    stepTune,
  };
}
