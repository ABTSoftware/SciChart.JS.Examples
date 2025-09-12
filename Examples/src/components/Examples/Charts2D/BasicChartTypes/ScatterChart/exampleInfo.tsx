import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "ScatterChart",
        id: "chart2D_basicCharts_ScatterChart",
        imagePath: "javascript-scatter-chart.jpg",
        description:
            "We have created an example that demonstrates how to create a **JavaScript Scatter Chart** using SciChart.js",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "We have created an example that demonstrates how to create a **JavaScript Scatter Chart** using SciChart.js",
                title: "JavaScript Scatter Chart",
                pageTitle: "JavaScript Scatter Chart | JavaScript Charts",
                metaDescription:
                    "Create JavaScript Scatter Chart with high performance SciChart.js. Easily render pre-defined point types. Supports custom shapes. Get your free trial now. ",
                markdownContent:
                    "## Scatter Chart with JavaScript\n\n### Overview\nThis example demonstrates a high-performance **Scatter Chart** built using SciChart.js in a JavaScript environment. It showcases the creation of a chart with two distinct data series that use custom point markers and smooth animated transitions to visually differentiate and highlight data points.\n\n### Technical Implementation\nThe chart is initialized asynchronously by invoking the SciChart.js API via the WASM context, ensuring optimal rendering performance. The example creates `NumericAxis`, generates dynamic data using array mapping, and sets up two scatter series with `XyScatterRenderableSeries` with custom markers (Ellipse and Triangle) using classes like `EllipsePointMarker` and `TrianglePointMarker`. For more details on asynchronous initialization, refer to the [Tutorial 01 - Including SciChart.js in an HTML Page using CDN](https://www.scichart.com/documentation/js/current/Tutorial01IncludingSciChartjsHTMLPage.html). Additionally, the integration of the WebAssembly context is explained in the [Creating a new SciChartSurface and loading Wasm](https://www.scichart.com/documentation/js/current/SciChartSurface.create%20and%20createSingle.html) documentation. Smooth transitions are achieved via the [SweepAnimation](https://www.scichart.com/documentation/js/current/typedoc/classes/sweepanimation.html) class, ensuring the animations are both visually appealing and performant.\n\n### Features and Capabilities\nThe example highlights several advanced features including the use of interactive modifiers such as `ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier` to facilitate user-friendly data exploration. Custom point markers are implemented as per the guidelines found in [Drawing PointMarkers on Series](https://www.scichart.com/documentation/js/current/DrawingPointMarkersOnSeries.html), allowing for differentiated visual styling of data series. The efficient setup of dynamic data series ensures that the chart remains responsive and adaptable to real-time data updates.\n\n### Integration and Best Practices\nIntegration with the DOM is handled directly in JavaScript, where the SciChart surface is created on a specified root element and resource cleanup is managed via a destructor function, following the best practices outlined in [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html). Developers are encouraged to leverage these techniques to ensure robust performance and efficient memory management while working with high-performance charting libraries. The example serves as a guide for utilizing SciChart.js without any additional frameworks, demonstrating how to achieve high performance and interactivity using native JavaScript methods.",
            },
            react: {
                subtitle:
                    "We have created an example that demonstrates how to create a **React Scatter Chart** using SciChart.js",
                title: "React Scatter Chart",
                pageTitle: "React Scatter Chart | JavaScript Charts",
                metaDescription:
                    "Create React Scatter Chart with high performance SciChart.js. Easily render pre-defined point types. Supports custom shapes. Get your free trial now. ",
                markdownContent:
                    "## React Scatter Chart Example\n\n### Overview\nThis example demonstrates how to create a high performance [scatter chart](https://www.scichart.com/documentation/js/current/The%20Scatter%20Series%20Type.html) within a React application using SciChart.js. It sets up a chart with two distinct scatter series that use custom point markers and animated transitions to enhance data visualization.\n\n### Technical Implementation\nThe chart is created asynchronously by invoking the SciChart.js API via a WASM context for optimized rendering performance. In this example, `NumericAxis` are added to a `SciChartSurface` and two `XyScatterRenderableSeries` are plotted using pointmarkers provided by `EllipsePointMarker` and `TrianglePointMarker` classes. The implementation follows asynchronous programming practices as described in [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html), ensuring efficient initialization and resource management.\n\n### Features and Capabilities\nThe chart offers several advanced features including custom point markers and smooth animations. Each scatter series employs `SweepAnimation` to create animated transitions for the data points, as detailed in the [SweepAnimation Documentation](https://www.scichart.com/documentation/js/current/Series%20Startup%20Animations.html). Interactive modifiers such as `ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier` enable intuitive chart navigation, with further insights provided by the [ZoomPanModifier Documentation](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html). Additionally, the use of different marker types is aligned with the practices outlined in [Drawing PointMarkers on Series](https://www.scichart.com/documentation/js/current/DrawingPointMarkersOnSeries.html).\n\n### Integration and Best Practices\nIntegrating SciChart.js into a React application is streamlined by the use of the `<SciChartReact/>` component, which encapsulates and abstracts away the complexities of chart creation. The example demonstrates how to effectively manage component lifecycle and asynchronous operations, while leveraging the WASM context for enhanced performance. Developers are encouraged to explore best practices for React integration and performance optimization as shared in [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/) and [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/).",
            },
            angular: {
                subtitle:
                    "We have created an example that demonstrates how to create a **Angular Scatter Chart** using SciChart.js",
                title: "Angular Scatter Chart",
                pageTitle: "Angular Scatter Chart | JavaScript Charts",
                metaDescription:
                    "Create Angular Scatter Chart with high performance SciChart.js. Easily render pre-defined point types. Supports custom shapes. Get your free trial now. ",
                markdownContent:
                    "## Angular Scatter Chart\n\n### Overview\nThis example demonstrates how to integrate high-performance SciChart.js into an Angular application using a standalone component. The Angular implementation renders two scatter series with distinct custom point markers and smooth animated transitions to facilitate effective data visualization.\n\n### Technical Implementation\nThe chart is initialized asynchronously via a custom function that creates a SciChart surface using a WebAssembly (WASM) context. `NumericAxis` are configured with options such as custom `growBy` settings, and data series are plotted using a `XyScatterRenderableSeries` with custom point markers like the Ellipse and Triangle variants. By leveraging the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package along with Angular standalone components as explained in the [Getting started with standalone components - Angular](https://angular.io/guide/standalone-components) guide, the example demonstrates best practices for asynchronous chart initialization as detailed in [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/).\n\n### Features and Capabilities\nThe implementation provides advanced features including custom point markers for distinct scatter series, smooth animated transitions using the [SweepAnimation](https://www.scichart.com/documentation/js/current/typedoc/classes/sweepanimation.html) class, and interactive modifiers such as `ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier`. These capabilities ensure that the rendered chart is not only visually appealing but also enables intuitive user interaction.\n\n### Integration and Best Practices\nIntegrating SciChart.js in Angular is streamlined with the use of standalone components, reducing boilerplate and facilitating a modern Angular architecture. The asynchronous initialization approach enhances performance by ensuring that resource loading is managed efficiently. Moreover, using a WASM context as explained in [Deploying Wasm or WebAssembly and Data Files with your app](https://www.scichart.com/documentation/js/current/Deploying%20Wasm%20or%20WebAssembly%20and%20Data%20Files%20with%20your%20app.html) leads to fast rendering performance. The inclusion of interactive modifiers follows guidelines from the [Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html) tutorial, ensuring that users can effectively explore the data. Overall, the example highlights key best practices for integrating third-party charting libraries into Angular applications.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20Scatter%20Series%20Type.html",
                title: "This specific page in the JavaScript Scatter Chart documentation will help you to get started",
                linkTitle: "JavaScript Scatter Chart Documentation",
            },
        ],
        path: "scatter-chart",
        metaKeywords: "scatter, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/ScatterChart",
        thumbnailImage: "javascript-scatter-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: false
    };
//// End of computer generated metadata

const scatterChartExampleInfo = createExampleInfo(metaData);
export default scatterChartExampleInfo;
