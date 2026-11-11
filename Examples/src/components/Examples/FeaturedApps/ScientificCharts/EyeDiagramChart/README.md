## Real-time Eye Diagram (Persistence Display)

### Overview

An **eye diagram** is the standard oscilloscope tool for evaluating signal integrity in high-speed serial data links. It is produced by overlaying thousands of short waveform segments — each one a 2-UI (two bit-period) window sliced from a continuous data stream — on a single time axis. When many traces accumulate, the open central regions (the "eye openings") become visible, along with the smearing caused by inter-symbol interference (ISI), timing jitter, and noise.

This demo simulates an **MLT-3 (Multi-Level Transmit 3)** serial data signal — the line code used in 100BASE-TX Ethernet — entirely in the browser and renders two panels in a single SciChart surface:

- **Top panel** — a live `FastLineRenderableSeries` waveform showing the most recently generated trace
- **Bottom panel** — the accumulating `UniformHeatmapRenderableSeries` eye diagram, with an oscilloscope-style persistence display (red/yellow = frequently traversed, blue = rarely visited)

MLT-3 cycles through three voltage levels (+1 V, 0 V, −1 V) via a four-state machine, producing **two stacked eye openings** per display window.

### Technical Implementation

**Two-panel layout** — Both panels live inside a single `SciChartSurface.createSingle` surface. Sub-charts are created with `SciChartSubSurface.createSubSurface`, positioned using `Rect` with `ESubSurfacePositionCoordinateMode.Relative`: the line chart occupies the top 28% (`Rect(0, 0, 1, 0.28)`) and the heatmap the bottom 72% (`Rect(0, 0.28, 1, 0.72)`). All axes, series, and data objects share the single `wasmContext` returned by `createSingle`.

**Signal generation** — Each trace is built from a random MLT-3 state sequence (pprev, prev, curr, next) to capture both transitions in the 2-UI window:

- Voltage levels: +1 V, 0 V, −1 V (four states: [+1, 0, −1, 0])
- Per-trace **amplitude scaling** (σ = 2.5%) and **DC offset** (σ = 15 mV) for realistic trace-to-trace variation
- **Raised-cosine transitions** spanning ~35% of one UI — matching real 100BASE-TX rise time
- Independent per-edge **rise time variation** (σ = 2.8 samples) for realistic fuzz at crossings
- Three crossing edges at t = 0, t = 1 UI, t = 2 UI with independent per-edge **timing jitter** (Gaussian, σ = 4.0 samples ≈ 2% of UI)
- **Amplitude noise** (Gaussian, σ = 0.010 V) added to each sample

**Heatmap accumulation** — Each trace's 400 samples are binned into a **400 × 200 accumulation grid** (time × voltage). Grid counts are log-scaled (`log1p`) before being passed to `UniformHeatmapDataSeries.setZValues()` each frame. The log scale keeps early traces visible while the hot centre saturates gracefully.

**Colormap** — A custom `HeatmapColorMap` maps density to an oscilloscope thermal palette: black → dark blue → cyan → green → yellow → red.

**Performance** — 50 traces (20,000 samples) are generated and binned per animation frame. The heatmap is updated via a single `setZValues()` call per frame — one GPU texture upload regardless of how many traces have accumulated. A stats overlay shows live FPS, traces/second, and total accumulated traces.

### Features

- **Two-panel layout** using SciChart SubCharts API — live waveform on top, persistence heatmap on bottom
- Real-time MLT-3 eye diagram with two stacked eye openings, ISI, jitter, and noise
- Per-trace realism: amplitude variation, DC offset, independent per-edge rise time variation
- Oscilloscope thermal persistence display aesthetic (black → blue → cyan → yellow → red)
- 50 traces × 60 FPS = ~3,000 traces/second accumulation
- Stats overlay: FPS, Traces/s, Total traces
- No controls — pure performance display
