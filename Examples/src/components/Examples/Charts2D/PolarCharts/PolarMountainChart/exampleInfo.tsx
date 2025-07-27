import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "PolarMountainChart",
        id: "chart2D_polarCharts_PolarMountainChart",
        imagePath: "javascript-polar-mountain-chart.jpg",
        description:
            "Creates a **JavaScript Polar Mountain Chart** using SciChart.js, with both regular & interpolated mountain modes, via **PolarMountainRenderableSeries**",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Polar Mountain Chart** using SciChart.js, with both regular & interpolated mountain modes, via **PolarMountainRenderableSeries**",
                title: "JavaScript Polar Mountain Chart",
                pageTitle: "JavaScript Polar Mountain Chart | JavaScript Charts | SciChart.js, with both regular & interpolated mountain modes, via **PolarMountainRenderableSeries**",
                metaDescription: null,
                markdownContent: "## Polar Mountain Chart - JavaScript\n\n### Overview\nThis example demonstrates how to create a **Polar Mountain Chart** using SciChart.js in vanilla JavaScript. The implementation showcases three mountain series in polar coordinates with gradient fills and optional line interpolation, using the [PolarMountainRenderableSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarmountainrenderableseries.html) for radial data visualization.\n\n### Technical Implementation\nThe chart is initialized asynchronously using `SciChartPolarSurface.create()` with a custom theme. It features a radial Y-axis configured with [PolarNumericAxis](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarnumericaxis.html) in `EPolarAxisMode.Radial` mode and an angular X-axis in `EPolarAxisMode.Angular` mode. Each mountain series uses an [XyDataSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/xydataseries.html) with closed-loop data points and applies a gradient fill via [GradientParams](https://www.scichart.com/documentation/js/v4/typedoc/classes/gradientparams.html).\n\n### Features and Capabilities\nThe example highlights polar chart capabilities including: clockwise coordinate system, parallel axis labels, and interactive modifiers like [PolarZoomExtentsModifier](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarzoomextentsmodifier.html) and [PolarLegendModifier](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarlegendmodifier.html). The `interpolateLine` property demonstrates both straight and curved line rendering options.\n\n### Integration and Best Practices\nThe implementation follows best practices for asynchronous initialization and resource cleanup. Developers can extend this example by adding real-time updates or customizing the polar axes as described in the [Polar Charts documentation](https://www.scichart.com/documentation/js/v4/2d-charts/polar-charts.html).",
            },
            react: {
                subtitle:
                    "Creates a **React Polar Mountain Chart** using SciChart.js, with both regular & interpolated mountain modes, via **PolarMountainRenderableSeries**",
                title: "React Polar Mountain Chart",
                pageTitle: "React Polar Mountain Chart | JavaScript Charts | SciChart.js, with both regular & interpolated mountain modes, via **PolarMountainRenderableSeries**",
                metaDescription: null,
                markdownContent: "## Polar Mountain Chart - React\n\n### Overview\nThis React example demonstrates how to integrate a **Polar Mountain Chart** using the [SciChartReact](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartreact.html) component. It renders three mountain series in polar coordinates with animated transitions and interactive legend controls.\n\n### Technical Implementation\nThe chart is initialized via the `initChart` prop which creates a polar surface with radial and angular axes. Each [PolarMountainRenderableSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarmountainrenderableseries.html) uses a closed-loop [XyDataSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/xydataseries.html) and applies a [WaveAnimation](https://www.scichart.com/documentation/js/v4/typedoc/classes/waveanimation.html) effect. The component handles WASM context lifecycle automatically.\n\n### Features and Capabilities\nThe example showcases React-specific integration patterns while maintaining all features from the JavaScript version: gradient fills, line interpolation options, and polar-specific modifiers. The [PolarLegendModifier](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarlegendmodifier.html) includes interactive checkboxes for series visibility toggling.\n\n### Integration and Best Practices\nThis implementation follows React best practices by separating chart logic into a pure function component. For advanced use cases, developers can explore the [React Chart Performance](https://www.scichart.com/documentation/js/v4/performance-tips/react-performance-tips.html) guide to optimize rendering of multiple polar series.",
            },
            angular: {
                subtitle:
                    "Creates a **Angular Polar Mountain Chart** using SciChart.js, with both regular & interpolated mountain modes, via **PolarMountainRenderableSeries**",
                title: "Angular Polar Mountain Chart",
                pageTitle: "Angular Polar Mountain Chart | JavaScript Charts | SciChart.js, with both regular & interpolated mountain modes, via **PolarMountainRenderableSeries**",
                metaDescription: null,
                markdownContent: "## Polar Mountain Chart - Angular\n\n### Overview\nThis Angular example demonstrates a standalone component implementation of a **Polar Mountain Chart** using the [ScichartAngularComponent](https://www.npmjs.com/package/scichart-angular). The chart visualizes three mountain series with configurable interpolation and gradient fills in polar coordinates.\n\n### Technical Implementation\nThe component passes the `drawExample` function to the `[initChart]` input of `scichart-angular`. The polar surface is configured with a radial [PolarNumericAxis](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarnumericaxis.html) (Y-axis) and angular axis (X-axis), using `EPolarAxisMode` to define their behavior. Series are rendered with [WaveAnimation](https://www.scichart.com/documentation/js/v4/typedoc/classes/waveanimation.html) effects.\n\n### Features and Capabilities\nThe example maintains all core features including: polar-specific modifiers, gradient fills with alpha transparency, and the option to interpolate lines. The Angular integration demonstrates proper component lifecycle management with automatic WASM context cleanup.\n\n### Integration and Best Practices\nThis implementation follows Angular standalone component best practices. Developers can extend it by adding input properties for dynamic data updates as described in the [Angular Integration Guide](https://www.scichart.com/documentation/js/v4/angular-charts.html). The example also shows proper use of Angular's change detection strategy with SciChart's WebAssembly rendering."
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Polar Mountain Chart documentation will help you to get started",
                linkTitle: "JavaScript Polar Mountain Chart Documentation",
            },
        ],
        path: "polar-mountain-chart",
        metaKeywords: "polar, mountain, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/PolarCharts/PolarMountainChart",
        thumbnailImage: "javascript-polar-mountain-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true
    };
//// End of computer generated metadata

export default createExampleInfo(metaData);
