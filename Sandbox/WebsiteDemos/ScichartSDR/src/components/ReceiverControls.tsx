import { useEffect, useMemo, useRef, useState } from "react";
import {
  loadSortColumnFromStorage,
  saveSortColumnToStorage,
} from "../features/receiver/presetsStorage";
import { LiveSignalMeter } from "./LiveSignalMeter";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import type {
  DirectSamplingChannel,
  DisplayScale,
  LowFrequencyMethodName,
  PerformanceTradeoff,
  PresetSortColumn,
  RadioLiveDataSource,
  ReceiverPreset,
} from "../features/receiver/types";

type ReceiverControlsProps = {
  playing: boolean;
  busy: boolean;
  connected: boolean;
  error: string | null;
  presetsOpen: boolean;
  settingsOpen: boolean;
  centerFrequencyDisplay: number;
  tunedFrequencyDisplay: number;
  displayScale: DisplayScale;
  scaleFactor: number;
  mode: string;
  schemes: string[];
  hasStereoControl: boolean;
  stereoEnabled: boolean;
  hasSquelchControl: boolean;
  squelch: number;
  gainDb: number;
  manualGain: boolean;
  gainControlDisabled: boolean;
  volume: number;
  presets: ReceiverPreset[];
  currentPreset: ReceiverPreset;
  sampleRate: number;
  sampleRates: number[];
  ppm: number;
  fftSize: number;
  fftSizes: number[];
  wbfmDeemphasisUs: number;
  biasTEnabled: boolean;
  lowFrequencyMethod: LowFrequencyMethodName;
  directSamplingChannel: DirectSamplingChannel;
  upconverterFrequencyHz: number;
  upconverterBiasTee: boolean;
  performanceTradeoff: PerformanceTradeoff;
  keepScreenAwake: boolean;
  screenWakeLockSupported: boolean;
  screenWakeLockActive: boolean;
  minDb: number;
  maxDb: number;
  zoomLevel: number;
  liveDataSource: RadioLiveDataSource;
  onStartStop: () => void;
  onOpenPresets: () => void;
  onClosePresets: () => void;
  onOpenSettings: () => void;
  onCloseSettings: () => void;
  onSetCenterFrequency: (frequencyHz: number) => void;
  onSetTunedFrequency: (frequencyHz: number) => void;
  onSetDisplayScale: (scale: DisplayScale) => void;
  onApplyScheme: (scheme: string) => void;
  onToggleMono: (mono: boolean) => void;
  onSetSquelch: (squelch: number) => void;
  onSetGain: (gain: number) => void;
  onToggleAutoGain: (autoGain: boolean) => void;
  onSetVolume: (volume: number) => void;
  onApplyPreset: (preset: ReceiverPreset) => void;
  onPresetsChange: (presets: ReceiverPreset[]) => void;
  onSetSampleRate: (sampleRate: number) => void;
  onSetZoom: (zoom: number) => void;
  onSetPpm: (ppm: number) => void;
  onSetFftSize: (fftSize: number) => void;
  onSetWbfmDeemphasisUs: (value: number) => void;
  onSetBiasTEnabled: (enabled: boolean) => void;
  onSetLowFrequencyMethod: (method: LowFrequencyMethodName) => void;
  onSetDirectSamplingChannel: (channel: DirectSamplingChannel) => void;
  onSetUpconverterFrequencyHz: (value: number) => void;
  onSetUpconverterBiasTee: (enabled: boolean) => void;
  onSetPerformanceTradeoff: (value: PerformanceTradeoff) => void;
  onSetKeepScreenAwake: (enabled: boolean) => void;
  onDisconnect: () => void;
};

function humanFrequency(freq: number, scale: number): string {
  if (scale === 1_000) return `${freq / 1_000} kHz`;
  if (scale === 1_000_000) return `${freq / 1_000_000} MHz`;
  return `${freq} Hz`;
}

function arePresetsEqual(a: ReceiverPreset, b: ReceiverPreset): boolean {
  return (
    a.tunedFrequency === b.tunedFrequency &&
    a.scheme === b.scheme &&
    a.scale === b.scale &&
    a.tuningStep === b.tuningStep &&
    a.bandwidth === b.bandwidth &&
    a.stereo === b.stereo &&
    a.squelch === b.squelch &&
    a.gain === b.gain
  );
}

function getSortFormula(sortColumn: PresetSortColumn, presets: ReceiverPreset[]): (a: number, b: number) => number {
  let col = sortColumn;
  const desc = col.startsWith("-");
  if (desc) {
    col = col.slice(1) as PresetSortColumn;
  }

  let fn: (a: number, b: number) => number;
  if (col === "name") {
    fn = (a, b) => presets[a].name.localeCompare(presets[b].name);
  } else if (col === "mode") {
    fn = (a, b) => presets[a].scheme.localeCompare(presets[b].scheme);
  } else {
    fn = (a, b) => presets[a].tunedFrequency - presets[b].tunedFrequency;
  }

  return desc ? (a, b) => fn(b, a) : fn;
}

export function ReceiverControls({
  playing,
  busy,
  connected,
  error,
  presetsOpen,
  settingsOpen,
  centerFrequencyDisplay,
  tunedFrequencyDisplay,
  displayScale,
  scaleFactor,
  mode,
  schemes,
  hasStereoControl,
  stereoEnabled,
  hasSquelchControl,
  squelch,
  gainDb,
  manualGain,
  gainControlDisabled,
  volume,
  presets,
  currentPreset,
  sampleRate,
  sampleRates,
  ppm,
  fftSize,
  fftSizes,
  wbfmDeemphasisUs,
  biasTEnabled,
  lowFrequencyMethod,
  directSamplingChannel,
  upconverterFrequencyHz,
  upconverterBiasTee,
  performanceTradeoff,
  keepScreenAwake,
  screenWakeLockSupported,
  screenWakeLockActive,
  minDb,
  maxDb,
  zoomLevel,
  liveDataSource,
  onStartStop,
  onOpenPresets,
  onClosePresets,
  onOpenSettings,
  onCloseSettings,
  onSetCenterFrequency,
  onSetTunedFrequency,
  onSetDisplayScale,
  onApplyScheme,
  onToggleMono,
  onSetSquelch,
  onSetGain,
  onToggleAutoGain,
  onSetVolume,
  onSetZoom,
  onApplyPreset,
  onPresetsChange,
  onSetSampleRate,
  onSetPpm,
  onSetFftSize,
  onSetWbfmDeemphasisUs,
  onSetBiasTEnabled,
  onSetLowFrequencyMethod,
  onSetDirectSamplingChannel,
  onSetUpconverterFrequencyHz,
  onSetUpconverterBiasTee,
  onSetPerformanceTradeoff,
  onSetKeepScreenAwake,
  onDisconnect,
}: ReceiverControlsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const centerDraftRef = useRef<string | null>(null);
  const [centerDraft, setCenterDraft] = useState<string | null>(null);
  const tunedDraftRef = useRef<string | null>(null);
  const [tunedDraft, setTunedDraft] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<PresetSortColumn>(() => loadSortColumnFromStorage());
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    saveSortColumnToStorage(sortColumn);
  }, [sortColumn]);
  const activeIndex = useMemo(() => {
    const i = presets.findIndex((p) => arePresetsEqual(p, currentPreset));
    return i >= 0 ? i : undefined;
  }, [presets, currentPreset]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorIndex, setEditorIndex] = useState<number | undefined>(undefined);
  const [editorName, setEditorName] = useState("");

  const sortedIndices = useMemo(() => {
    const indices = [...presets.keys()];
    indices.sort(getSortFormula(sortColumn, presets));
    return indices;
  }, [presets, sortColumn]);

  const openNewPresetEditor = () => {
    setEditorIndex(undefined);
    setEditorName("");
    setEditorOpen(true);
  };

  const openEditPresetEditor = (index: number) => {
    setEditorIndex(index);
    setEditorName(presets[index].name);
    setEditorOpen(true);
  };

  const savePreset = () => {
    const name = editorName.trim();
    if (!name) return;
    const duplicate = presets.findIndex((p, idx) => p.name === name && idx !== editorIndex);
    if (duplicate >= 0) return;
    const duplicateSettings = presets.findIndex((p, idx) => arePresetsEqual(p, currentPreset) && idx !== editorIndex);
    if (duplicateSettings >= 0) return;

    const next = [...presets];
    if (editorIndex === undefined) {
      next.push({ ...currentPreset, name });
    } else {
      next[editorIndex] = { ...next[editorIndex], name };
    }
    onPresetsChange(next);
    setEditorOpen(false);
  };

  const replacePresetWithCurrent = () => {
    if (editorIndex === undefined) return;
    const next = [...presets];
    next[editorIndex] = { ...currentPreset, name: editorName.trim() || next[editorIndex].name };
    onPresetsChange(next);
    setEditorOpen(false);
  };

  return (
    <Box className="control-strip">
      <Stack className="control-main-row" direction="row" spacing={1}>
        <Button className="control-btn" variant="contained" onClick={onStartStop} disabled={busy}>
          {playing ? "STOP" : "START"}
        </Button>

        <Button className="control-btn" variant={presetsOpen ? "contained" : "outlined"} onClick={onOpenPresets}>
          PRESETS
        </Button>

        <Button className="control-btn" variant={settingsOpen ? "contained" : "outlined"} onClick={onOpenSettings}>
          SETTINGS
        </Button>

        <Button className="control-btn" variant="outlined" onClick={() => setHelpOpen(true)}>
          HELP
        </Button>

        <TextField className="receiver-input receiver-small-input" size="small" label={`Center (${displayScale})`}
          value={centerDraft ?? centerFrequencyDisplay}
          onFocus={() => { centerDraftRef.current = String(centerFrequencyDisplay); setCenterDraft(String(centerFrequencyDisplay)); }}
          onChange={(e) => { centerDraftRef.current = e.target.value; setCenterDraft(e.target.value); }}
          onBlur={() => {
            if (centerDraftRef.current !== null) {
              const value = Number(centerDraftRef.current);
              if (Number.isFinite(value)) onSetCenterFrequency(value * scaleFactor);
            }
            centerDraftRef.current = null;
            setCenterDraft(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            if (e.key === "Escape") { centerDraftRef.current = null; setCenterDraft(null); (e.target as HTMLInputElement).blur(); }
          }}
        />

        <TextField className="receiver-input receiver-small-input" size="small" label={`Tuned (${displayScale})`}
          value={tunedDraft ?? tunedFrequencyDisplay}
          onFocus={() => { tunedDraftRef.current = String(tunedFrequencyDisplay); setTunedDraft(String(tunedFrequencyDisplay)); }}
          onChange={(e) => { tunedDraftRef.current = e.target.value; setTunedDraft(e.target.value); }}
          onBlur={() => {
            if (tunedDraftRef.current !== null) {
              const value = Number(tunedDraftRef.current);
              if (Number.isFinite(value)) onSetTunedFrequency(value * scaleFactor);
            }
            tunedDraftRef.current = null;
            setTunedDraft(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            if (e.key === "Escape") { tunedDraftRef.current = null; setTunedDraft(null); (e.target as HTMLInputElement).blur(); }
          }}
        />

        <FormControl className="receiver-input receiver-scale-input" size="small">
          <InputLabel id="scale-label">Scale</InputLabel>
          <Select labelId="scale-label" label="Scale" value={displayScale} onChange={(e) => onSetDisplayScale(e.target.value as DisplayScale)} MenuProps={{ disableScrollLock: true }}>
            <MenuItem value="MHz">MHz</MenuItem>
            <MenuItem value="kHz">kHz</MenuItem>
            <MenuItem value="Hz">Hz</MenuItem>
          </Select>
        </FormControl>

        <FormControl className="receiver-input receiver-mode-input" size="small">
          <InputLabel id="mode-label">Mode</InputLabel>
          <Select labelId="mode-label" label="Mode" value={mode} onChange={(e) => onApplyScheme(String(e.target.value))} MenuProps={{ disableScrollLock: true }}>
            {schemes.map((schemeName) => <MenuItem key={schemeName} value={schemeName}>{schemeName}</MenuItem>)}
          </Select>
        </FormControl>

        {hasSquelchControl && (
          <Box className="slider-wrap">
            <Typography className="control-caption">Squelch</Typography>
            <Slider size="small" value={squelch} min={0} max={6} step={0.1} onPointerDown={(e) => e.stopPropagation()} onChange={(_, value) => onSetSquelch(value as number)} />
          </Box>
        )}

        <Box className="gain-group">
          <Box className="slider-wrap">
            <Typography className="control-caption">Gain</Typography>
            <Slider size="small" value={gainDb} min={0} max={50} step={1} disabled={!manualGain || gainControlDisabled} onPointerDown={(e) => e.stopPropagation()} onChange={(_, value) => onSetGain(value as number)} />
          </Box>
          <FormControlLabel className="control-check" control={<Checkbox size="small" checked={gainControlDisabled ? true : !manualGain} disabled={gainControlDisabled} onChange={(e) => onToggleAutoGain(e.target.checked)} />} label={gainControlDisabled ? "Auto gain (direct sampling)" : "Auto gain"} />
        </Box>

        <Box className="gain-group">
          <Box className="slider-wrap">
            <Typography className="control-caption">Volume</Typography>
            <Slider size="small" value={volume} min={0} max={1} step={0.01} onPointerDown={(e) => e.stopPropagation()} onChange={(_, value) => onSetVolume(value as number)} />
          </Box>
          <FormControlLabel className="control-check" control={<Checkbox size="small" checked={hasStereoControl ? !stereoEnabled : true} disabled={!hasStereoControl} onChange={(e) => onToggleMono(e.target.checked)} />} label="Mono" />
        </Box>

        <Box className="gain-group">
          <Box className="slider-wrap">
            <Typography className="control-caption">Zoom</Typography>
            <Slider size="small" value={zoomLevel} min={1} max={4} step={0.25} onPointerDown={(e) => e.stopPropagation()} onChange={(_, value) => onSetZoom(value as number)} />
          </Box>
        </Box>

        <Box className="gain-group">
          <LiveSignalMeter
            liveDataSource={liveDataSource}
            minDb={minDb}
            maxDb={maxDb}
          />
        </Box>
      </Stack>

      <Dialog open={presetsOpen} onClose={onClosePresets} maxWidth="md" fullWidth fullScreen={isMobile}>
        <DialogTitle className="settings-modal-title">
          {activeIndex === undefined ? "Presets" : `Current preset: ${presets[activeIndex]?.name ?? ""}`}
          <Box className="settings-modal-actions">
            <Button size="small" variant="contained" onClick={openNewPresetEditor}>Add</Button>
            <IconButton size="small" onClick={onClosePresets}>X</IconButton>
          </Box>
        </DialogTitle>
        <DialogContent className="settings-modal-content">
          <table className="preset-table">
            <thead>
              <tr>
                <th onClick={() => setSortColumn((c) => c === "name" ? "-name" : "name")}>Name</th>
                <th onClick={() => setSortColumn((c) => c === "frequency" ? "-frequency" : "frequency")}>Frequency</th>
                <th onClick={() => setSortColumn((c) => c === "mode" ? "-mode" : "mode")}>Mode</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedIndices.map((index) => (
                <tr key={index} className={activeIndex === index ? "active" : ""} onClick={() => { onApplyPreset(presets[index]); }}>
                  <td>{presets[index].name}</td>
                  <td>{humanFrequency(presets[index].tunedFrequency, presets[index].scale)}</td>
                  <td>{presets[index].scheme}</td>
                  <td>
                    <Button size="small" onClick={(e) => { e.stopPropagation(); openEditPresetEditor(index); }}>Edit</Button>
                    <Button size="small" color="error" onClick={(e) => { e.stopPropagation(); const next = [...presets]; next.splice(index, 1); onPresetsChange(next); }}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DialogContent>
      </Dialog>

      <Dialog open={editorOpen} onClose={() => setEditorOpen(false)} maxWidth="xs" fullWidth fullScreen={isMobile}>
        <DialogTitle className="settings-modal-title">
          {editorIndex === undefined ? "New Preset" : `Editing Preset "${presets[editorIndex]?.name ?? ""}"`}
          <IconButton size="small" onClick={() => setEditorOpen(false)}>X</IconButton>
        </DialogTitle>
        <DialogContent className="settings-modal-content">
          <Box className="settings-line">
            <Typography>Name:</Typography>
            <TextField size="small" value={editorName} onChange={(e) => setEditorName(e.target.value)} />
          </Box>
          <Box className="settings-line"><Typography>Frequency:</Typography><Typography>{humanFrequency(currentPreset.tunedFrequency, currentPreset.scale)}</Typography></Box>
          <Box className="settings-line"><Typography>Modulation:</Typography><Typography>{currentPreset.scheme}{currentPreset.stereo ? " Stereo" : " Mono"}, BW {currentPreset.bandwidth} Hz</Typography></Box>
          <Box className="settings-line"><Typography>Gain:</Typography><Typography>{currentPreset.gain === null ? "Auto" : currentPreset.gain}</Typography></Box>
          {editorIndex !== undefined ? (
            <Box className="settings-line">
              <Button size="small" variant="outlined" onClick={replacePresetWithCurrent}>Replace with current settings</Button>
            </Box>
          ) : null}
          <Box className="settings-line">
            <Button size="small" variant="contained" disabled={!editorName.trim()} onClick={savePreset}>Save</Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={settingsOpen} onClose={onCloseSettings} maxWidth="xs" fullWidth fullScreen={isMobile}>
        <DialogTitle className="settings-modal-title">
          Settings
          <IconButton size="small" onClick={onCloseSettings}>X</IconButton>
        </DialogTitle>
        <DialogContent className="settings-modal-content">
          <Box className="settings-line"><Typography>Sample rate:</Typography><Select size="small" MenuProps={{ disableScrollLock: true }} value={sampleRate} disabled={playing} onChange={(e) => onSetSampleRate(Number(e.target.value))}>{sampleRates.map((rate) => <MenuItem key={rate} value={rate}>{rate}</MenuItem>)}</Select></Box>
          <Box className="settings-line"><Typography>Clock correction:</Typography><TextField size="small" type="number" value={ppm} inputProps={{ min: -500, max: 500, step: 1 }} onChange={(e) => onSetPpm(Number(e.target.value || 0))} /><Typography>PPM</Typography></Box>
          <Box className="settings-line"><Typography>FFT size:</Typography><Select size="small" MenuProps={{ disableScrollLock: true }} value={fftSize} onChange={(e) => onSetFftSize(Number(e.target.value))}>{fftSizes.map((size) => <MenuItem key={size} value={size}>{size}</MenuItem>)}</Select></Box>
          <Box className="settings-line"><Typography>WBFM de-emphasis:</Typography><Select size="small" MenuProps={{ disableScrollLock: true }} value={wbfmDeemphasisUs} disabled={playing} onChange={(e) => onSetWbfmDeemphasisUs(Number(e.target.value))}><MenuItem value={50}>50μs — Europe</MenuItem><MenuItem value={75}>75μs — USA</MenuItem></Select></Box>
          <Box className="settings-line"><Typography>Bias T:</Typography><Checkbox checked={biasTEnabled} onChange={(e) => onSetBiasTEnabled(e.target.checked)} /></Box>
          <Box className="settings-line"><Typography>0–28.8 MHz method:</Typography><Select size="small" MenuProps={{ disableScrollLock: true }} value={lowFrequencyMethod} onChange={(e) => onSetLowFrequencyMethod(e.target.value as LowFrequencyMethodName)}><MenuItem value="default">Default method</MenuItem><MenuItem value="directSampling">Direct sampling</MenuItem><MenuItem value="upconverter">External upconverter</MenuItem></Select></Box>
          {lowFrequencyMethod === "directSampling" ? <Box className="settings-line"><Typography>Direct sampling channel:</Typography><Select size="small" MenuProps={{ disableScrollLock: true }} value={directSamplingChannel} onChange={(e) => onSetDirectSamplingChannel(e.target.value as DirectSamplingChannel)}><MenuItem value="Q">Q</MenuItem><MenuItem value="I">I</MenuItem></Select></Box> : null}
          {lowFrequencyMethod === "upconverter" ? <Box className="settings-line"><Typography>Upconverter frequency:</Typography><TextField size="small" type="number" value={upconverterFrequencyHz} inputProps={{ min: 1, max: 1_800_000_000, step: 1 }} onChange={(e) => onSetUpconverterFrequencyHz(Number(e.target.value || 0))} /></Box> : null}
          {lowFrequencyMethod === "upconverter" ? <Box className="settings-line"><Typography>Use bias T for upconverter:</Typography><Checkbox checked={upconverterBiasTee} onChange={(e) => onSetUpconverterBiasTee(e.target.checked)} /></Box> : null}
          <Box className="settings-line"><Typography>Performance trade-off:</Typography><Select size="small" MenuProps={{ disableScrollLock: true }} value={performanceTradeoff} disabled={playing} onChange={(e) => onSetPerformanceTradeoff(e.target.value as PerformanceTradeoff)}><MenuItem value="cpu">Use more CPU</MenuItem><MenuItem value="latency">Have more latency</MenuItem><MenuItem value="quality">Have worse quality</MenuItem></Select></Box>
          <Box className="settings-line"><Typography>Keep screen awake:</Typography><Checkbox checked={keepScreenAwake} onChange={(e) => onSetKeepScreenAwake(e.target.checked)} /></Box>
          <Typography variant="body2" color="text.secondary">
            {screenWakeLockSupported
              ? screenWakeLockActive
                ? "The screen will stay awake while audio is playing and this page remains visible."
                : "Helps on mobile by preventing auto-sleep while audio is playing."
              : "This browser does not expose screen wake lock, so playback may stop when the display sleeps."}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Browsers may still pause playback after you manually lock the screen or switch away from the page.
          </Typography>

          <Box className="settings-line"><Button className="control-btn" size="small" variant="outlined" onClick={onDisconnect} disabled={busy || !connected}>DISCONNECT USB</Button></Box>
        </DialogContent>
      </Dialog>

      <Dialog open={helpOpen} onClose={() => setHelpOpen(false)} maxWidth="sm" fullWidth fullScreen={isMobile}>
        <DialogTitle className="settings-modal-title">
          How to use SciChart SDR
          <IconButton size="small" onClick={() => setHelpOpen(false)}>X</IconButton>
        </DialogTitle>
        <DialogContent className="settings-modal-content">
          <Box className="help-section">
            <Typography className="help-heading">Getting started</Typography>
            <Typography className="help-text">Click <strong>START</strong> to connect your RTL-SDR dongle via USB. Your browser will prompt you to select the device, then the spectrum and waterfall will begin showing live RF data.</Typography>
            <Typography className="help-text">Use <strong>Settings → DISCONNECT USB</strong> to release the dongle without closing the page.</Typography>
            <Typography className="help-text">If a USB transfer fails on a slower machine, the app may apply lower-load settings automatically. Press <strong>START</strong> again to reconnect.</Typography>
          </Box>

          <Box className="help-section">
            <Typography className="help-heading">Mobile listening</Typography>
            <Typography className="help-text">Turn on <strong>Settings → Keep screen awake</strong> to reduce the chance of mobile playback stopping when the phone tries to sleep.</Typography>
            <Typography className="help-text">Browsers do not guarantee SDR playback after the screen is manually locked or the page is pushed into the background.</Typography>
          </Box>

          <Box className="help-section">
            <Typography className="help-heading">Tuning</Typography>
            <Typography className="help-text"><strong>Click</strong> anywhere on the spectrum or waterfall to tune to that frequency.</Typography>
            <Typography className="help-text"><strong>Drag</strong> the highlighted tuning window to shift the tuned frequency.</Typography>
            <Typography className="help-text"><strong>Center / Tuned</strong> fields: type a frequency and press Enter to jump directly.</Typography>
            <Typography className="help-text"><strong>Scale</strong>: switches frequency display between MHz, kHz, and Hz.</Typography>
          </Box>

          <Box className="help-section">
            <Typography className="help-heading">Zoom</Typography>
            <Typography className="help-text"><strong>Scroll wheel</strong> over the charts to zoom in/out.</Typography>
            <Typography className="help-text"><strong>Zoom slider</strong> in the controls panel does the same thing (1× = full bandwidth, 4× = quarter bandwidth).</Typography>
          </Box>

          <Box className="help-section">
            <Typography className="help-heading">Demodulation mode</Typography>
            <Typography className="help-text"><strong>WBFM</strong> — Wideband FM (commercial radio, 88–108 MHz). Enable stereo for stereo broadcasts.</Typography>
            <Typography className="help-text"><strong>NBFM</strong> — Narrowband FM (amateur radio, PMR446, marine). Typical bandwidth 12.5 kHz.</Typography>
            <Typography className="help-text"><strong>AM</strong> — Amplitude modulation (medium wave, shortwave, aircraft). Tune to carrier frequency.</Typography>
            <Typography className="help-text"><strong>USB / LSB</strong> — Single sideband (amateur HF, marine). Tune to the suppressed carrier frequency.</Typography>
            <Typography className="help-text"><strong>CW</strong> — Morse code (amateur HF). Tune offset ~600 Hz from the signal.</Typography>
          </Box>

          <Box className="help-section">
            <Typography className="help-heading">Gain &amp; signal</Typography>
            <Typography className="help-text"><strong>Auto gain</strong>: let the dongle choose optimal gain automatically (recommended to start).</Typography>
            <Typography className="help-text"><strong>Gain slider</strong>: manual RF gain in dB. Higher gain picks up weaker signals but may cause overloading on strong signals.</Typography>
            <Typography className="help-text"><strong>Sig meter</strong>: shows peak signal strength within the tuned bandwidth. Colors match the spectrum scale.</Typography>
          </Box>

          <Box className="help-section">
            <Typography className="help-heading">dB range bar</Typography>
            <Typography className="help-text">The bar at the bottom sets the colour scale for the waterfall and spectrum. Drag the left handle to set noise floor, right handle to set the ceiling. Narrowing the range increases contrast.</Typography>
          </Box>

          <Box className="help-section">
            <Typography className="help-heading">Presets</Typography>
            <Typography className="help-text">Save favourite stations with the <strong>PRESETS</strong> button. Each preset stores frequency, mode, bandwidth, gain, and stereo settings. Tap a preset to instantly switch to it.</Typography>
          </Box>

          <Box className="help-section">
            <Typography className="help-heading">Ham radio quick-start</Typography>
            <Typography className="help-text">• <strong>2m FM (145–146 MHz)</strong>: Mode = NBFM, BW = 12.5 kHz, squelch ~1–2.</Typography>
            <Typography className="help-text">• <strong>70cm FM (430–440 MHz)</strong>: same settings.</Typography>
            <Typography className="help-text">• <strong>HF SSB</strong>: requires upconverter or direct-sampling RTL-SDR. Set in Settings → Low frequency method.</Typography>
          </Box>
        </DialogContent>
      </Dialog>

      {error ? <Alert className="error-strip" severity="error">{error}</Alert> : null}
    </Box>
  );
}
