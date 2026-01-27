import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "OverviewForSubCharts",
        id: "chart2D_zoomAndPanAChart_OverviewForSubCharts",
        imagePath: "overview-for-subcharts.jpg",
        description:
            "Demonstrates a custom modifier which adds a dynamic overview for multiple subcharts using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to create **multiple synchronized subcharts with an interactive overview** using SciChart.js",
                title: "JavaScript Overview for SubCharts with Range Selection",
                pageTitle: "JavaScript Overview for SubCharts with Range Selection",
                metaDescription:
                    "Demonstrates how to create multiple synchronized subcharts with an overview range selector using SciChart.js and SubSurfaces",
                markdownContent:
                    "## Overview for SubCharts – JavaScript\n\n### Overview\nThis example demonstrates how to build a **multi-panel chart layout** in JavaScript using SciChart.js, where several subcharts are vertically stacked and synchronized through a shared interactive overview. The overview chart displays aggregated data from all subcharts and allows users to zoom and pan all charts simultaneously using a draggable range selector.\n\n### Technical Implementation\nThe chart is initialized by creating a single `SciChartSurface`, then dynamically adding multiple `SciChartSubSurface` instances. Each subchart owns its own `NumericAxis` pair and `FastLineRenderableSeries`, while an `AxisSynchroniser` keeps all X-axes aligned. Data is generated using `XyDataSeries`, simulating phase-shifted sine waves.\n\nAn interactive overview is implemented using a custom `SubChartsOverviewModifier`. This modifier creates an additional subsurface occupying the bottom 20% of the chart, clones renderable series from each subchart, and attaches an `OverviewRangeSelectionModifier` to control the visible range across all subcharts.\n\n### Features and Capabilities\n**Dynamic SubChart Management:** Subcharts can be added, removed, or fully recreated at runtime without triggering interaction issues, using safe lifecycle management with `suspendUpdates()`.\n\n**Synchronized Zooming and Panning:** Mouse wheel zoom, drag panning, and programmatic zooming are automatically synchronized across all subcharts via a shared X-axis range.\n\n**Interactive Overview Panel:** The overview aggregates all visible data and provides a draggable selection window that controls the visible range of every subchart simultaneously.\n\n**High-Performance Rendering:** All charts leverage SciChart.js WebAssembly rendering, ensuring smooth performance even with multiple charts and large datasets.\n\n### Integration and Best Practices\nThis example demonstrates best practices for managing multiple subcharts using `SciChartSubSurface`, including safe cleanup, axis synchronization, and modifier coordination. Developers can extend this pattern to build advanced dashboards, signal analysis tools, or monitoring applications. For more information, see the [SubSurfaces API](https://www.scichart.com/documentation/js/v4/2d-charts/subcharts-api/) and [Performance Tips & Tricks](https://www.scichart.com/documentation/js/v4/2d-charts/performance-tips/performance-tips-and-tricks/).",
            },
            react: {
                subtitle:
                    "Demonstrates how to create **multiple synchronized subcharts with an interactive overview** in a React application using SciChart.js",
                title: "React Overview for SubCharts with Range Selection",
                pageTitle: "React Overview for SubCharts with Range Selection",
                metaDescription:
                    "Demonstrates how to build synchronized multi-panel charts with an overview range selector using SciChart.js in React",
                markdownContent:
                    "## Overview for SubCharts – React\n\n### Overview\nThis example demonstrates how to implement a **multi-subchart layout with a shared overview** in a React application using SciChart.js. Multiple vertically stacked charts are rendered within a single `SciChartSurface`, each synchronized on the X-axis and controlled through an interactive overview panel.\n\n### Technical Implementation\nThe chart is initialized via the `<SciChartReact />` component, which invokes a custom `drawExample` function. This function dynamically creates several `SciChartSubSurface` instances, each configured with its own axes, renderable series, and interaction modifiers. An `AxisSynchroniser` ensures all subcharts maintain the same visible X-range.\n\nThe overview functionality is encapsulated in a reusable `SubChartsOverviewModifier`, which listens for subchart lifecycle events and mirrors their renderable series into an overview subsurface. The `OverviewRangeSelectionModifier` allows users to control zoom and pan interactions across all subcharts from a single control surface.\n\n### Features and Capabilities\n**React-Friendly Lifecycle Management:** Subcharts are safely created and destroyed without React reconciliation conflicts by leveraging SciChart’s internal update suspension mechanisms.\n\n**Centralized Zoom Control:** Users can zoom and pan all subcharts simultaneously using either direct mouse interaction or the overview range selector.\n\n**Reusable Overview Modifier:** The overview logic is encapsulated in a custom chart modifier, making it easy to reuse across different dashboards or chart configurations.\n\n**High-Performance Real-Time Charts:** The example showcases how SciChart.js integrates seamlessly into React while maintaining WebAssembly-powered performance.\n\n### Integration and Best Practices\nThis approach follows best practices for integrating SciChart.js into React by isolating chart creation logic from React rendering. Developers can extend this pattern to support real-time streaming data, dynamic chart layouts, or advanced dashboard interactions. For more guidance, see [Creating a SciChart React Component](https://www.scichart.com/documentation/js/v4/get-started/tutorials-react/) and the [React Charts with SciChart.js](https://www.scichart.com/blog/react-charts-with-scichart-js/) guide.",
            },
            angular: {
                subtitle:
                    "Demonstrates how to create **multiple synchronized subcharts with an interactive overview** in an Angular application using SciChart.js",
                title: "Angular Overview for SubCharts with Range Selection",
                pageTitle: "Angular Overview for SubCharts with Range Selection",
                metaDescription:
                    "Demonstrates how to build synchronized multi-panel charts with an overview range selector using SciChart.js in Angular",
                markdownContent:
                    "## Overview for SubCharts – Angular\n\n### Overview\nThis example demonstrates how to create a **multi-panel chart layout with synchronized subcharts and an overview range selector** using SciChart.js within an Angular application. Each subchart displays its own data while remaining fully synchronized through shared zoom and pan interactions.\n\n### Technical Implementation\nThe chart is hosted inside a standalone Angular component using the `scichart-angular` integration. A custom initialization function dynamically creates multiple `SciChartSubSurface` instances, each with its own `NumericAxis`, `FastLineRenderableSeries`, and interaction modifiers such as `ZoomPanModifier` and `MouseWheelZoomModifier`.\n\nAn overview panel is added using a custom `SubChartsOverviewModifier`, which creates an additional subsurface at the bottom of the chart. This overview aggregates series from all subcharts and applies an `OverviewRangeSelectionModifier` to synchronize the visible range across every chart.\n\n### Features and Capabilities\n**Dynamic Multi-Chart Layout:** Subcharts are automatically positioned and resized based on the number of active charts.\n\n**Unified Range Selection:** The overview panel provides a single control point for zooming and panning all subcharts simultaneously.\n\n**Robust Lifecycle Handling:** The example carefully manages subchart creation and deletion to avoid interaction issues, ensuring stable behavior during dynamic updates.\n\n**Enterprise-Grade Performance:** Leveraging SciChart.js WebAssembly rendering ensures smooth interactivity even with multiple charts and dense datasets.\n\n### Integration and Best Practices\nThis example follows recommended patterns for integrating SciChart.js into Angular, including isolating chart initialization logic and using safe update suspension during layout changes. Developers building analytical dashboards or monitoring tools can use this approach as a foundation. See the [SciChart Angular Documentation](https://www.scichart.com/documentation/js/v4/get-started/tutorials-angular/) and [SubCharts API](https://www.scichart.com/documentation/js/v4/2d-charts/subcharts-api/) for further details.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/v4/intro/",
                title: "The SciChart.js documentation contains loads of useful information on how to use our High Performance JavaScript Charts",
                linkTitle: "SciChart.js Documentation Home",
            },
        ],
        path: "overview-for-subcharts",
        metaKeywords: "subcharts, overview, demo, chart, javascript, webgl, canvas",
        onWebsite: false,
        filepath: "Charts2D/ZoomingAndPanning/OverviewForSubCharts",
        thumbnailImage: "overview-for-subcharts.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true,
    };
//// End of computer generated metadata

export const overviewForSubChartsExampleInfo = createExampleInfo(metaData);
export default overviewForSubChartsExampleInfo;
