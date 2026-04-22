import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "EyeDiagramChart",
        id: "featuredApps_scientificCharts_EyeDiagramChart",
        imagePath: "javascript-eye-diagram-chart.jpg",
        description:
            "Demonstrates a real-time **Eye Diagram** (persistence display) using SciChart.js heatmap rendering. Thousands of NRZ waveform traces accumulate per second into a 2D density grid, producing the iconic oscilloscope glow effect.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates a real-time **Eye Diagram** (persistence display) using SciChart.js heatmap rendering. Thousands of NRZ waveform traces accumulate per second into a 2D density grid, producing the iconic oscilloscope glow effect.",
                title: "Real-time Eye Diagram Chart Example",
                pageTitle: "Real-time Eye Diagram (Persistence Display)",
                metaDescription:
                    "See a real-time Eye Diagram rendered with SciChart.js. Thousands of NRZ waveform traces accumulate into a heatmap density grid — like a real oscilloscope persistence display.",
                markdownContent:
                    "## Real-time Eye Diagram - JavaScript\n\n### Overview\nThis example demonstrates a **real-time Eye Diagram** (persistence display) using SciChart.js in JavaScript. An eye diagram is the standard tool for evaluating signal integrity in high-speed serial data links — it is produced by overlaying thousands of short NRZ waveform segments on a shared time axis, revealing the eye opening, jitter, noise, and inter-symbol interference (ISI) of the signal.\n\n### Technical Implementation\nThe chart uses [SciChartSurface.create()](https://www.scichart.com/documentation/js/v5/2d-charts/surface/new-scichart-surface/#scichartsurfacecreate) to initialise the surface. Each animation frame, 50 simulated NRZ traces are generated with raised-cosine edge shaping, per-transition timing jitter, and Gaussian amplitude noise. Trace samples are binned into a **400 × 200 accumulation grid** and passed to [UniformHeatmapDataSeries.setZValues()](https://www.scichart.com/documentation/js/v5/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/) each frame — a single WebGL texture upload regardless of how many traces have accumulated.\n\n### Features and Capabilities\nThe [UniformHeatmapRenderableSeries](https://www.scichart.com/documentation/js/v5/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/) renders the density grid with a custom [HeatmapColorMap](https://www.scichart.com/documentation/js/v5/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/) (black → dark blue → cyan → yellow → white) that produces the classic oscilloscope persistence glow. A `log1p` scale keeps sparse edges visible while saturating the hot centre. A live stats overlay shows FPS, traces/second, and total accumulated traces.\n\n### Integration and Best Practices\nThe implementation uses a `requestAnimationFrame` loop with a clean start/stop/cleanup API. Resource cleanup (cancelling the rAF loop, removing the DOM overlay, calling `sciChartSurface.delete()`) is encapsulated in a single `cleanup()` function returned from `drawExample`, following the pattern used across all SciChart.js examples.",
            },
            react: {
                subtitle:
                    "Demonstrates a real-time **Eye Diagram** (persistence display) using SciChart.js heatmap rendering. Thousands of NRZ waveform traces accumulate per second into a 2D density grid, producing the iconic oscilloscope glow effect.",
                title: "Real-time Eye Diagram Chart Example",
                pageTitle: "Real-time Eye Diagram (Persistence Display)",
                metaDescription:
                    "See a real-time Eye Diagram rendered with React and SciChart.js. Thousands of NRZ waveform traces accumulate into a heatmap density grid — like a real oscilloscope persistence display.",
                markdownContent:
                    "## Real-time Eye Diagram - React\n\n### Overview\nThis React example demonstrates a **real-time Eye Diagram** (persistence display) built with SciChart.js. It simulates a high-speed NRZ serial data signal in the browser and renders the accumulating eye diagram as a 2D density heatmap — producing the iconic oscilloscope persistence glow that signal-integrity engineers use to evaluate jitter, noise, and eye opening.\n\n### Technical Implementation\nThe chart initialises via `<SciChartReact initChart={drawExample}>` where `drawExample` creates a [UniformHeatmapDataSeries](https://www.scichart.com/documentation/js/v5/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/) backed by a 400 × 200 accumulation grid. Each frame, 50 NRZ traces (with raised-cosine transitions, timing jitter, and amplitude noise) are generated and binned into the grid. The heatmap is updated via `setZValues()` — one GPU upload per frame. The `onDelete` prop calls `controls.cleanup()` which stops the animation loop and disposes the surface, following [React cleanup patterns for SciChart.js](https://www.scichart.com/documentation/js/v5/get-started/tutorials-react/tutorial-01-setting-up-project-with-scichart-react/).\n\n### Features and Capabilities\nA custom [HeatmapColorMap](https://www.scichart.com/documentation/js/v5/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/) (black → dark blue → cyan → yellow → white) with `log1p` density scaling produces the classic oscilloscope persistence palette. A live overlay shows FPS, traces/second, and total accumulated traces. The animation starts immediately on mount and cleans up automatically on unmount.\n\n### Integration and Best Practices\nThe component is intentionally minimal — no React state is needed because the animation lifecycle is entirely managed by the `controls` object returned from `drawExample`. This pattern keeps the React wrapper decoupled from the SciChart initialisation logic and makes the same `drawExample` function reusable across React, Angular, and vanilla JavaScript targets.",
            },
            angular: {
                subtitle:
                    "Demonstrates a real-time **Eye Diagram** (persistence display) using SciChart.js heatmap rendering. Thousands of NRZ waveform traces accumulate per second into a 2D density grid, producing the iconic oscilloscope glow effect.",
                title: "Real-time Eye Diagram Chart Example",
                pageTitle: "Real-time Eye Diagram (Persistence Display)",
                metaDescription:
                    "See a real-time Eye Diagram rendered with Angular and SciChart.js. Thousands of NRZ waveform traces accumulate into a heatmap density grid — like a real oscilloscope persistence display.",
                markdownContent:
                    "## Real-time Eye Diagram - Angular\n\n### Overview\nThis Angular example demonstrates a **real-time Eye Diagram** (persistence display) using SciChart.js and the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package. It simulates a high-speed NRZ serial data signal and renders thousands of accumulating waveform traces as a heatmap density display — replicating the oscilloscope persistence effect used in signal-integrity analysis.\n\n### Technical Implementation\nThe standalone Angular component uses `<scichart-angular [initChart]=\"initChart\">` to initialise the SciChart surface. The `drawExample` function creates a [UniformHeatmapDataSeries](https://www.scichart.com/documentation/js/v5/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/) backed by a 400 × 200 accumulation grid. Each animation frame, 50 NRZ traces (raised-cosine transitions, Gaussian jitter and noise) are generated and binned into the grid, then pushed to the GPU via `setZValues()`. Lifecycle is managed via `(onInit)` and `(onDelete)` event bindings, which start and clean up the animation loop.\n\n### Features and Capabilities\nA custom [HeatmapColorMap](https://www.scichart.com/documentation/js/v5/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/) with `log1p` density scaling maps the accumulation grid to a black → dark blue → cyan → yellow → white oscilloscope palette. Frequently-traversed regions glow white (the eye centre and bit rails), while sparse edge crossings fade to blue. A live stats overlay displays FPS, traces/second, and total accumulated traces.\n\n### Integration and Best Practices\nThe implementation follows Angular standalone component best practices. Resource cleanup (stopping the rAF loop, removing the DOM overlay, and calling `sciChartSurface.delete()`) is handled in a single `controls.cleanup()` call from the `(onDelete)` handler, preventing memory leaks when the component is destroyed.",
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
        metaKeywords: "eye diagram, persistence, oscilloscope, NRZ, signal, heatmap, real-time, performance, javascript, webgl",
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
