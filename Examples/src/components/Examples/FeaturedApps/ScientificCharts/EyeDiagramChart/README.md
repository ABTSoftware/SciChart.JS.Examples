## Real-time Eye Diagram (Persistence Display)

### Overview

An **eye diagram** is the standard oscilloscope tool for evaluating signal integrity in high-speed serial data links. It is produced by overlaying thousands of short waveform segments — each one a 2-UI (two bit-period) window sliced from a continuous data stream — on a single time axis. When many traces accumulate, the open central region (the "eye opening") becomes visible, along with the smearing caused by inter-symbol interference (ISI), timing jitter, and noise.

This demo simulates a **Non-Return-to-Zero (NRZ)** serial data signal entirely in the browser and renders the accumulating eye diagram as a **2D density heatmap** using `UniformHeatmapRenderableSeries`. The result is an oscilloscope-style **persistence display**: frequently-traversed regions glow white/yellow, while rarely-visited edges fade to blue.

### Technical Implementation

**Signal generation** — Each trace is built from three random bits (prev, curr, next) to capture edge transitions on both sides of the 2-UI window:

- Voltage levels: +1 V (high) and −1 V (low)
- **Raised-cosine transitions** spanning 20% of one UI for realistic edge shaping
- Per-transition **timing jitter** (Gaussian, σ ≈ 2.5% of UI) applied as a horizontal shift
- **Amplitude noise** (Gaussian, σ = 0.05 V) added to each sample

**Heatmap accumulation** — Each trace's 400 samples are binned into a **400 × 200 accumulation grid** (time × voltage). Grid counts are log-scaled (`log1p`) before being passed to `UniformHeatmapDataSeries.setZValues()` each frame. The log scale keeps early traces visible while the hot centre saturates gracefully.

**Colormap** — A custom `HeatmapColorMap` maps density to an oscilloscope palette: black → dark blue → cyan → yellow → white.

**Performance** — 50 traces (20,000 samples) are generated and binned per animation frame. The heatmap is updated via a single `setZValues()` call per frame — one GPU texture upload regardless of how many traces have accumulated. A stats overlay shows live FPS, traces/second, and total accumulated traces.

### Features

- Real-time NRZ eye diagram with ISI, jitter, and noise
- Oscilloscope persistence display aesthetic
- 50 traces × 60 FPS = ~3,000 traces/second accumulation
- Stats overlay: FPS, Traces/s, Total traces
- No controls — pure performance display
