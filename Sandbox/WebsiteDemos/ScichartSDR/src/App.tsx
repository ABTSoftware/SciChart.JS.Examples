import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Box, Paper, Slider, Typography } from "@mui/material";
import { modeParameters } from "@jtarrio/signals/demod/modes.js";
import { OfflineNotice } from "./components/OfflineNotice";
import { LiveSpectrumChart } from "./components/LiveSpectrumChart";
import { LiveWaterfallChart } from "./components/LiveWaterfallChart";
import { ReceiverControls } from "./components/ReceiverControls";
import {
  DB_CEILING_LIMIT,
  DB_FLOOR_LIMIT,
  FFT_SIZES,
  HIGH_SAMPLE_RATE_THRESHOLD,
  SAMPLE_RATES,
} from "./features/receiver/constants";
import { useFrequency } from "./features/receiver/hooks/useFrequency";
import { getReceiverRuntimeProfile } from "./features/receiver/performanceProfile";
import { useReceiverSettings } from "./features/receiver/hooks/useReceiverSettings";
import { useRadio } from "./features/receiver/hooks/useRadio";
import { usePinchZoom } from "./features/receiver/hooks/usePinchZoom";
import { createModeState } from "./features/receiver/modeHelpers";
import { reconcileFrequency } from "./features/receiver/radioHelpers";
import type { ModeState } from "./features/receiver/types";
import "./App.css";

function App() {
  const settings = useReceiverSettings();
  const frequency = useFrequency(settings.sampleRate);
  const radio = useRadio({ frequency, settings });
  const runtimeProfile = useMemo(
    () =>
      getReceiverRuntimeProfile({
        isConstrainedDevice: settings.performanceProfile.isConstrainedDevice,
        sampleRate: settings.sampleRate,
        fftSize: settings.fftSize,
        performanceTradeoff: settings.performanceTradeoff,
      }),
    [
      settings.fftSize,
      settings.performanceProfile.isConstrainedDevice,
      settings.performanceTradeoff,
      settings.sampleRate,
    ],
  );

  const [controlsVisible, setControlsVisible] = useState(true);
  const chartsContainerRef = useRef<HTMLDivElement | null>(null);
  const windowDragStartXRef = useRef(0);
  const windowDragStartFreqRef = useRef(0);

  const { setZoomLevel } = frequency;
  useEffect(() => {
    const container = chartsContainerRef.current;
    if (!container) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 1.15 : 0.87;
      setZoomLevel((prev) => Math.min(4, Math.max(1, prev * factor)));
    };
    container.addEventListener("wheel", handler, { passive: false });
    return () => container.removeEventListener("wheel", handler);
  }, [setZoomLevel]);
  usePinchZoom(chartsContainerRef, setZoomLevel);

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
          <LiveSpectrumChart
            liveDataSource={radio}
            frequencyHz={frequency.centerFrequencyHz}
            sampleRate={settings.sampleRate}
            zoomLevel={frequency.zoomLevel}
            fftSize={settings.fftSize}
            minDb={settings.dbRange[0]}
            maxDb={settings.dbRange[1]}
            onTune={frequency.updateTunedFrequency}
            onError={radio.setError}
          />
          <Box className="waterfall-layer">
            <LiveWaterfallChart
              liveDataSource={radio}
              frequencyHz={frequency.centerFrequencyHz}
              sampleRate={settings.sampleRate}
              zoomLevel={frequency.zoomLevel}
              fftSize={settings.fftSize}
              rows={runtimeProfile.waterfallRows}
              decimation={runtimeProfile.waterfallDecimation}
              minDb={settings.dbRange[0]}
              maxDb={settings.dbRange[1]}
              onTune={frequency.updateTunedFrequency}
              onError={radio.setError}
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

        <button
          type="button"
          className="controls-toggle-btn"
          onClick={() => setControlsVisible((v) => !v)}
          aria-label={controlsVisible ? "Hide controls" : "Show controls"}
        >
          {controlsVisible ? "▾" : "▴"}
        </button>

        <div className={controlsVisible ? "controls-panel" : "controls-panel controls-panel--hidden"}>
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
          hasSquelchControl={frequency.modeConfig.hasSquelch()}
          squelch={frequency.squelch}
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
          minDb={settings.dbRange[0]}
          maxDb={settings.dbRange[1]}
          zoomLevel={frequency.zoomLevel}
          liveDataSource={radio}
          onStartStop={() =>
            void (radio.playing ? radio.stopRadio() : radio.connectAndStart())
          }
          onOpenPresets={() => settings.setPresetsOpen(true)}
          onClosePresets={() => settings.setPresetsOpen(false)}
          onOpenSettings={() => settings.setSettingsOpen(true)}
          onCloseSettings={() => settings.setSettingsOpen(false)}
          onSetCenterFrequency={(nextCenterHz) => {
            const safeCenter = Math.max(100_000, Math.round(nextCenterHz));
            const half = settings.sampleRate / 2;
            const minTuned = safeCenter - half + frequency.leftBandHz;
            const maxTuned = safeCenter + half - frequency.rightBandHz;
            frequency.setCenterFrequencyHz(safeCenter);
            if (frequency.tunedFrequencyHz < minTuned || frequency.tunedFrequencyHz > maxTuned) {
              frequency.setTunedFrequencyHz(safeCenter);
            }
          }}
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
          onSetSquelch={(value) => {
            frequency.updateModeState((config) => {
              if (config.hasSquelch()) {
                config.setSquelch(value);
              }
            });
          }}
          onSetGain={settings.setGainDb}
          onToggleAutoGain={(autoGain) => settings.setManualGain(!autoGain)}
          onSetVolume={settings.setVolume}
          onSetZoom={frequency.setZoomLevel}
          onSetFftSize={(value) => {
            settings.setFftSize(value);
            radio.resetLiveData();
          }}
          onSetWbfmDeemphasisUs={settings.setWbfmDeemphasisUs}
          onSetBiasTEnabled={settings.setBiasTEnabled}
          onSetLowFrequencyMethod={settings.setLowFrequencyMethod}
          onSetDirectSamplingChannel={settings.setDirectSamplingChannel}
          onSetUpconverterFrequencyHz={settings.setUpconverterFrequencyHz}
          onSetUpconverterBiasTee={settings.setUpconverterBiasTee}
          onSetPerformanceTradeoff={settings.setPerformanceTradeoff}
          onApplyPreset={(preset) => {
            const numericScaleToDisplay = (s: number) =>
              s === 1_000_000 ? "MHz" : s === 1_000 ? "kHz" : "Hz";
            const nextScheme = frequency.schemes.includes(preset.scheme)
              ? preset.scheme
              : frequency.modeState.scheme;
            const cfg = modeParameters(
              createModeState(nextScheme, frequency.schemes),
            );

            frequency.setDisplayScale(numericScaleToDisplay(preset.scale));
            frequency.setStepHz(preset.tuningStep);
            settings.setManualGain(preset.gain !== null);
            if (preset.gain !== null) {
              settings.setGainDb(preset.gain);
            }
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
            frequency.setCenterFrequencyHz(
              Math.max(100_000, Math.round(preset.tunedFrequency)),
            );
            frequency.setTunedFrequencyHz(
              Math.max(100_000, Math.round(preset.tunedFrequency)),
            );
          }}
          onPresetsChange={settings.setPresets}
          onSetSampleRate={(nextSampleRate) => {
            settings.setSampleRate(nextSampleRate);
            settings.setPerformanceTradeoff(
              settings.performanceProfile.isConstrainedDevice ||
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
        </div>
      </Paper>
      <OfflineNotice />
    </Box>
  );
}

export default App;
