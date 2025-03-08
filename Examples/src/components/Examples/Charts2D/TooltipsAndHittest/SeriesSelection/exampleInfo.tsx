import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DTooltipsAndHittestSeriesSelection",
        imagePath: "javascript-chart-series-selection.jpg",
        description:
            "Demonstrates how to add **Series Selection** to a chart using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to add **Series Selection** to a chart using SciChart.js, High Performance JavaScript Charts",
                title: "Using Series Selection",
                pageTitle: "Using Series Selection",
                metaDescription:
                    "Demonstrates Hit-Testing a JavaScript Chart - point and click on the chart and get feedback about what data-points were clicked",
                markdownContent:
                    "## Chart Series Selection/Hover in JavaScript\n\n### Overview\nThis example demonstrates how to implement interactive series selection and hover events in SciChart.js using JavaScript. Multiple renderable series are added to a chart and enhanced with custom event handlers to provide visual feedback when a series is hovered or selected. Developers can learn more about these capabilities by exploring the [Series Selection](https://www.scichart.com/documentation/js/current/SeriesSelection.html) documentation and the [SeriesSelectionModifier] TypeDoc API(https://www.scichart.com/documentation/js/current/typedoc/classes/seriesselectionmodifier.html) reference.\n\n### Technical Implementation\nThe chart is initialized by calling `SciChartSurface.create()` with a WebAssembly context, and `NumericAxis` components are added to provide dynamic scaling with a customizable `NumberRange`. A `SeriesSelectionModifier` is added to the chart and `onHoveredChanged` and `onSelectedChanged` event handlers are implemented to adjust the opacity and stroke color of each series. In particular, the example uses `GenericAnimation` to smoothly transition visual properties when series are hovered, while other series are dimmed to emphasize the active one. Annotations such as `TextAnnotation` are added to display instructions and, together with a `LegendModifier`, help provide a legend which adds context to the data.\n\n### Features and Capabilities\nThis example highlights several advanced features of SciChart.js including:\n\n- **Interactive Series Selection**: Implemented via the `SeriesSelectionModifier`, enabling both hover and click-based selection events.\n- **Custom Animations**: Smooth transitions for visual feedback are achieved using `GenericAnimation`, allowing dynamic changes in opacity and stroke color.\n- **Annotations and Legends**: A text annotation provides user guidance while a legend is integrated using the `LegendModifier` for clear data series labeling.\n- **Resource Management**: The chart instance is properly disposed of using the delete method on the `SciChartSurface`, following best practices detailed in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide.\n\n### Integration and Best Practices\nWhile this example is implemented using JavaScript, it demonstrates patterns that are easily transferable to frameworks like React, Angular, or Vue. Developers are encouraged to follow efficient performance practices by leveraging the WebAssembly context (`wasmContext`) for processing large datasets, as showcased in the [SciChart.js Performance Demo](https://www.scichart.com/blog/scichart-js-performance-demo-1-million-datapoints-70ms/).\n\nThis comprehensive example serves as a practical guide for adding interactivity and advanced visual customizations to SciChart.js charts using plain JavaScript while adhering to best practices for performance optimization and resource management.",
            },
            react: {
                subtitle:
                    "Demonstrates how to add **Series Selection** to a chart using SciChart.js, High Performance JavaScript Charts",
                title: "Using Series Selection",
                pageTitle: "Using Series Selection",
                metaDescription:
                    "Demonstrates Hit-Testing a React Chart - point and click on the chart and get feedback about what data-points were clicked",
                markdownContent:
                    "## Chart Series Selection/Hover in React\n\n### Overview\nThis example demonstrates how to implement **Series Selection** in a SciChart.js chart within a React application. It showcases interactive features where users can hover over and select chart series, triggering animations and visual style changes in real-time.\n\n### Technical Implementation\nLeveraging the React framework, the chart is initialized using the [SciChartReact](https://www.scichart.com/blog/react-charts-with-scichart-js/) component. A dedicated draw function sets up the `SciChartSurface` with a `SeriesSelectionModifier`, numeric X and Y axes and adds multiple spline line series, each equipped with custom event callbacks for hover (`onHoveredChanged`) and selection (`onSelectedChanged`) events. These event callbacks use the `GenericAnimation` API to smoothly animate opacity transitions and update visual properties such as stroke and point markers. Annotations and legends are also incorporated to provide context and enhance user interaction, as detailed in the [SciChart.js Series Selection Documentation](https://www.scichart.com/documentation/js/current/SeriesSelection.html).\n\n### Features and Capabilities\nThis example highlights several key features including real-time hover effects, series selection modifications, and animated transitions. When a series is hovered, it smoothly transitions to full opacity while the others are dimmed. Selecting a series updates its visual style to distinguish it further, ensuring clear feedback for user interactions. The chart also includes text annotations and an integrated legend to improve usability and data interpretation.\n\n### Integration and Best Practices\nBy utilizing the modular nature of React, the example cleanly separates chart initialization from the component structure, following best practices for performance and maintainability. The use of event callbacks for dynamic style updates and the implementation of smooth animations with [GenericAnimation](https://www.scichart.com/documentation/js/current/Generic%20Animations.html) are excellent examples of optimizing interactive charting in a React environment. Developers seeking further guidance on integrating SciChart.js with React may also refer to the [React integration best practices](https://www.scichart.com/blog/react-charts-with-scichart-js/) for more detailed insights.",
            },
            angular: {
                subtitle:
                    "Demonstrates how to add **Series Selection** to a chart using SciChart.js, High Performance JavaScript Charts",
                title: "Using Series Selection",
                pageTitle: "Using Series Selection",
                metaDescription:
                    "Demonstrates Hit-Testing a Angular Chart - point and click on the chart and get feedback about what data-points were clicked",
                markdownContent:
                    "## Chart Series Selection/Hover in Angular\n\n### Overview\nThe Series Selection example in Angular demonstrates how to integrate SciChart.js to create highly interactive charts with dynamic hover and selection effects. The example illustrates how custom callbacks and animations can be used to provide immediate visual feedback when a chart series is hovered over or selected.\n\n### Technical Implementation\nIn this example, a `SciChartSurface` is initialized by creating numeric X and Y axes and adding multiple spline line series. A `SeriesSelectionModifier` is added to the chart. Each series is configured with custom callbacks - `onHoveredChanged` and `onSelectedChanged` — to handle interactivity. Hovering over a series triggers a smooth opacity transition using the `GenericAnimation` API, while selection changes the series’ stroke color to enhance visual distinction. The use of [Series Selection](https://www.scichart.com/documentation/js/current/SeriesSelection.html) modifiers streamlines the process of enabling these interactions without relying on the Builder API, thereby offering developers explicit control over the chart components.\n\n### Features and Capabilities\nThis Angular example provides several advanced features such as:\n- **Dynamic Hover Effects:** When a series is hovered, its opacity is animated to full visibility, while non-hovered series are dimmed, ensuring clear focus on the active series.\n- **Interactive Series Selection:** Click events update the series visual style by changing its stroke using custom selection callbacks, enhancing user interaction.\n- **Annotations and Legends:** `TextAnnotation` and integrated legends (via `LegendModifier`) are added to improve data interpretation and chart usability.\n\n### Integration and Best Practices\nOptimized for Angular, this example adheres to best practices for real-time chart rendering and interactive event management. It leverages Angular’s component structure to cleanly encapsulate the chart initialization logic. Developers looking to create dynamic, high-performance charts in Angular can reference the [scichart-angular](https://www.npmjs.com/package/scichart-angular) npm package for further insights.\n\n### Conclusion\nThis example clearly illustrates how to implement chart Series Selection in an Angular environment with SciChart.js. It combines interactive hover and selection events with real-time animations and intuitive chart customizations, making it a valuable reference for developers aiming to build robust, interactive charting applications with Angular.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/SeriesSelection.html",
                title: "SciChart.js Series Selection Documentation",
                linkTitle: "SciChart.js Series Selection Documentation",
            },
        ],
        path: "chart-series-selection",
        metaKeywords: "hit, test, api, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/TooltipsAndHittest/SeriesSelection",
        thumbnailImage: "javascript-chart-series-selection.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const seriesSelectionExampleInfo = createExampleInfo(metaData);
