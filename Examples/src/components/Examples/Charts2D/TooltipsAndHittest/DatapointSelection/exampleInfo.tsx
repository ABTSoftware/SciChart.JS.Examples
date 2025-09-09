import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "DatapointSelection",
        id: "chart2D_tooltipsAndHittest_DataPointSelection",
        imagePath: "javascript-datapoint-selection.jpg",
        description:
            "Demonstrates how to **Select Data Points** on a chart using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to **Select Data Points** on a chart using SciChart.js, High Performance JavaScript Charts",
                title: "JavaScript Chart Data Point Selection",
                pageTitle: "JavaScript Chart Data Point Selection",
                metaDescription:
                    "Demonstrates the DatapointSelectionModifier, which provides a UI to select one or many data points, and works with DataPointSelectionPaletteProvider to change the appearance of selected points",
                markdownContent:
                    "## Datapoint Selection – JavaScript\n\n### Overview\nThis example demonstrates how to implement data point selection in SciChart.js Charts using JavaScript. The example creates several spline line series with simulated data and enables interactive selection of data points. It leverages the SciChart.js core components such as axes, renderable series, annotations, and modifiers to provide a rich, interactive charting experience.\n\n### Technical Implementation\nThe chart is set up by creating a `SciChartSurface` with a WebAssembly context (see [Creating a new SciChartSurface and loading Wasm](https://www.scichart.com/documentation/js/current/SciChartSurface.create%20and%20createSingle.html) for more details). Two numeric axes are added to the surface and a number of spline line renderable series are created using an `XyDataSeries`. Each series uses custom point markers styled according to an automatic color scheme. In addition, a custom data label provider built with the `LineSeriesDataLabelProvider` is implemented to conditionally display labels only for selected points based on `metadata`. For handling data point selection, the [DataPointSelectionModifier](https://www.scichart.com/documentation/js/current/DataPointSelection.html) is added to the chart. Its event subscription mechanism is used to update a table of selected points via a callback when selection changes occur. The example also makes use of the `DataPointSelectionPaletteProvider` to customize the stroke and fill of selected data points denoted by `metadata.isSelected`.\n\n### Features and Capabilities\nThis chart supports interactive selection via click, CTRL+CLICK, and click & drag actions. Selected data points display custom data labels that include the x and y values, and are visually distinguished by a custom palette. The example also includes text annotations (configured with `TextAnnotation`) to guide the user, and a legend provided by the [LegendModifier](https://www.scichart.com/documentation/js/current/LegendModifier.html) to give context to the rendered series. Overall, the example illustrates how multiple renderable series can be enhanced with conditional data labels, palette customization, and interactive selection behavior.\n\n### Integration and Best Practices\nEven though this example is implemented in JavaScript, it demonstrates several best practices applicable across different frameworks. It uses the native event subscription model provided by SciChart.js modifiers (see [Common ChartModifiers Features](https://www.scichart.com/documentation/js/current/Common%20ChartModifiers%20Features.html)) and leverages the high-performance WebAssembly context for rendering. Developers can use these techniques to efficiently manage real-time interactions and achieve optimal performance when handling multiple series and complex user interactions. Overall, the implementation provides a solid foundation that can be extended or integrated into larger applications.",
            },
            react: {
                subtitle:
                    "Demonstrates how to **Select Data Points** on a chart using SciChart.js, High Performance JavaScript Charts",
                title: "React Chart Data Point Selection",
                pageTitle: "React Chart Data Point Selection",
                metaDescription:
                    "Demonstrates the DatapointSelectionModifier, which provides a UI to select one or many data points, and works with DataPointSelectionPaletteProvider to change the appearance of selected points",
                markdownContent:
                    "## React Chart Data Point Selection\n\n### Overview\nThis example demonstrates a React implementation of a high performance SciChart.js chart that enables interactive data point selection. The chart renders multiple spline line series with customizable point markers and annotations. Users can select individual or multiple data points and see real-time updates reflected in a separate list rendered alongside the chart. For futher details please see the [DataPoint Selection Documentation](https://www.scichart.com/documentation/js/current/DataPointSelection.html).\n\n### Technical Implementation\nThe chart is initialized using the `<SciChartReact/>` component, which is integrated into the React framework via an `initChart` callback. This callback, defined in the `drawExample.ts` file, sets up numeric axes, multiple `SplineLineRenderableSeries`, and customizes data point appearance using the `DataPointSelectionPaletteProvider`. To capture user interactions, the example adds a `DataPointSelectionModifier` to the chart that triggers a `selectionChanged` event. This event is then synchronized with React state using the `useState` hook, ensuring that selected points are displayed timely. Developers can learn more about integrating SciChart.js with React in the [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html) guide as well as the [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/) article.\n\n### Features and Capabilities\nThe core features of this example include interactive data point selection, customized palette styling for selected data points (denoted by `metadata.isSelected`), and dynamic annotations providing immediate feedback. The use of advanced series components like `SplineLineRenderableSeries` and point marker customization through `EPointMarkerType` enhances the chart's visual interactivity. For additional technical insights, the [React Chart Data Point Selection - SciChart.js Demo](https://www.scichart.com/demo/react/datapoint-selection) offers a live example, and the [DataPointSelectionModifier Documentation](https://www.scichart.com/documentation/js/current/DataPointSelection.html) provides detailed API guidance.\n\n### Integration and Best Practices\nEfficient React integration is achieved through the use of hooks such as `useState` and `useRef`, ensuring responsive layouts and optimal state management. The example demonstrates how to synchronize chart events with React state updates, enabling seamless user interactions and real-time data displays. This approach aligns with best practices for creating high-performance, interactive charts in React, as discussed in the [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/) article. Moreover, the example highlights how to effectively manage component responsiveness and event handling, ensuring the chart adapts cleanly to various display sizes.\n",
            },
            angular: {
                subtitle:
                    "Demonstrates how to **Select Data Points** on a chart using SciChart.js, High Performance JavaScript Charts",
                title: "Angular Chart Data Point Selection",
                pageTitle: "Angular Chart Data Point Selection",
                metaDescription:
                    "Demonstrates the DatapointSelectionModifier, which provides a UI to select one or many data points, and works with DataPointSelectionPaletteProvider to change the appearance of selected points",
                markdownContent:
                    "## Angular Chart Data Point Selection\n\n### Overview\nThis example demonstrates how to interactively select data points on a SciChart.js chart within an Angular application. It utilizes the `DataPointSelectionModifier` to allow users to click, CTRL+click, or drag-select points, providing immediate visual feedback on selected data. For further details on data point selection, refer to the [DataPoint Selection documentation](https://www.scichart.com/documentation/js/current/DataPointSelection.html).\n\n### Technical Implementation\nThe chart is initialized asynchronously using an async function that sets up numeric axes and multiple `SplineLineRenderableSeries`. Each series is enhanced with conditional styling via the `DataPointSelectionPaletteProvider` and a custom data label provider that only displays labels for selected points, denoted by `metadata.isSelected`. The implementation subscribes to the `selectionChanged` event, ensuring that the Angular component state is updated in real time.\n\n### Features and Capabilities\nThis example offers real-time updating of selected data points, which are displayed in an adjacent data table. It includes advanced features such as customizable point markers, dynamic annotations, and an integrated legend, all designed to enhance user interaction. The conditional styling provided by the `DataPointSelectionPaletteProvider` which is key to differentiating selected points, as detailed in the [DataPoint Selection documentation](https://www.scichart.com/documentation/js/current/DataPointSelection.html).\n\n### Integration and Best Practices\nIntegrating SciChart.js within an Angular environment is streamlined by embedding the chart initialization into an Angular component. The example demonstrates efficient event handling and state synchronization using Angular's data binding techniques. Developers can benefit from the [scichart-angular package](https://www.npmjs.com/package/scichart-angular) for additional guidance on best practices. Moreover, exploring [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) can help optimize the performance of applications handling multiple renderable series.\n",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/DataPointSelection.html",
                title: "SciChart.js DataPointSelectionModifier Documentation",
                linkTitle: "DataPointSelectionModifier documentation",
            },
        ],
        path: "datapoint-selection",
        metaKeywords: "datapoint, selection, api, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/TooltipsAndHittest/DatapointSelection",
        thumbnailImage: "javascript-datapoint-selection.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: false,
    };
//// End of computer generated metadata

export const dataPointSelectionExampleInfo = createExampleInfo(metaData);
export default dataPointSelectionExampleInfo;
