import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "LogarithmicAxis3DChart",
        id: "chart3D_basic3DChartTypes_LogarithmicAxis3DChart",
        imagePath: "logarithmicAxis3DChart.jpg",
        description:
            "Demonstrates **LogarithmicAxis3D** on X and Y axes in a 3D Scatter Chart using SciChart.js. Eight simulated sensors record power spectral density (PSD) following different power-law slopes — straight lines on a log-log plot.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates **LogarithmicAxis3D** on X and Y axes in a 3D Scatter Chart using SciChart.js.",
                title: "JavaScript 3D Log-Log Scatter Chart",
                pageTitle: "JavaScript 3D Log-Log Scatter Chart | 3D JavaScript Charts | View Now",
                metaDescription:
                    "Create a JavaScript 3D Log-Log Scatter Chart using SciChart's high-performance WebGL chart library. Features LogarithmicAxis3D on X and Y axes. Get your free demo now.",
                markdownContent:
                    "## 3D Log-Log Scatter Chart in JavaScript\n\n### Overview\nThis example demonstrates the use of **LogarithmicAxis3D** on both X and Y axes of a 3D scatter chart built with SciChart.js. Eight simulated sensors record power spectral density (PSD) following different power-law slopes, which appear as straight lines on a log-log plot — a classic pattern in signal analysis.\n\n### Technical Implementation\nThe chart is initialized using `SciChart3DSurface.create()` with a WebAssembly context. `LogarithmicAxis3D` is applied to the X (Frequency) and Y (PSD) axes with base-10 logarithmic scaling, while the Z axis uses `NumericAxis3D` to represent the sensor index. Each sensor's data is generated using a power-law distribution with log-uniformly spaced frequencies from 1 Hz to 100,000 Hz, producing 200 scatter points per sensor via `XyzDataSeries3D` and `ScatterRenderableSeries3D` with colored `SpherePointMarker3D` markers.\n\n### Features and Capabilities\nThe chart provides full 3D interactivity through `MouseWheelZoomModifier3D`, `OrbitModifier3D`, and `ResetCamera3DModifier`. Each of the 8 sensor series is rendered in a distinct color gradient from blue to orange, making it easy to distinguish power-law slopes across sensors.\n\n### Integration and Best Practices\nResource cleanup is handled by calling `delete()` on the surface when it is no longer needed, following the [Memory Best Practices](https://www.scichart.com/documentation/js/v5/2d-charts/performance-tips/memory-best-practices/) guidelines. The `LogarithmicAxis3D` requires strictly positive visible range values — `NumberRange(1, 1e5)` for X and `NumberRange(1e-4, 1e5)` for Y.",
            },
            react: {
                subtitle:
                    "Demonstrates **LogarithmicAxis3D** on X and Y axes in a React 3D Scatter Chart using SciChart.js.",
                title: "React 3D Log-Log Scatter Chart",
                pageTitle: "React 3D Log-Log Scatter Chart | 3D JavaScript Charts | View Now",
                metaDescription:
                    "Create a React 3D Log-Log Scatter Chart using SciChart's high-performance WebGL chart library. Features LogarithmicAxis3D on X and Y axes. Get your free demo now.",
                markdownContent:
                    "## React 3D Log-Log Scatter Chart\n\n### Overview\nThis example demonstrates how to use **LogarithmicAxis3D** in a React 3D scatter chart powered by SciChart.js. The `<SciChartReact/>` component handles the chart lifecycle, while the `drawExample` function configures logarithmic scaling on both X and Y axes to visualize power spectral density data across 8 sensors.\n\n### Technical Implementation\nThe `SciChartReact` component from `scichart-react` accepts the `drawExample` function as the `initChart` prop, managing WebAssembly initialization and cleanup automatically. `LogarithmicAxis3D` with `logBase: 10` is applied to the frequency (X) and PSD (Y) axes. Each sensor series uses `XyzDataSeries3D` populated with log-uniformly distributed frequency points and corresponding power-law PSD values.\n\n### Features and Capabilities\nFull 3D navigation is enabled via `MouseWheelZoomModifier3D`, `OrbitModifier3D`, and `ResetCamera3DModifier`. Eight `ScatterRenderableSeries3D` instances with colored `SpherePointMarker3D` markers represent distinct sensor channels with steepening power-law slopes.\n\n### Integration and Best Practices\nThe `SciChartReact` component handles resource disposal automatically. See [React Charts with SciChart.js](https://www.scichart.com/blog/react-charts-with-scichart-js/) for details on lifecycle management. The logarithmic visible range must contain only positive values — avoid ranges that include zero or negative numbers.",
            },
            angular: {
                subtitle:
                    "Demonstrates **LogarithmicAxis3D** on X and Y axes in an Angular 3D Scatter Chart using SciChart.js.",
                title: "Angular 3D Log-Log Scatter Chart",
                pageTitle: "Angular 3D Log-Log Scatter Chart | 3D JavaScript Charts | View Now",
                metaDescription:
                    "Create an Angular 3D Log-Log Scatter Chart using SciChart's high-performance WebGL chart library. Features LogarithmicAxis3D on X and Y axes. Get your free demo now.",
                markdownContent:
                    "## Angular 3D Log-Log Scatter Chart\n\n### Overview\nThis example shows how to integrate **LogarithmicAxis3D** within an Angular standalone component using SciChart.js. The `scichart-angular` package provides the `ScichartAngularComponent` wrapper that handles WebAssembly initialization and disposal.\n\n### Technical Implementation\nThe Angular component binds the `drawExample` function to the `[initChart]` input of `ScichartAngularComponent`. The chart uses `LogarithmicAxis3D` (base 10) on both X (Frequency, 1–100k Hz) and Y (PSD, 1e-4–1e5 V²/Hz) axes, with `NumericAxis3D` on Z for the sensor index. Data is generated client-side using power-law distributions.\n\n### Features and Capabilities\nInteractive 3D navigation is provided by `OrbitModifier3D`, `MouseWheelZoomModifier3D`, and `ResetCamera3DModifier`. Eight sensor series are each assigned a unique color and rendered as sphere point markers.\n\n### Integration and Best Practices\nFollows Angular standalone component patterns. For more details see the [scichart-angular npm package](https://www.npmjs.com/package/scichart-angular) and [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/).",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/v5/3d-charts/axis-3d-api/logarithmic-axis-3d/",
                title: "SciChart.js LogarithmicAxis3D Documentation",
                linkTitle: "JavaScript 3D Logarithmic Axis Documentation",
            },
        ],
        path: "3d-log-log-scatter-chart",
        metaKeywords: "3d, logarithmic, log, axis, scatter, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts3D/Basic3DChartTypes/LogarithmicAxis3DChart",
        thumbnailImage: "logarithmicAxis3DChart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true,
    };
//// End of computer generated metadata

export const logarithmicAxis3DChartExampleInfo = createExampleInfo(metaData);
export default logarithmicAxis3DChartExampleInfo;
