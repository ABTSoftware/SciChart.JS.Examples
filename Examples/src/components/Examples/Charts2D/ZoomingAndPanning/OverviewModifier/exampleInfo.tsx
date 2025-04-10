import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "Overview",
        id: "chart2D_zoomAndPanAChart_Overview",
        imagePath: "javascript-overview-chart.jpg",
        description:
            "Demonstrates how to zoom and pan with an **Overview Chart** using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to zoom and pan with an **Overview Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Zoom and Pan with Overview Chart",
                pageTitle: "Zoom and Pan with Overview Chart",
                metaDescription: "Demonstrates how to zoom and pan with an Overview Chart",
                markdownContent:
                    "## Overview Modifier Example - JavaScript\n\n### Overview\nThis example demonstrates how to create an advanced interactive chart using SciChart.js with an integrated overview scrollbar. The chart is built entirely with JavaScript and showcases asynchronous initialization, detailed axis configuration, multiple renderable series, rich interactive modifiers, and informative annotations.\n\n### Technical Implementation\nThe chart is initialized asynchronously using the `SciChartSurface.create()` method, which provides both the WebAssembly context and the chart surface. Two numeric axes are configured: one with a fixed visible range and another that uses auto-ranging with the `autoRange` and `growBy` properties as detailed in the [NumericAxis documentation](https://www.scichart.com/documentation/js/current/typedoc/classes/numericaxis.html). Data is generated via a random walk algorithm and rendered using a `FastLineRenderableSeries` for line rendering and an `XyScatterRenderableSeries` for scatter points. Interactive behavior is enabled through the combination of modifiers such as `ZoomPanModifier`, `RubberBandXyZoomModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier`; these techniques are explained in the [Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html) guide.\n\nFinally, an Overview scrollbar is added to the chart, using the function `sciChartOverview.create()` which creates and binds an overview to a parent `SciChartSurface`, placing it in it's own `HTMLDivElement`.\n\n### Features and Capabilities\nThe example features advanced performance optimization through efficient rendering with the `FastLineRenderableSeries`, which is ideal for handling large data sets. It also implements annotations using `NativeTextAnnotation` in relative coordinate mode to overlay instructional text on the chart. The Overview chart allows scrolling back and forth through the dataset, as described in the  [Scrollbars with SciChartOverview](https://www.scichart.com/documentation/js/current/SciChartOverview.html) documentation page.\n\n### Integration and Best Practices\nThis implementation follows best practices for asynchronous initialization and modular development in JavaScript, as recommended in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide.",
            },
            react: {
                subtitle:
                    "Demonstrates how to zoom and pan with an **Overview Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Zoom and Pan with Overview Chart",
                pageTitle: "Zoom and Pan with Overview Chart",
                metaDescription: "Demonstrates how to zoom and pan with an Overview Chart",
                markdownContent:
                    "## Zoom and Pan with Overview Chart - React\n\n### Overview\nThis example demonstrates how to integrate SciChart.js within a React application to build an interactive 2D chart with advanced zooming and panning capabilities. The implementation makes use of the `<SciChartReact/>` component for initializing the chart surface and the `SciChartNestedOverview` component from [scichart-react](https://www.npmjs.com/package/scichart-react) to embed a synchronized overview chart, providing a comprehensive view of the chart's data.\n\n### Technical Implementation\nThe chart is set up by creating a `SciChartSurface` with a WebAssembly (WASM) context, numeric axes, and two types of renderable series: a `FastLineRenderableSeries` and an `XyScatterRenderableSeries`, both generated using random walk data. An annotation is added to guide user interactions, while multiple interactive modifiers such as `ZoomPanModifier`, `RubberBandXyZoomModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier` provide dynamic navigation. Detailed guidance on adding zoom and pan behavior can be found in the [Tutorial 03 - Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html).\n\n### Features and Capabilities\nThe example offers dynamic update features by propagating user interactions between the main chart and the overview. It leverages performance enhancements from the `FastLineRenderableSeries` for efficient rendering, and the use of dynamic data visualization maintains a responsive experience. These capabilities make it ideal for applications that require immediate feedback when zooming and panning, ensuring that the entire series data remains in sync.\n\n### Integration and Best Practices\nFocusing on React integration, the example utilizes the `<SciChartReact/>` component as outlined in the [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/) article. The nested overview chart is automatically synchronized with the parent `SciChartSurface`, a technique aligned with practices described in the [SciChartOverview documentation](https://www.scichart.com/documentation/js/current/SciChartOverview.html). Additionally, management of the WASM context and chart initialization follows established patterns from the [Tutorial 01 - Setting up a project with scichart-react and config object](https://www.scichart.com/documentation/js/current/TutorialSetupProjectWithSciChartReact.html) to optimize performance. For deeper insights into rendering performance and optimization strategies, developers can refer to the [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/) guide.",
            },
            angular: {
                subtitle:
                    "Demonstrates how to zoom and pan with an **Overview Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Zoom and Pan with Overview Chart",
                pageTitle: "Zoom and Pan with Overview Chart",
                metaDescription: "Demonstrates how to zoom and pan with an Overview Chart",
                markdownContent:
                    "## Zoom and Pan with Overview Chart (Angular)\n\n### Overview\nThis example demonstrates how to integrate **SciChart.js** into an Angular application to create high-performance, interactive 2D charts with a synchronized `SciChartOverview` scrollbar. The chart offers advanced zooming and panning capabilities, enabling users to interact with large datasets in real time. For an introductory guide, see [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/).\n\n### Technical Implementation\nThe chart is initialized by creating a `SciChartSurface` with a WebAssembly context and configuring numeric axes for dynamic scaling. Two renderable series are added: a `FastLineRenderableSeries` and an `XyScatterRenderableSeries`, each leveraging random walk data to simulate dynamic input. Interactive modifiers such as `ZoomPanModifier`, `RubberBandXyZoomModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier` are incorporated to enable seamless zooming and panning, as detailed in [Tutorial 03 - Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html).\n\n### Features and Capabilities\nThe example showcases real-time update capabilities, with the main chart and its overview scrollbar created via `SciChartOverview.create()` remaining synchronized during user interactions. Additional features include embedded annotations for enhanced user guidance and multiple renderable series for diverse data visualization. The built-in overview chart allows users to maintain a global perspective of chart data, an approach aligned with the practices described in the [SciChartOverview documentation](https://www.scichart.com/documentation/js/current/SciChartOverview.html).\n\n### Integration and Best Practices\nIntegrating SciChart.js within an Angular project requires careful management of component lifecycles and dependency injection to optimize the WebAssembly context. Developers are encouraged to employ Angular lifecycle hooks and modular configuration from the [scichart-angular](https://www.npmjs.com/package/scichart-react) package for maintaining chart performance and scalability.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/SciChartOverview.html",
                title: "This specific page in the JavaScript SciChartOverview Api documentation will help you to get started",
                linkTitle: "SciChart.js Overview Documentation",
            },
        ],
        path: "overview",
        metaKeywords: "drag, axis, scale, overview, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/ZoomingAndPanning/OverviewModifier",
        thumbnailImage: "javascript-overview-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const overviewExampleInfo = createExampleInfo(metaData);
export default overviewExampleInfo;
