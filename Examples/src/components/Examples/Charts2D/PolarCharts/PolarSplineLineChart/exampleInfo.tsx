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
                pageTitle: "JavaScript Polar Spline Line Chart | JavaScript Charts",
                metaDescription: null,
                markdownContent:
                    "## Polar Spline Line Chart – JavaScript\n\n### Overview\nThis example demonstrates rendering multiple polar spline and interpolated line series using SciChart.js in Vanilla JavaScript. It initializes `SciChartPolarSurface`, configures radial and angular `PolarNumericAxis`, and visualizes original, cubic-spline, and interpolated lines.\n\n### Technical Implementation\nThe chart is created asynchronously via `SciChartPolarSurface.create()`. Two `PolarNumericAxis` instances define the radial (0–6) and angular (0–π) axes. Three `PolarLineRenderableSeries` are configured with `XyDataSeries`, each using WebGL for optimal performance. Cubic smoothing is applied through `SplineRenderDataTransform` ([API Docs](https://www.scichart.com/documentation/js/current/typedoc/classes/splinerenderdatatransform.html)), while setting interpolateLine: true causes line segments to draw as arcs as it is linearly interpolating the polar values between points ([API Docs](https://www.scichart.com/documentation/js/v4/2d-charts/chart-types/polar-line-renderable-series/)).\n\n### Features and Capabilities\nReal-time animations use `WaveAnimation` with staggered delays. Users can pan, zoom, and reset axes via `PolarPanModifier`, `PolarMouseWheelZoomModifier`, and `PolarZoomExtentsModifier`. A legend with checkboxes (`PolarLegendModifier`) toggles series visibility.\n\n### Integration and Best Practices\nDisposal is handled by deleting the `sciChartSurface` when done. Axis options like `flippedCoordinates` and `innerRadius` showcase customizable polar layouts. Data transforms run on the GPU for smooth curves without blocking the UI.",
            },
            react: {
                subtitle:
                    "Creates a **React Polar Spline Line Chart** using SciChart.js, using either a Cubic spline, or polar interpolation",
                title: "React Polar Spline Line Chart",
                pageTitle: "React Polar Spline Line Chart | JavaScript Charts",
                metaDescription: null,
                markdownContent:
                    "## Polar Spline Line Chart – React\n\n### Overview\nThis React component uses `<SciChartReact />` to render a polar spline line chart with direct SciChart.js API calls. It showcases original, cubic-spline, and interpolated polar line series within a React application.\n\n### Technical Implementation\nThe `drawExample` function passed to `` asynchronously creates the `SciChartPolarSurface`, applies `appTheme`, and adds two `PolarNumericAxis` for radial and angular dimensions. Each `PolarLineRenderableSeries` uses `XyDataSeries`, with smoothing transforms:\n- **Cubic spline** via `SplineRenderDataTransform` ([API Docs](https://www.scichart.com/documentation/js/current/typedoc/classes/splinerenderdatatransform.html))\n- **interpolated** by setting interpolateLine: true which causes line segments to draw as arcs as it is linearly interpolating the polar values between points ([API Docs](https://www.scichart.com/documentation/js/v4/2d-charts/chart-types/polar-line-renderable-series/))\n\nAnimations utilize `WaveAnimation` for sequential startup effects.\n\n### Features and Capabilities\nInteractive modifiers (`PolarPanModifier`, `PolarMouseWheelZoomModifier`, `PolarZoomExtentsModifier`) enable smooth panning and zooming. A legend (`PolarLegendModifier`) with checkboxes allows dynamic series toggling. All rendering is GPU-accelerated via WebGL.\n\n### Integration and Best Practices\nLeverage `` for React lifecycle management. Ensure cleanup by deleting `sciChartSurface` on unmount. Use React’s async patterns for initialization and refer to the [SciChart React Guide](https://www.scichart.com/blog/react-charts-with-scichart-js/) for advanced integration techniques.",
            },
            angular: {
                subtitle:
                    "Creates a **Angular Polar Spline Line Chart** using SciChart.js, using either a Cubic spline, or polar interpolation",
                title: "Angular Polar Spline Line Chart",
                pageTitle: "Angular Polar Spline Line Chart | JavaScript Charts",
                metaDescription: null,
                markdownContent:
                    "## Polar Spline Line Chart – Angular\n\n### Overview\nThis Angular standalone component integrates SciChart.js to render a polar spline line chart, demonstrating original, cubic-spline, and interpolated PolarLineRenderableSeries.\n\n### Technical Implementation\nUsing `ScichartAngularComponent`, the `drawExample` function initializes `SciChartPolarSurface` with theming. Two `PolarNumericAxis` instances set up radial and angular axes. Three `PolarLineRenderableSeries` employ `XyDataSeries` for data binding. Smoothing transforms:\n- `SplineRenderDataTransform` for cubic interpolation ([API Docs](https://www.scichart.com/documentation/js/current/typedoc/classes/splinerenderdatatransform.html))\n- **interpolated** by setting interpolateLine: true causes line segments to draw as arcs as it is linearly interpolating the polar values between points ([API Docs](https://www.scichart.com/documentation/js/v4/2d-charts/chart-types/polar-line-renderable-series/))\n\nAnimations use `WaveAnimation` with delays for sequential drawing.\n\n### Features and Capabilities\nInteractive modifiers (`PolarPanModifier`, `PolarMouseWheelZoomModifier`, `PolarZoomExtentsModifier`) support panning and zooming within Angular. A `PolarLegendModifier` provides series visibility toggling.\n\n### Integration and Best Practices\nImplement async chart creation in `ngOnInit`, and provide a destructor to call `sciChartSurface.delete()` on component destroy. Follow Angular standalone component best practices as outlined in the [scichart-angular documentation](https://www.scichart.com/documentation/js/current/scichart-angular/).",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
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
        isNew: true,
    };
//// End of computer generated metadata

export default createExampleInfo(metaData);
