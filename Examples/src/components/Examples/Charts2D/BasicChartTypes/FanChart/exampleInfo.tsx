import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DBasicChartTypesFanChart",
        imagePath: "javascript-fan-chart.jpg",
        description:
            "Here we demonstrate how to create a **JavaScript Fan Chart** using SciChart.js. Zoom in and out to see the detail you can go to using our JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Here we demonstrate how to create a **JavaScript Fan Chart** using SciChart.js. Zoom in and out to see the detail you can go to using our JavaScript Charts",
                title: "JavaScript Fan Chart",
                pageTitle: "JavaScript Fan Chart | JavaScript Chart Library | View Now",
                metaDescription:
                    "Discover how to create JavaScript Fan Chart with SciChart. Zoom in to see the detail you can go to using our JavaScript Charts. Get your free demo today. ",
                markdownContent:
                    "# Fan Chart Example in Vanilla JavaScript\n\n### Overview\nThis example demonstrates how to create a sophisticated fan chart using SciChart.js with vanilla JavaScript. The chart visualizes actual data alongside forecast variance by combining a spline line series with multiple spline band series, providing an intuitive visualization of trend and variance data over time.\n\n### Technical Implementation\nThe chart is initialized asynchronously using SciChartSurface.create, ensuring that the WebGL-based rendering engine and the underlying WebAssembly context are set up efficiently. This asynchronous approach is detailed in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide. The fan chart effect is achieved by rendering an actual data line via SplineLineRenderableSeries and overlaying it with progressively opaque band series using SplineBandRenderableSeries, as described in [The Fan Charts Type documentation](https://www.scichart.com/documentation/js/current/The%20Fan%20Charts%20Type.html).\n\n### Features and Capabilities\nThe implementation incorporates interactive modifiers such as ZoomPanModifier and MouseWheelZoomModifier, enabling smooth zooming and panning interactions. Additionally, it applies a WaveAnimation for smooth transition effects, while the use of XyyDataSeries enables rendering of the band charts that illustrate forecast variance. For a deeper understanding of the data series used, developers can refer to the [XyyDataSeries API documentation](https://www.scichart.com/documentation/js/current/typedoc/classes/xyydataseries.html).\n\n### Integration and Best Practices\nBest practices such as efficient resource management are observed by encapsulating the chart creation in an asynchronous function and ensuring proper cleanup using sciChartSurface.delete. Performance optimization is a key consideration, with high-performance WebAssembly rendering capabilities that are further explained in the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) and [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) guides. These practices help maintain responsiveness even when handling complex chart rendering and dynamic data updates.\n",
            },
            react: {
                subtitle:
                    "Here we demonstrate how to create a **React Fan Chart** using SciChart.js. Zoom in and out to see the detail you can go to using our JavaScript Charts",
                title: "React Fan Chart",
                pageTitle: "React Fan Chart | JavaScript Chart Library | View Now",
                metaDescription:
                    "Discover how to create React Fan Chart with SciChart. Zoom in to see the detail you can go to using our JavaScript Charts. Get your free demo today. ",
                markdownContent:
                    "# React Fan Chart\n\n### Overview\nThis example demonstrates how to implement a fan chart using SciChart.js in a React environment. The chart visualizes both actual data and forecast variance by combining a spline line series with multiple spline band series. The implementation leverages the SciChartReact component to integrate seamlessly into a React application.\n\n### Technical Implementation\nThe chart initialization is handled asynchronously using the SciChartSurface.create method. The drawExample function sets up the chart by creating numeric axes, appending data to both XyDataSeries and XyyDataSeries, and then applying a wave animation for smooth transitions. This asynchronous pattern ensures reliable initialization, following best practices as discussed in [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html). The variance data is generated dynamically, demonstrating how developers can leverage JavaScript to feed live data into SciChart.js.\n\n### Features and Capabilities\nThe example combines multiple SciChart.js features including spline line and band renderable series to create a layered fan chart effect. It offers interactive capabilities such as zooming and panning by integrating modifiers like ZoomExtentsModifier, ZoomPanModifier, and MouseWheelZoomModifier. The detailed annotation setup using TextAnnotation adds context to the visualized data, highlighting both actual and forecast variance. For more detailed insights into fan chart implementations, please refer to [The Fan Charts Type](https://www.scichart.com/documentation/js/current/The%20Fan%20Charts%20Type.html).\n\n### Integration and Best Practices\nIntegration with React is streamlined through the SciChartReact component, which encapsulates resource management and lifecycle events to prevent memory leaks. Developers are encouraged to review techniques for resource management and asynchronous initialization as outlined in [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/). Additionally, the example applies performance optimization techniques by utilizing WebAssembly for rendering and applying efficient animations with WaveAnimation. For further reading on performance optimization, consult the [SciChart.js JavaScript Charts User Manual](https://www.scichart.com/documentation/js/current/SciChart_JS_User_Manual.html).",
            },
            angular: {
                subtitle:
                    "Here we demonstrate how to create a **Angular Fan Chart** using SciChart.js. Zoom in and out to see the detail you can go to using our JavaScript Charts",
                title: "Angular Fan Chart",
                pageTitle: "Angular Fan Chart | JavaScript Chart Library | View Now",
                metaDescription:
                    "Discover how to create Angular Fan Chart with SciChart. Zoom in to see the detail you can go to using our JavaScript Charts. Get your free demo today. ",
                markdownContent:
                    "# Angular Fan Chart\n\n### Overview\nThis Angular example demonstrates how to implement a fan chart using SciChart.js within a standalone Angular component. The chart visualizes both actual data and forecast variance by combining a spline line series with multiple spline band series. The integration leverages the [scichart-angular](https://www.npmjs.com/package/scichart-angular) component to dynamically render advanced charts in an Angular environment.\n\n### Technical Implementation\nIn this example, the Angular standalone component makes use of asynchronous initialization through its input binding; the component passes the drawExample function to the scichart-angular component. Inside drawExample, the chart is set up using SciChartSurface.create which not only initializes the WebGL-based rendering engine but also returns a WebAssembly context for high performance rendering. Developers can consult the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide as well as the [Deploying Wasm (WebAssembly) and Data Files with your app](https://www.scichart.com/documentation/js/current/Deploying%20Wasm%20or%20WebAssembly%20and%20Data%20Files%20with%20your%20app.html) documentation to understand these core concepts.\n\n### Features and Capabilities\nThe fan chart combines a spline line series for actual data with three spline band series that provide progressively higher opacity bands to visualize forecast variance. Interactive modifiers such as ZoomExtentsModifier, ZoomPanModifier, and MouseWheelZoomModifier are integrated for intuitive chart interactions like zooming and panning. These interactive features enhance the user experience and allow detailed inspection of the data.\n\n### Integration and Best Practices\nThis example makes efficient use of Angular’s data binding and asynchronous patterns to manage chart initialization as highlighted in discussions like [How to deal with async initialized data in Angular component?](https://stackoverflow.com/questions/76841802/how-to-deal-with-async-initialized-data-in-angular-component). In addition, the approach emphasizes proper resource management by encapsulating chart creation within a standalone component, facilitating easy integration and cleanup in Angular applications. The use of WebAssembly for rendering underscores performance optimization, ensuring smooth animations and rendering with minimal overhead. For further best practices in Angular component design and lifecycle management, developers are encouraged to review Angular’s official [Component Lifecycle](https://angular.io/guide/lifecycle-hooks) documentation.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20Fan%20Charts%20Type.html",
                title: "The specific page for the JavaScript Fan Chart documentation will help you to get started",
                linkTitle: "JavaScript Fan Chart Documentation",
            },
        ],
        path: "fan-chart",
        metaKeywords: "fan, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/FanChart",
        thumbnailImage: "javascript-fan-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const fanChartExampleInfo = createExampleInfo(metaData);
