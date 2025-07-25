import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "PolarScatterChart",
        id: "chart2D_polarCharts_PolarScatterChart",
        imagePath: "javascript-polar-scatter-chart.jpg",
        description:
            "Creates a **JavaScript Polar Scatter Chart** using SciChart.js, with the **PolarXyScatterRenderableSeries** and custom legend-markers.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Polar Scatter Chart** using SciChart.js, with the **PolarXyScatterRenderableSeries** and custom legend-markers.",
                title: "JavaScript Polar Scatter Chart",
                pageTitle: "JavaScript Polar Scatter Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# Polar Scatter Chart - JavaScript\n\n## Overview\nThis example demonstrates how to render a high-performance **Polar Scatter Chart** using SciChart.js. It creates a circular XY scatter by calling `SciChartPolarSurface.create`, configuring radial and angular axes, and plotting multiple series with custom point markers and animations.\n\n## Technical Implementation\nThe chart is initialized via the asynchronous `SciChartPolarSurface.create` API, which loads WebAssembly and returns a `SciChartSurface` and `wasmContext`[1]. A **Radial** axis and an **Angular** axis are added using [PolarNumericAxis](https://www.scichart.com/documentation/js/v4/2d-charts/axis-api/axis-types/polar-numeric-axis/) [2], configured for start angle, visible range, and grid line styling. Data series are generated as arrays and rendered with `PolarXyScatterRenderableSeries`, each using a `SweepAnimation` for smooth startup.\n\n## Features and Capabilities\nThe example showcases:\n- **Custom point markers** (circle, triangle) with RGBA fills and stroke settings\n- **Legend customization** using `PolarLegendModifier` to display checkboxes and SVG markers[3]\n- **Interactive modifiers**: pan, zoom extents, and mouse-wheel zoom for responsive UX\n\n## Integration and Best Practices\nThis pure JavaScript implementation leverages direct API calls instead of the Builder API for granular control. Async initialization ensures the WebAssembly context is ready before chart creation. Developers should dispose of the `SciChartSurface` via `.delete()` to free memory when the chart is no longer needed.",
            },
            react: {
                subtitle:
                    "Creates a **React Polar Scatter Chart** using SciChart.js, with the **PolarXyScatterRenderableSeries** and custom legend-markers.",
                title: "React Polar Scatter Chart",
                pageTitle: "React Polar Scatter Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# Polar Scatter Chart - React\n\n## Overview\nThis example integrates a **Polar Scatter Chart** into a React application using `scichart-react`. It asynchronously initializes the chart via `drawExample`, rendering multiple scatter series on radial and angular axes.\n\n## Technical Implementation\nWithin the `` component, `drawExample` calls `SciChartPolarSurface.create` to set up the chart surface and WebAssembly context[1]. Axes are configured with [PolarNumericAxis](https://www.scichart.com/documentation/js/v4/2d-charts/axis-api/axis-types/polar-numeric-axis/) [2], specifying `EPolarAxisMode.Radial` and `EPolarAxisMode.Angular`, start angles, ranges, and styling. Scatter series are added using `PolarXyScatterRenderableSeries` and animated via `SweepAnimation`.\n\n## Features and Capabilities\nReact integration includes:\n- **Customizable legend** with `PolarLegendModifier` overriding `getLegendItemHTML` to render SVG markers[3]\n- **Interactive chart modifiers**: `PolarPanModifier`, `PolarZoomExtentsModifier`, `PolarMouseWheelZoomModifier`\n- **High-performance rendering** through WebGL and WebAssembly\n\n## Integration and Best Practices\nUse `scichart-react` to manage the chart lifecycle. Provide cleanup by returning a destructor that calls `sciChartSurface.delete()`. Follow best practices for async initialization in React components and leverage documented hooks in [scichart-react GitHub](https://github.com/ABTSoftware/scichart-react) [4]."
            },
            angular: {
                subtitle:
                    "Creates a **Angular Polar Scatter Chart** using SciChart.js, with the **PolarXyScatterRenderableSeries** and custom legend-markers.",
                title: "Angular Polar Scatter Chart",
                pageTitle: "Angular Polar Scatter Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# Polar Scatter Chart - Angular\n\n## Overview\nThis standalone Angular component renders a **Polar Scatter Chart** using SciChart.js. It demonstrates embedding `drawExample` within a `ScichartAngularComponent` to initialize radial and angular axes and plot multiple scatter series.\n\n## Technical Implementation\nIn the Angular component, `drawExample` calls `SciChartPolarSurface.create` to initialize the chart surface and WASM context[1]. Radial and Angular axes are configured via [PolarNumericAxis](https://www.scichart.com/documentation/js/v4/2d-charts/axis-api/axis-types/polar-numeric-axis/) [2], including angle modes, visible ranges, and grid styling. `PolarXyScatterRenderableSeries` is used for each series, with `SweepAnimation` to animate points.\n\n## Features and Capabilities\nKey features include:\n- **SVG-based custom legend** using `PolarLegendModifier`, allowing checkboxes and series markers[3]\n- **Interactive modifiers**: `PolarPanModifier`, `PolarZoomExtentsModifier`, `PolarMouseWheelZoomModifier`\n- **Real-time rendering** and smooth animations via WebGL\n\n## Integration and Best Practices\nEmbed the chart by binding `initChart` to `drawExample` in the `template`. Use Angular’s lifecycle hooks to handle asynchronous initialization and call `sciChartSurface.delete()` in `ngOnDestroy` for cleanup. Follow Angular best practices for standalone components and async operations."
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Scatter%20Series%20Type.html",
                title: "This specific page in the JavaScript Polar Scatter Chart documentation will help you to get started",
                linkTitle: "JavaScript Polar Scatter Chart Documentation",
            },
        ],
        path: "polar-scatter-chart",
        metaKeywords: "polar, scatter, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/PolarCharts/PolarScatterChart",
        thumbnailImage: "javascript-polar-scatter-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export default createExampleInfo(metaData);
