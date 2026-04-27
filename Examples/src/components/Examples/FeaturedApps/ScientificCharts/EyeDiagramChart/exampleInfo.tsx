import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "EyeDiagramChart",
        id: "featuredApps_scientificCharts_EyeDiagramChart",
        imagePath: "javascript-eye-diagram-chart.jpg",
        description:
            "Demonstrates a real-time **Eye Diagram** (persistence display) using SciChart.js heatmap rendering. Simulates an **MLT-3** signal (three voltage levels, used in 100BASE-TX Ethernet) — thousands of traces accumulate into a 2D density grid, producing the two-eye oscilloscope persistence pattern.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates a real-time **Eye Diagram** (persistence display) using SciChart.js heatmap rendering. Simulates an **MLT-3** signal (three voltage levels, used in 100BASE-TX Ethernet) — thousands of traces accumulate into a 2D density grid, producing two stacked eye openings with the classic oscilloscope glow.",
                title: "Real-time Eye Diagram Chart Example",
                pageTitle: "Real-time Eye Diagram (Persistence Display)",
                metaDescription:
                    "See a real-time Eye Diagram rendered with SciChart.js. Simulates an MLT-3 signal — thousands of waveform traces accumulate into a heatmap density grid — like a real oscilloscope persistence display.",
                markdownContent:
                    "## Real-time Eye Diagram - JavaScript\n\n### Overview\nThis example demonstrates a **real-time Eye Diagram** (persistence display) using SciChart.js in JavaScript. An eye diagram is the standard tool for evaluating signal integrity in high-speed serial data links — it is produced by overlaying thousands of short waveform segments on a shared time axis, revealing the eye opening, jitter, noise, and inter-symbol interference (ISI) of the signal. This demo simulates an **MLT-3 (Multi-Level Transmit 3)** signal, the line code used in 100BASE-TX Ethernet, which cycles through three voltage levels (+1 V, 0 V, −1 V) to produce **two stacked eye openings** per display window.\n\n### Technical Implementation\nThe layout uses [SciChartSurface.createSingle()](https://www.scichart.com/documentation/js/v5/2d-charts/surface/new-scichart-surface/#scichartsurfacecreatesingle) with two sub-charts created via `SciChartSubSurface.createSubSurface`. The top sub-chart (`Rect(0, 0, 1, 0.28)` relative) hosts a [FastLineRenderableSeries](https://www.scichart.com/documentation/js/v5/2d-charts/chart-types/line-chart/) showing the live waveform; the bottom sub-chart (`Rect(0, 0.28, 1, 0.72)`) hosts the [UniformHeatmapRenderableSeries](https://www.scichart.com/documentation/js/v5/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/) eye diagram. Both panels share a single `wasmContext`. Each animation frame, 50 simulated MLT-3 traces are generated with raised-cosine edge shaping (~35% of one UI), per-trace amplitude variation (σ = 2.5%) and DC offset (σ = 15 mV), independent per-edge timing jitter (σ = 4 samples ≈ 2% UI), and Gaussian amplitude noise (σ = 0.010 V). Trace samples are binned into a **400 × 200 accumulation grid** and passed to [UniformHeatmapDataSeries.setZValues()](https://www.scichart.com/documentation/js/v5/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/) each frame — a single WebGL texture upload regardless of how many traces have accumulated.\n\n### Features and Capabilities\nThe [UniformHeatmapRenderableSeries](https://www.scichart.com/documentation/js/v5/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/) renders the density grid with a custom [HeatmapColorMap](https://www.scichart.com/documentation/js/v5/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/) using an oscilloscope thermal palette (black → dark blue → cyan → green → yellow → red) that produces the classic scope persistence glow. A `log1p` scale keeps sparse edges visible while saturating the hot centre. Per-trace realism (amplitude scaling, DC offset, independent rise time variation) produces authentic oscilloscope fuzz at crossings and thick voltage rails. A live stats overlay shows FPS, traces/second, and total accumulated traces.\n\n### Integration and Best Practices\nThe implementation uses a `requestAnimationFrame` loop with a clean start/stop/cleanup API. Using `createSingle` with sub-charts instead of multiple `SciChartSurface.create` calls avoids WASM context conflicts and eliminates fragile DOM measurement for panel sizing. Resource cleanup (cancelling the rAF loop, removing the DOM overlay, calling `mainSurface.delete()`) is encapsulated in a single `cleanup()` function returned from `drawExample`, following the pattern used across all SciChart.js examples.",
            },
            react: {
                subtitle:
                    "Demonstrates a real-time **Eye Diagram** (persistence display) using SciChart.js heatmap rendering. Simulates an **MLT-3** signal (three voltage levels, used in 100BASE-TX Ethernet) — thousands of traces accumulate into a 2D density grid, producing two stacked eye openings with the classic oscilloscope glow.",
                title: "Real-time Eye Diagram Chart Example",
                pageTitle: "Real-time Eye Diagram (Persistence Display)",
                metaDescription:
                    "See a real-time Eye Diagram rendered with React and SciChart.js. Simulates an MLT-3 signal — thousands of waveform traces accumulate into a heatmap density grid — like a real oscilloscope persistence display.",
                markdownContent:
                    "## Real-time Eye Diagram - React\n\n### Overview\nThis React example demonstrates a **real-time Eye Diagram** (persistence display) built with SciChart.js. It simulates an **MLT-3 (Multi-Level Transmit 3)** serial data signal — the line code used in 100BASE-TX Ethernet — and renders two panels: a live waveform line chart on top and an accumulating 2D density heatmap on the bottom, producing the oscilloscope persistence glow that signal-integrity engineers use to evaluate jitter, noise, and eye opening. MLT-3's three voltage levels (+1 V, 0 V, −1 V) create **two stacked eye openings** visible once enough traces have accumulated.\n\n### Technical Implementation\nThe chart initialises via `<SciChartReact initChart={drawExample}>` where `drawExample` creates a single surface with `SciChartSurface.createSingle` and two sub-charts via `SciChartSubSurface.createSubSurface`. The top sub-chart (`Rect(0, 0, 1, 0.28)`, relative coordinates) hosts a [FastLineRenderableSeries](https://www.scichart.com/documentation/js/v5/2d-charts/chart-types/line-chart/) for the live waveform; the bottom sub-chart (`Rect(0, 0.28, 1, 0.72)`) hosts a [UniformHeatmapDataSeries](https://www.scichart.com/documentation/js/v5/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/) backed by a 400 × 200 accumulation grid. Each frame, 50 MLT-3 traces (raised-cosine transitions ~35% UI, per-trace amplitude variation σ = 2.5%, DC offset σ = 15 mV, timing jitter σ = 4 samples, amplitude noise σ = 0.010 V) are generated and binned. The heatmap is updated via `setZValues()` — one GPU upload per frame. The `onDelete` prop calls `controls.cleanup()` following [React cleanup patterns for SciChart.js](https://www.scichart.com/documentation/js/v5/get-started/tutorials-react/tutorial-01-setting-up-project-with-scichart-react/).\n\n### Features and Capabilities\nA custom [HeatmapColorMap](https://www.scichart.com/documentation/js/v5/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/) using an oscilloscope thermal palette (black → dark blue → cyan → green → yellow → red) with `log1p` density scaling produces the classic scope persistence glow. Per-trace realism (amplitude scaling, DC offset, independent per-edge rise time) adds authentic oscilloscope fuzz. A live overlay shows FPS, traces/second, and total accumulated traces.\n\n### Integration and Best Practices\nThe component is intentionally minimal — no React state is needed because the animation lifecycle is entirely managed by the `controls` object returned from `drawExample`. Using `createSingle` with sub-charts instead of multiple surfaces avoids WASM context conflicts and eliminates fragile DOM measurement for panel sizing. This pattern keeps the React wrapper decoupled from the SciChart initialisation logic and makes the same `drawExample` function reusable across React, Angular, and vanilla JavaScript targets.",
            },
            angular: {
                subtitle:
                    "Demonstrates a real-time **Eye Diagram** (persistence display) using SciChart.js heatmap rendering. Simulates an **MLT-3** signal (three voltage levels, used in 100BASE-TX Ethernet) — thousands of traces accumulate into a 2D density grid, producing two stacked eye openings with the classic oscilloscope glow.",
                title: "Real-time Eye Diagram Chart Example",
                pageTitle: "Real-time Eye Diagram (Persistence Display)",
                metaDescription:
                    "See a real-time Eye Diagram rendered with Angular and SciChart.js. Simulates an MLT-3 signal — thousands of waveform traces accumulate into a heatmap density grid — like a real oscilloscope persistence display.",
                markdownContent:
                    "## Real-time Eye Diagram - Angular\n\n### Overview\nThis Angular example demonstrates a **real-time Eye Diagram** (persistence display) using SciChart.js and the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package. It simulates an **MLT-3 (Multi-Level Transmit 3)** serial data signal — the line code used in 100BASE-TX Ethernet — and renders two panels: a live waveform line chart on top and an accumulating heatmap density display on the bottom, replicating the oscilloscope persistence effect used in signal-integrity analysis. MLT-3's four-state voltage machine (+1 V → 0 V → −1 V → 0 V) produces **two stacked eye openings** per display window.\n\n### Technical Implementation\nThe standalone Angular component uses `<scichart-angular [initChart]=\"initChart\">` to initialise the SciChart surface. The `drawExample` function creates a single surface with `SciChartSurface.createSingle` and two sub-charts via `SciChartSubSurface.createSubSurface`. The top sub-chart (`Rect(0, 0, 1, 0.28)`, relative coordinates) hosts a live [FastLineRenderableSeries](https://www.scichart.com/documentation/js/v5/2d-charts/chart-types/line-chart/) waveform; the bottom sub-chart (`Rect(0, 0.28, 1, 0.72)`) hosts a [UniformHeatmapDataSeries](https://www.scichart.com/documentation/js/v5/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/) backed by a 400 × 200 accumulation grid. Each animation frame, 50 MLT-3 traces (raised-cosine transitions ~35% UI, per-trace amplitude variation σ = 2.5%, DC offset σ = 15 mV, timing jitter σ = 4 samples, amplitude noise σ = 0.010 V) are generated and binned, then pushed to the GPU via `setZValues()`. The animation starts automatically — lifecycle cleanup is managed via the `(onDelete)` event binding.\n\n### Features and Capabilities\nA custom [HeatmapColorMap](https://www.scichart.com/documentation/js/v5/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/) with `log1p` density scaling maps the accumulation grid to an oscilloscope thermal palette (black → dark blue → cyan → green → yellow → red). Frequently-traversed regions glow red (the eye centre and voltage rails), while sparse edge crossings fade to blue. Per-trace realism (amplitude scaling, DC offset, independent rise time variation) adds authentic oscilloscope fuzz at crossings. A live stats overlay displays FPS, traces/second, and total accumulated traces.\n\n### Integration and Best Practices\nThe implementation follows Angular standalone component best practices. Using `createSingle` with sub-charts instead of multiple surfaces avoids WASM context conflicts and eliminates fragile DOM measurement for panel sizing. Resource cleanup (stopping the rAF loop, removing the DOM overlay, and calling `mainSurface.delete()`) is handled in a single `controls.cleanup()` call from the `(onDelete)` handler, preventing memory leaks when the component is destroyed.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/v5/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/",
                title: "Uniform Heatmap Chart Type documentation",
                linkTitle: "Uniform Heatmap Chart Documentation",
            },
        ],
        path: "eye-diagram-chart",
        metaKeywords: "eye diagram, persistence, oscilloscope, MLT-3, signal integrity, heatmap, real-time, performance, javascript, webgl",
        onWebsite: true,
        filepath: "FeaturedApps/ScientificCharts/EyeDiagramChart",
        thumbnailImage: "javascript-eye-diagram-chart.jpg",
        sandboxConfig: {
            infiniteLoopProtection: false,
            hardReloadOnChange: false,
            view: "browser",
        },
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true,
    };
//// End of computer generated metadata

export const eyeDiagramChartExampleInfo = createExampleInfo(metaData);
export default eyeDiagramChartExampleInfo;
