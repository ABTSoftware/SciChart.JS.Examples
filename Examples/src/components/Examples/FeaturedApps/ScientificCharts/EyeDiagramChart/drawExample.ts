import {
    EAutoRange,
    ESubSurfacePositionCoordinateMode,
    FastLineRenderableSeries,
    HeatmapColorMap,
    I2DSubSurfaceOptions,
    NumberRange,
    NumericAxis,
    Rect,
    SciChartSubSurface,
    SciChartSurface,
    Thickness,
    UniformHeatmapDataSeries,
    UniformHeatmapRenderableSeries,
    XyDataSeries,
} from "scichart";
import { appTheme } from "../../../theme";

// ---------------------------------------------------------------------------
// Signal generation helpers
// ---------------------------------------------------------------------------

/** Box-Muller transform — returns a single standard-normal random value */
function gaussianRandom(): number {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * Generates a 400-sample MLT-3 waveform for a 2-UI window.
 *
 * MLT-3 cycles through voltage levels [+1, 0, -1, 0] — the signal advances to the
 * next level on each '1' bit and holds on each '0' bit. This produces three voltage
 * rails and two stacked eye openings when overlaid.
 *
 * Three crossings are placed at t=0, t=1UI, t=2UI to produce the standard
 * oscilloscope eye pattern (two openings per display window).
 *
 * @returns Float32Array of 400 voltage samples
 */
export function generateTrace(): Float32Array {
    const SAMPLES_PER_UI = 200;
    const TOTAL_SAMPLES = 400;
    const BASE_RISE_HALF = 35;      // raised-cosine half-width (~35% of 1 UI — real 100BASE-TX rise time)
    const JITTER_SIGMA = 4.0;       // samples (~2% of 1 UI)
    const NOISE_SIGMA = 0.010;      // volts — per-sample Gaussian noise
    const AMPLITUDE_SIGMA = 0.025;  // ±2.5% per-trace amplitude scaling
    const DC_OFFSET_SIGMA = 0.015;  // volts — per-trace DC offset
    const RISE_SIGMA = 2.8;         // samples — per-edge rise time variation

    // MLT-3 state machine: state index cycles 0→1→2→3→0, voltages [+1, 0, -1, 0]
    const STATE_V = [1.0, 0.0, -1.0, 0.0] as const;

    // Per-trace capture variations — real scope traces drift slightly in amplitude and DC level
    const amplitudeScale = 1.0 + gaussianRandom() * AMPLITUDE_SIGMA;
    const dcOffset = gaussianRandom() * DC_OFFSET_SIGMA;

    // Start at a random state, then generate 4 consecutive levels (pprev, prev, curr, next)
    // Each position: 50% chance to advance state (bit=1), 50% to hold (bit=0)
    let state = Math.floor(Math.random() * 4);
    const vLevels = Array.from({ length: 4 }, () => {
        if (Math.random() < 0.5) state = (state + 1) % 4;
        return STATE_V[state] * amplitudeScale + dcOffset;
    });
    const [vPPrev, vPrev, vCurr, vNext] = vLevels;

    const out = new Float32Array(TOTAL_SAMPLES);

    // Three crossing edges at t=0, t=1UI, t=2UI with independent per-edge jitter
    const edgeA = 0                  + Math.round(gaussianRandom() * JITTER_SIGMA);
    const edgeB = SAMPLES_PER_UI     + Math.round(gaussianRandom() * JITTER_SIGMA);
    const edgeC = 2 * SAMPLES_PER_UI + Math.round(gaussianRandom() * JITTER_SIGMA);

    // Independent rise time per edge — each crossing X-pattern gets its own slew, producing
    // realistic fuzz at the crossings instead of three identical curves stacked on top of each other
    const clampRise = (r: number) => Math.max(26, Math.min(44, r));
    const riseA = clampRise(Math.round(BASE_RISE_HALF + gaussianRandom() * RISE_SIGMA));
    const riseB = clampRise(Math.round(BASE_RISE_HALF + gaussianRandom() * RISE_SIGMA));
    const riseC = clampRise(Math.round(BASE_RISE_HALF + gaussianRandom() * RISE_SIGMA));

    const rc = (d: number, half: number) => 0.5 * (1 - Math.cos(Math.PI * (d + half) / (2 * half)));

    for (let i = 0; i < TOTAL_SAMPLES; i++) {
        const dA = i - edgeA, dB = i - edgeB, dC = i - edgeC;
        let v: number;
        if      (dA >= -riseA && dA < riseA) v = vPPrev + (vPrev - vPPrev) * rc(dA, riseA);
        else if (dB >= -riseB && dB < riseB) v = vPrev  + (vCurr - vPrev)  * rc(dB, riseB);
        else if (dC >= -riseC && dC < riseC) v = vCurr  + (vNext - vCurr)  * rc(dC, riseC);
        else if (i < edgeA) v = vPPrev;
        else if (i < edgeB) v = vPrev;
        else if (i < edgeC) v = vCurr;
        else                v = vNext;
        out[i] = v + gaussianRandom() * NOISE_SIGMA;
    }
    return out;
}

/**
 * Bins a trace into a flat Float32Array accumulation grid.
 *
 * Grid layout: 400 columns × 200 rows, col-major → index = col * 200 + row
 *   - col maps to sample index (0..199) scaled to 0..399
 *   - row maps to voltage (−1.5..+1.5) scaled to 0..199
 */
export function binTrace(grid: Float32Array, trace: Float32Array): void {
    const COLS = 400;
    const ROWS = 200;
    const V_MIN = -1.5;
    const V_MAX = 1.5;
    const V_RANGE = V_MAX - V_MIN;

    for (let i = 0; i < trace.length; i++) {
        // Map sample index to column (0..COLS-1)
        const col = Math.round((i / (trace.length - 1)) * (COLS - 1));

        // Map voltage to row (0..ROWS-1); clamp to bounds
        const rowF = ((trace[i] - V_MIN) / V_RANGE) * (ROWS - 1);
        const row = Math.max(0, Math.min(ROWS - 1, Math.round(rowF)));

        grid[col * ROWS + row] += 1;
    }
}

// ---------------------------------------------------------------------------
// Main drawExample function
// ---------------------------------------------------------------------------

export async function drawExample(rootElement: string | HTMLDivElement) {
    // Single surface with two sub-charts avoids multi-surface init complexity
    const { sciChartSurface: mainSurface, wasmContext } = await SciChartSurface.createSingle(
        rootElement,
        { theme: appTheme.SciChartJsTheme }
    );

    // Main surface axes (required by SciChart even when hidden)
    mainSurface.xAxes.add(new NumericAxis(wasmContext, { isVisible: false, id: "mainX" }));
    mainSurface.yAxes.add(new NumericAxis(wasmContext, { isVisible: false, id: "mainY" }));

    // ── Top sub-chart: live waveform (top 28%) ────────────────────────────────

    const lineSubOptions: I2DSubSurfaceOptions = {
        theme: appTheme.SciChartJsTheme,
        position: new Rect(0, 0, 1, 0.28),
        coordinateMode: ESubSurfacePositionCoordinateMode.Relative,
        padding: Thickness.fromNumber(2),
    };
    const lineSurface = SciChartSubSurface.createSubSurface(mainSurface, lineSubOptions);

    lineSurface.xAxes.add(new NumericAxis(wasmContext, {
        isVisible: false,
        visibleRange: new NumberRange(0, 2),
        autoRange: EAutoRange.Never,
    }));

    lineSurface.yAxes.add(new NumericAxis(wasmContext, {
        axisTitle: "Voltage (V)",
        axisTitleStyle: { fontSize: 11 },
        labelStyle: { fontSize: 10 },
        visibleRange: new NumberRange(-1.5, 1.5),
        autoRange: EAutoRange.Never,
        drawMajorGridLines: true,
        drawMinorGridLines: false,
    }));

    const TRACE_LEN = 400;
    const xTrace = Array.from({ length: TRACE_LEN }, (_, i) => (i / (TRACE_LEN - 1)) * 2);
    const yBuffer = new Array<number>(TRACE_LEN).fill(0);

    const lineDs = new XyDataSeries(wasmContext, { xValues: xTrace, yValues: yBuffer });
    lineSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: lineDs,
            stroke: "#00E5FF",
            strokeThickness: 1.5,
        })
    );

    // ── Bottom sub-chart: heatmap eye diagram (bottom 72%) ────────────────────

    const heatSubOptions: I2DSubSurfaceOptions = {
        theme: appTheme.SciChartJsTheme,
        position: new Rect(0, 0.28, 1, 0.72),
        coordinateMode: ESubSurfacePositionCoordinateMode.Relative,
        padding: Thickness.fromNumber(2),
    };
    const heatSurface = SciChartSubSurface.createSubSurface(mainSurface, heatSubOptions);

    heatSurface.xAxes.add(new NumericAxis(wasmContext, {
        axisTitle: "Time (UI)",
        axisTitleStyle: { fontSize: 11 },
        labelStyle: { fontSize: 10 },
        visibleRange: new NumberRange(0, 2),
        autoRange: EAutoRange.Never,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
    }));

    heatSurface.yAxes.add(new NumericAxis(wasmContext, {
        axisTitle: "Voltage (V)",
        axisTitleStyle: { fontSize: 11 },
        labelStyle: { fontSize: 10 },
        visibleRange: new NumberRange(-1.15, 1.15),
        autoRange: EAutoRange.Never,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
    }));

    const COLS = 400;
    const ROWS = 200;
    const grid = new Float32Array(COLS * ROWS);
    const zValuesLog: number[][] = Array.from({ length: ROWS }, () => new Array(COLS).fill(0));

    const heatDs = new UniformHeatmapDataSeries(wasmContext, {
        xStart: 0,
        xStep: 2 / (COLS - 1),
        yStart: -1.15,
        yStep: 2.3 / (ROWS - 1),
        zValues: zValuesLog,
    });

    heatSurface.renderableSeries.add(
        new UniformHeatmapRenderableSeries(wasmContext, {
            dataSeries: heatDs,
            useLinearTextureFiltering: true,
            colorMap: new HeatmapColorMap({
                minimum: 0,
                maximum: 8,
                gradientStops: [
                    { offset: 0,    color: "#000000" },
                    { offset: 0.15, color: "#0000FF" },
                    { offset: 0.4,  color: "#00FFFF" },
                    { offset: 0.6,  color: "#00FF00" },
                    { offset: 0.8,  color: "#FFFF00" },
                    { offset: 1,    color: "#FF0000" },
                ],
            }),
        })
    );

    // ── Stats overlay ─────────────────────────────────────────────────────────

    const container = typeof rootElement === "string"
        ? document.getElementById(rootElement)
        : rootElement;

    if (container) container.style.position = "relative";

    const statsDiv = document.createElement("div");
    statsDiv.style.cssText = [
        "position:absolute", "top:8px", "right:8px",
        "font-family:monospace", "font-size:12px", "color:#ffffff",
        "background:rgba(0,0,0,0.5)", "padding:4px 8px",
        "border-radius:4px", "pointer-events:none", "z-index:100",
    ].join(";");
    statsDiv.textContent = "FPS: -- | Traces/s: -- | Total: 0";

    if (container) container.appendChild(statsDiv);

    // ── Animation loop ────────────────────────────────────────────────────────

    let rafHandle: number | null = null;
    let totalTraces = 0;
    let frameCount = 0;
    let lastStatsTime = performance.now();
    const TRACES_PER_FRAME = 50;

    function animate() {
        let lastTrace: Float32Array | null = null;

        for (let t = 0; t < TRACES_PER_FRAME; t++) {
            const trace = generateTrace();
            binTrace(grid, trace);
            lastTrace = trace;
        }
        totalTraces += TRACES_PER_FRAME;

        // Replace line chart data with the last trace from this batch
        if (lastTrace) {
            for (let i = 0; i < TRACE_LEN; i++) {
                yBuffer[i] = lastTrace[i];
            }
            lineDs.clear();
            lineDs.appendRange(xTrace, yBuffer);
        }

        // Update heatmap
        for (let col = 0; col < COLS; col++) {
            for (let row = 0; row < ROWS; row++) {
                zValuesLog[row][col] = Math.log1p(grid[col * ROWS + row]);
            }
        }
        heatDs.setZValues(zValuesLog);

        frameCount++;
        if (frameCount % 30 === 0) {
            const now = performance.now();
            const elapsed = (now - lastStatsTime) / 1000;
            const fps = Math.round(30 / elapsed);
            const tracesPerSec = Math.round((30 * TRACES_PER_FRAME) / elapsed);
            lastStatsTime = now;
            statsDiv.textContent = `FPS: ${fps} | Traces/s: ${tracesPerSec} | Total: ${totalTraces.toLocaleString()}`;
        }

        rafHandle = requestAnimationFrame(animate);
    }

    function startAnimation() {
        if (rafHandle !== null) return;
        rafHandle = requestAnimationFrame(animate);
    }

    function stopAnimation() {
        if (rafHandle !== null) {
            cancelAnimationFrame(rafHandle);
            rafHandle = null;
        }
    }

    startAnimation();

    function cleanup() {
        stopAnimation();
        if (container) container.removeChild(statsDiv);
        mainSurface.delete();
    }

    return {
        sciChartSurface: mainSurface,
        controls: { startAnimation, stopAnimation, cleanup },
    };
}
