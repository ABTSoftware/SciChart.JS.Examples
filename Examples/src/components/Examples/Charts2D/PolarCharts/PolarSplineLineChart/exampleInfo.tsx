import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "PolarSplineLineChart",
        id: "chart2D_polarCharts_PolarSplineLineChart",
        imagePath: "javascript-polar-spline-line-chart.jpg",
        description:
            "Creates a **JavaScript Polar Spline Line Chart** using SciChart.js, using either a Cubic spline, or polar interpolation",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Polar Spline Line Chart** using SciChart.js, using either a Cubic spline, or polar interpolation",
                title: "JavaScript Polar Spline Line Chart",
                pageTitle: "JavaScript Polar Spline Line Chart",
                metaDescription:
                    "Try the JavaScript Polar Spline Line Chart example to see SciChart's GPU-accelerated rendering in action. Choose a cubic spline or polar interpolation. View demo.",
                markdownContent:
                    "## Polar Spline Line Chart – JavaScript\n\n### Overview\nCompare the original data with cubic-spline and polar-interpolated lines. Each series uses the same points, so you can see how the interpolation changes the path between them.\n\n### How it works\nThe chart uses `SciChartPolarSurface` with radial and angular axes. `SplineRenderDataTransform` smooths one line; setting `interpolateLine: true` draws another as arcs between polar points. See the [spline transform API](https://www.scichart.com/documentation/js/v6/typedoc/classes/splinerenderdatatransform.html) and [polar line series guide](https://www.scichart.com/documentation/js/v6/2d-charts/chart-types/polar-line-renderable-series/).\n\n### Interactions\n`WaveAnimation` reveals the lines in sequence. Drag to pan, scroll to zoom, and use the legend checkboxes to show or hide each series.\n\n### Lifecycle\nCall `sciChartSurface.delete()` when the chart is no longer needed to release its resources.",
            },
            react: {
                subtitle:
                    "Creates a **React Polar Spline Line Chart** using SciChart.js, using either a Cubic spline, or polar interpolation",
                title: "React Polar Spline Line Chart",
                pageTitle: "React Polar Spline Line Chart | View Demo | SciChart.js",
                metaDescription:
                    "Create a React Polar Spline Line Chart in SciChart.js with GPU-accelerated rendering and a choice of cubic spline or polar interpolation.",
                markdownContent:
                    "## Polar Spline Line Chart – React\n\n### Overview\nThis React example compares the original data with cubic-spline and polar-interpolated lines, showing how each method changes the path between the same points.\n\n### How it works\n`SciChartReact` mounts the chart through its `initChart` prop and the shared `drawExample` function. The chart uses `SciChartPolarSurface`; `SplineRenderDataTransform` smooths one series, while `interpolateLine: true` draws another as arcs. See the [spline transform API](https://www.scichart.com/documentation/js/v6/typedoc/classes/splinerenderdatatransform.html) and [polar line series guide](https://www.scichart.com/documentation/js/v6/2d-charts/chart-types/polar-line-renderable-series/).\n\n### Interactions\nStaggered `WaveAnimation` effects reveal the lines in sequence. Pan and zoom the chart, and use the legend checkboxes to toggle series visibility.\n\n### Lifecycle\n`SciChartReact` manages the returned chart surface through the component lifecycle. See the [SciChart React guide](https://www.scichart.com/blog/react-charts-with-scichart-js/) for integration details.",
            },
            angular: {
                subtitle:
                    "Creates a **Angular Polar Spline Line Chart** using SciChart.js, using either a Cubic spline, or polar interpolation",
                title: "Angular Polar Spline Line Chart",
                pageTitle: "Angular Polar Spline Line Chart",
                metaDescription:
                    "Try the Angular Polar Spline Line Chart example to see SciChart's GPU-accelerated rendering in action. Choose a cubic spline or polar interpolation. View demo.",
                markdownContent:
                    "## Polar Spline Line Chart – Angular\n\n### Overview\nThis Angular example compares the original data with cubic-spline and polar-interpolated lines, showing how each method changes the path between the same points.\n\n### How it works\n`ScichartAngularComponent` passes `drawExample` to the chart’s `initChart` input. The chart uses `SciChartPolarSurface`; `SplineRenderDataTransform` smooths one series, while `interpolateLine: true` draws another as arcs. See the [spline transform API](https://www.scichart.com/documentation/js/v6/typedoc/classes/splinerenderdatatransform.html) and [polar line series guide](https://www.scichart.com/documentation/js/v6/2d-charts/chart-types/polar-line-renderable-series/).\n\n### Interactions\nStaggered `WaveAnimation` effects reveal the lines in sequence. Pan and zoom the chart, and use the legend checkboxes to toggle series visibility.\n\n### Lifecycle\n`ScichartAngularComponent` hosts the chart and manages its lifecycle when the Angular component is destroyed.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/v6/2d-charts/chart-types/polar-line-renderable-series/",
                title: "This specific page in the JavaScript Polar Spline Line Chart documentation will help you to get started",
                linkTitle: "JavaScript Polar Spline Line Chart Documentation",
            },
        ],
        path: "polar-spline-line-chart",
        metaKeywords: "polar, band, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/PolarCharts/PolarSplineLineChart",
        thumbnailImage: "javascript-polar-spline-line-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: false,
    };
//// End of computer generated metadata

export default createExampleInfo(metaData);
