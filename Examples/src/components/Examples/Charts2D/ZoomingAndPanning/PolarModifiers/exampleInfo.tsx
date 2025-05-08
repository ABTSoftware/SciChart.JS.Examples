import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "PolarModifiers",
        id: "chart2D_zoomAndPanAChart_PolarModifiers",
        imagePath: "polar-modifiers.jpg",
        description:
            "Zoom the real-time chart below by dragging on the surface. Right click and drag to pan. Then double-click to reset zoom and start automatically scrolling again.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Zoom the real-time chart below by dragging on the surface. Right click and drag to pan. Then double-click to reset zoom and start automatically scrolling again.",
                title: "Polar Modifiers JavaScript Chart",
                pageTitle: "Polar Modifiers JavaScript Chart",
                metaDescription:
                    "Demonstrates how to Polar Modifiers JavaScript Chart while it is updating, with SciChart.js ZoomState API",
                markdownContent:
                    "## Realtime Chart Zoom Pan - JavaScript\n\n### Overview\nThis example demonstrates a real-time updating chart built with SciChart.js using JavaScript. The primary focus is on rendering a dynamic X-Y chart that displays updating sine and cosine data in real time. By leveraging a WebAssembly context via the `SciChartSurface` API, the example achieves high performance in rendering and interactive data visualization.\n\n### Technical Implementation\nThe chart is initialized by calling the asynchronous method `SciChartSurface.create()`, which creates both the `SciChartSurface` and its associated WebAssembly context. Axes are created as instances of `NumericAxis` and added to the chart. Two types of renderable series are used: a `FastLineRenderableSeries` for the sine data and an `XyScatterRenderableSeries` for the cosine data. Data is stored in `XyDataSeries` objects that are preallocated with a specified capacity; this preallocation is a key performance optimization described in the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) section of the documentation.\n\nReal-time updates are implemented using JavaScript’s `setInterval` to append new data points at a 60Hz frequency. The update function uses the `dataSeries.append` method to add points, and if the user is not interacting by zooming (as determined via the `zoomState` property), the `visibleRange` of the xAxis is updated to auto-scroll the view. For more details on real-time data updates, see the [DataSeries Realtime Updates](https://www.scichart.com/documentation/js/current/DataSeries_RealtimeUpdates.html) documentation.\n\nInteractive behavior is enabled through the use of chart modifiers. The example adds a [RubberBandXyZoomModifier](https://www.scichart.com/documentation/js/current/RubberBandXyZoomModifier.html) to allow users to perform intuitive zooming and a [ZoomPanModifier](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html) configured to execute on the **mouse right button** for panning. Additionally, a `ZoomExtentsModifier` is added with animations disabled for a smoother real-time experience; refer to the [ZoomExtentsModifier](https://www.scichart.com/documentation/js/current/ZoomExtentsModifier.html) documentation for further information.\n\n### Features and Capabilities\n**Real-time Updates:** The example continuously appends sine and cosine data points using a timer, resulting in a live updating chart that auto-scrolls when not being manually zoomed.\n\n**Interactivity:** Users can interact with the chart via rubber band zoom and right-button pan, making full use of the interactive modifier system built into SciChart.js.\n\n**Performance Optimizations:** Preallocating capacity in the `XyDataSeries` improves update performance and reduces memory reallocations. The use of a WebAssembly context ensures that rendering remains fast even under high update rates.\n\n### Integration and Best Practices\nWhile this example is implemented in JavaScript, similar approaches are used across frameworks like React and Angular, where the core charting engine remains the same. Best practices such as proper initialization using `SciChartSurface.create()`, efficient real-time data handling with `dataSeries.`append, and effective resource cleanup via a destructor function (`sciChartSurface.delete()`) are emphasized. Developers are encouraged to explore additional practices, such as managing the zoom state for auto-scrolling, detailed in the [Tutorial 05 - Zoom and Pan with Realtime Updates](https://www.scichart.com/documentation/js/current/Tutorial%2005%20-%20Zoom%20and%20Pan%20with%20Realtime%20Updates.html) documentation.\n\nThis example serves as a comprehensive guide for creating fast, interactive, and real-time charting applications with SciChart.js using JavaScript.",
            },
            react: {
                subtitle:
                    "Zoom the real-time chart below by dragging on the surface. Right click and drag to pan. Then double-click to reset zoom and start automatically scrolling again.",
                title: "Polar Modifiers React Chart",
                pageTitle: "Polar Modifiers React Chart",
                metaDescription:
                    "Demonstrates how to Polar Modifiers React Chart while it is updating, with SciChart.js ZoomState API",
                markdownContent:
                    "## Realtime Chart Zoom and Pan - React Example\n\n### Overview\nThis example demonstrates a realtime chart with dynamic data updates using SciChart.js within a React application. The chart continuously displays sine and cosine data while allowing users to interact through zooming and panning.\n\n### Technical Implementation\nThe chart is initialized using the `<SciChartReact/>` component, which calls an asynchronous function to create a `SciChartSurface` and associated WebAssembly context. Data is handled by updating two `XyDataSeries` in real time via a 60Hz interval. Interactive behaviors are added through modifiers such as the [ZoomPanModifier](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html) for panning with the **right mouse button** and [RubberBandXyZoomModifier](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html) for zooming. These modifiers ensure that the visible range of the x-axis is updated dynamically unless the user is actively zooming (determined via the `zoomState` property), ensuring smooth performance.\n\n### Features and Capabilities\nThe example highlights several advanced features, including realtime data updates and interactive chart manipulation. It efficiently appends new data points to both the line and scatter series, while maintaining performance by updating the visible range only when appropriate. The use of WebAssembly via the `SciChartSurface` greatly enhances rendering efficiency, ensuring that the chart remains responsive even with continuous data updates.\n\n### Integration and Best Practices\nIntegration with React is achieved by encapsulating the chart creation and update logic within the `<SciChartReact/>` component. The `onInit` and `onDelete` callbacks are used to start and stop the realtime data updates, ensuring that resources are managed correctly during the component lifecycle. This approach follows [best practices for React integration](https://www.scichart.com/blog/react-charts-with-scichart-js/) and highlights efficient performance optimization techniques. For additional insights on realtime chart updates, refer to the [Advanced Realtime React Charts](https://www.scichart.com/react-charts/) documentation, and to understand more about state management with WebAssembly in SciChart, see the [SciChartSurface API Documentation](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html).",
            },
            angular: {
                subtitle:
                    "Zoom the real-time chart below by dragging on the surface. Right click and drag to pan. Then double-click to reset zoom and start automatically scrolling again.",
                title: "Polar Modifiers Angular Chart",
                pageTitle: "Polar Modifiers Angular Chart",
                metaDescription:
                    "Demonstrates how to Polar Modifiers Angular Chart while it is updating, with SciChart.js ZoomState API",
                markdownContent:
                    "## Realtime Chart Zoom and Pan - Angular Example\n\n### Overview\nThis example demonstrates a real-time chart in an Angular application using SciChart.js. The purpose is to display continuously updating sine and cosine data while allowing the user to interact with the chart through zooming and panning.\n\n### Technical Implementation\nThe implementation uses a standalone Angular component that integrates the [scichart-angular](https://www.scichart.com/getting-started/scichart-javascript/) for chart integration to Angular. The chart is asynchronously initialized via the `drawExample` function, which creates a `SciChartSurface` with an associated WebAssembly context. It sets up numeric axes, a line series, and a scatter series, and assigns interactive modifiers such as the [RubberBandXyZoomModifier](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html) for zooming and the [ZoomPanModifier](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html) for right-click panning. Real-time data updates are implemented using setInterval at approximately 60Hz, reflecting best practices discussed in the [Adding Realtime Updates](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html) tutorial.\n\n### Features and Capabilities\nThe example offers advanced real-time capabilities by dynamically appending new data points to both the sine (line) and cosine (scatter) series. It automatically adjusts the `visibleRange` of the x-axis when the user is not actively zooming (denoted by `zoomState` property), ensuring smooth scrolling but allowing zooming to freeze scrolling.\n\n### Integration and Best Practices\nThe Angular integration leverages input bindings, the chart initialization function is passed to the `ScichartAngularComponent`, enabling asynchronous creation of the chart. Additionally, careful attention is paid to lifecycle management, ensuring appropriate resource cleanup and efficient real-time rendering. This example serves as a robust template for integrating high-performance, interactive charts within Angular applications using SciChart.js.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/ZoomPanModifier.html",
                title: "Zoom and Pan Modifier Documentation",
                linkTitle: "SciChart.js Zooming and Panning Documentation",
            },
        ],
        path: "polar-modifiers",
        metaKeywords: "polar, modifiers, zoom, scale, pan, scale, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/ZoomingAndPanning/PolarModifiers",
        thumbnailImage: "polar-modifiers.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const PolarModifiersExampleInfo = createExampleInfo(metaData);
export default PolarModifiersExampleInfo;
