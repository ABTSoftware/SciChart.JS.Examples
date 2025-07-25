import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "PolarBandChart",
        id: "chart2D_polarCharts_PolarBandChart",
        imagePath: "javascript-polar-band-chart.jpg",
        description: "Creates a **JavaScript Polar Band Chart** using SciChart.js, our feature-rich JavaScript Chart Library",
        tips: [],
        frameworks: {
            javascript: {
                subtitle: "Create a **JavaScript Polar Band Chart** using SciChart.js",
                title: "JavaScript Polar Band Chart",
                pageTitle: "JavaScript Polar Band Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# Polar Band Chart - JavaScript\n\n## Overview\nThis example demonstrates how to create a **Polar Band Chart** using SciChart.js in vanilla JavaScript. The chart visualizes data in polar coordinates with two band series (regular and interpolated) between radial and angular axes.\n\n## Technical Implementation\nThe chart is initialized asynchronously using `SciChartPolarSurface.create()`. It configures a radial `PolarNumericAxis` with `EPolarAxisMode.Radial` and an angular axis with `EPolarAxisMode.Angular`. Two `PolarBandRenderableSeries` instances are added, one with `interpolateLine=false` and another with `interpolateLine=true`, both using `XyyDataSeries` for storing values. The implementation includes interactive modifiers like `PolarZoomExtentsModifier` and `PolarPanModifier` for user interaction.\n\n## Features and Capabilities\nThe example showcases polar chart capabilities including band series with customizable fills (`fill` and `fillY1`) and strokes (`stroke` and `strokeY1`). It demonstrates the difference between interpolated and non-interpolated band rendering. The chart also features a `PolarLegendModifier` with checkboxes for series visibility toggling.\n\n## Integration and Best Practices\nThe implementation follows memory management best practices by providing a cleanup function that calls `sciChartSurface.delete()`. For more details on polar charts, see the [Polar Chart documentation](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html).",
            },
            react: {
                subtitle: "Create a **React Polar Band Chart** using SciChart.js",
                title: "React Polar Band Chart",
                pageTitle: "React Polar Band Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# Polar Band Chart - React\n\n## Overview\nThis React example demonstrates how to integrate a **Polar Band Chart** using SciChart's React components. The chart displays two polar band series with different interpolation modes in a polar coordinate system.\n\n## Technical Implementation\nThe chart is rendered using the `SciChartReact` component with an `initChart` prop pointing to the `drawExample` function. This function creates a polar surface with radial and angular axes, then adds two `PolarBandRenderableSeries` instances with `SweepAnimation` for smooth transitions. The implementation uses React's component lifecycle for proper initialization and cleanup.\n\n## Features and Capabilities\nThe example highlights React-specific integration of polar chart features including animated series, interactive modifiers (`PolarMouseWheelZoomModifier`, `PolarZoomExtentsModifier`), and a configurable legend. The component demonstrates how to apply theme colors from a shared `appTheme` object.\n\n## Integration and Best Practices\nThe implementation shows best practices for using SciChart in React, including async initialization and proper component structure. For more on React integration, see the [SciChart React documentation](https://www.scichart.com/documentation/js/v4/typedoc/globals.html#scichartreact).",
            },
            angular: {
                subtitle: "Create a **Angular Polar Band Chart** using SciChart.js",
                title: "Angular Polar Band Chart",
                pageTitle: "Angular Polar Band Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# Polar Band Chart - Angular\n\n## Overview\nThis Angular example demonstrates how to create a **Polar Band Chart** using SciChart's Angular components. The standalone component renders a polar surface with two band series showing different interpolation behaviors.\n\n## Technical Implementation\nThe chart is implemented as an Angular standalone component using `ScichartAngularComponent`. The `drawExample` function is passed as an input to initialize the chart, creating a polar surface with radial and angular axes. Two band series are added with distinct styling and animation configurations.\n\n## Features and Capabilities\nThe example showcases Angular-specific implementation of polar chart features including band series with customizable fills and strokes, animation effects, and interactive zoom/pan behavior. The component demonstrates proper TypeScript typing for all SciChart entities.\n\n## Integration and Best Practices\nThe implementation follows Angular best practices for standalone components and demonstrates proper chart initialization and cleanup. For more details, see the [SciChart Angular documentation](https://www.scichart.com/documentation/js/v4/typedoc/globals.html#scichartangularcomponent)."
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Polar Band Chart documentation will help you to get started",
                linkTitle: "JavaScript Polar Band Chart Documentation",
            },
        ],
        path: "polar-band-chart",
        metaKeywords: "polar, band, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/PolarCharts/PolarBandChart",
        thumbnailImage: "javascript-polar-band-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export default createExampleInfo(metaData);
