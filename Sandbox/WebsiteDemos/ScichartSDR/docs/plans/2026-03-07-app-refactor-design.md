# App.tsx Refactor Design

## Goal

Extract logic from the monolithic App.tsx (865 lines, 30+ state vars) into focused custom hooks to improve readability and testability without changing behavior.

## Approach: Custom Hooks Only

Three new hooks under `src/features/receiver/hooks/`. No new UI components.

## File Structure

```
src/features/receiver/hooks/
  useFrequency.ts         — frequency/mode/scheme state + reconciliation
  useReceiverSettings.ts  — volume, gain, ppm, sampleRate, FFT, deemphasis, biasT, etc.
  useRadio.ts             — radio lifecycle, hardware writes, spectrum polling, all refs
```

## Hook Responsibilities

### `useFrequency`
- **State:** `centerFrequencyHz`, `tunedFrequencyHz`, `mode`, `modeState`, `stepHz`, `displayScale`
- **Derived:** `scaleFactor`, `displayDecimals`, `bandwidthHz`, `leftBandHz`, `rightBandHz`, `tunedCenterPct`, `tunedWindowWidthPct`, `stereoEnabled`, `squelch`, `hasBandwidth`, `hasStereoControl`, `modeConfig`, `centerFrequencyDisplay`, `tunedFrequencyDisplay`
- **Actions:** `updateCenterFrequency`, `updateTunedFrequency`, `updateModeState`, `applyScheme`, `stepTune`, `applyPresetFrequency`

### `useReceiverSettings`
- **State:** `volume`, `gainDb`, `manualGain`, `gainControlDisabled`, `sampleRate`, `fftSize`, `ppm`, `wbfmDeemphasisUs`, `biasTEnabled`, `lowFrequencyMethod`, `directSamplingChannel`, `upconverterFrequencyHz`, `upconverterBiasTee`, `performanceTradeoff`, `dbRange`, `presets`, `presetsOpen`, `settingsOpen`, `currentPreset`
- **Actions:** setters for all of the above, `onSetSampleRate` (reconciles frequency + sets performanceTradeoff)
- **Side effects:** persists presets to localStorage

### `useRadio`
- **Inputs:** `frequency` (from useFrequency), `settings` (from useReceiverSettings)
- **State:** `connected`, `playing`, `busy`, `error`, `spectrumDb`, `signalPeakDb`, `stereoDetected`, `stationName`, `spectrumChartReady`, `waterfallChartReady`
- **Actions:** `connectAndStart`, `stopRadio`, `disconnectRadio`
- **Refs managed internally:** `radioRef`, `demodRef`, `rdsRef`, `spectrumRef`, `spectrumBufferRef`, `stopRequestedRef`, `prevCenterForDeviceHzRef`, `prevFrequencyOffsetRef`, `hardwareUpdateTimerRef`, `usbOperationChainRef`, `lastWrittenHwRef`
- **Side effects:** `applyRadioSettings` effect, spectrum polling interval, cleanup on unmount

## Resulting App.tsx

~80 lines: three hook calls + JSX passing values through to existing components.
No behavior changes — pure extraction.
