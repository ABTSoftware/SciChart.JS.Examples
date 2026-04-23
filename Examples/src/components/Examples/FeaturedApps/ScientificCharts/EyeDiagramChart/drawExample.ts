import {
    EAutoRange,
    HeatmapColorMap,
    NumberRange,
    NumericAxis,
    SciChartSurface,
    UniformHeatmapDataSeries,
    UniformHeatmapRenderableSeries,
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
    const TRANSITION_HALF = 20; // raised-cosine spans 40 samples (~10% of 1 UI)
    const JITTER_SIGMA = 4.0;   // samples (~2% of 1 UI)
    const NOISE_SIGMA = 0.012;  // volts — low for clean, distinct crossing bands

    // MLT-3 state machine: state index cycles 0→1→2→3→0, voltages [+1, 0, -1, 0]
    const STATE_V = [1.0, 0.0, -1.0, 0.0] as const;

    // Start at a random state, then generate 4 consecutive levels (pprev, prev, curr, next)
    // Each position: 50% chance to advance state (bit=1), 50% to hold (bit=0)
    let state = Math.floor(Math.random() * 4);
    const vLevels = Array.from({ length: 4 }, () => {
        if (Math.random() < 0.5) state = (state + 1) % 4;
        return STATE_V[state];
    });
    const [vPPrev, vPrev, vCurr, vNext] = vLevels;

    const out = new Float32Array(TOTAL_SAMPLES);

    // Three crossing edges at t=0, t=1UI, t=2UI with independent per-edge jitter
    const edgeA = 0                  + Math.round(gaussianRandom() * JITTER_SIGMA);
    const edgeB = SAMPLES_PER_UI     + Math.round(gaussianRandom() * JITTER_SIGMA);
    const edgeC = 2 * SAMPLES_PER_UI + Math.round(gaussianRandom() * JITTER_SIGMA);

    const rc = (d: number) => 0.5 * (1 - Math.cos(Math.PI * (d + TRANSITION_HALF) / (2 * TRANSITION_HALF)));

    for (let i = 0; i < TOTAL_SAMPLES; i++) {
        const dA = i - edgeA, dB = i - edgeB, dC = i - edgeC;
        let v: number;
        if      (dA >= -TRANSITION_HALF && dA < TRANSITION_HALF) v = vPPrev + (vPrev - vPPrev) * rc(dA);
        else if (dB >= -TRANSITION_HALF && dB < TRANSITION_HALF) v = vPrev  + (vCurr - vPrev)  * rc(dB);
        else if (dC >= -TRANSITION_HALF && dC < TRANSITION_HALF) v = vCurr  + (vNext - vCurr)  * rc(dC);
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
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // X Axis — time in UI units
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Time (UI)",
            axisTitleStyle: { fontSize: 11 },
            labelStyle: { fontSize: 10 },
            visibleRange: new NumberRange(0, 2),
            autoRange: EAutoRange.Never,
            drawMajorGridLines: false,
            drawMinorGridLines: false,
        })
    );

    // Y Axis — voltage
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Voltage (V)",
            axisTitleStyle: { fontSize: 11 },
            labelStyle: { fontSize: 10 },
            visibleRange: new NumberRange(-1.5, 1.5),
            autoRange: EAutoRange.Never,
            drawMajorGridLines: false,
            drawMinorGridLines: false,
        })
    );

    // Accumulation grid: 400 cols × 200 rows, col-major
    const COLS = 400;
    const ROWS = 200;
    const grid = new Float32Array(COLS * ROWS);

    // zValuesLog: 200 rows × 400 cols (row-major), for setZValues
    const zValuesLog: number[][] = Array.from({ length: ROWS }, () => new Array(COLS).fill(0));

    // Heatmap data series
    const dataSeries = new UniformHeatmapDataSeries(wasmContext, {
        xStart: 0,
        xStep: 2 / (COLS - 1),
        yStart: -1.5,
        yStep: 3 / (ROWS - 1),
        zValues: zValuesLog,
    });

    // Heatmap renderable series
    const renderableSeries = new UniformHeatmapRenderableSeries(wasmContext, {
        dataSeries,
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
    });

    sciChartSurface.renderableSeries.add(renderableSeries);

    // Stats overlay
    const statsDiv = document.createElement("div");
    statsDiv.style.cssText = [
        "position:absolute",
        "top:8px",
        "right:8px",
        "font-family:monospace",
        "font-size:12px",
        "color:#ffffff",
        "background:rgba(0,0,0,0.5)",
        "padding:4px 8px",
        "border-radius:4px",
        "pointer-events:none",
        "z-index:100",
    ].join(";");
    statsDiv.textContent = "FPS: -- | Traces/s: -- | Total: 0";

    const container = typeof rootElement === "string"
        ? document.getElementById(rootElement)
        : rootElement;
    if (container) {
        container.style.position = "relative";
        container.appendChild(statsDiv);
    }

    // Animation state
    let rafHandle: number | null = null;
    let totalTraces = 0;
    let frameCount = 0;
    let lastStatsTime = performance.now();
    const TRACES_PER_FRAME = 50;

    function animate() {
        const frameStart = performance.now();

        // Generate and bin 50 traces this frame
        for (let t = 0; t < TRACES_PER_FRAME; t++) {
            const trace = generateTrace();
            binTrace(grid, trace);
        }
        totalTraces += TRACES_PER_FRAME;

        // Update zValuesLog from grid (log1p scaling)
        for (let col = 0; col < COLS; col++) {
            for (let row = 0; row < ROWS; row++) {
                zValuesLog[row][col] = Math.log1p(grid[col * ROWS + row]);
            }
        }

        dataSeries.setZValues(zValuesLog);

        // Update stats every 30 frames
        frameCount++;
        if (frameCount % 30 === 0) {
            const now = performance.now();
            const elapsed = (now - lastStatsTime) / 1000; // seconds
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

    // Start automatically
    startAnimation();

    function cleanup() {
        stopAnimation();
        if (container) container.removeChild(statsDiv);
        sciChartSurface.delete();
    }

    return {
        sciChartSurface,
        controls: {
            startAnimation,
            stopAnimation,
            cleanup,
        },
    };
}
