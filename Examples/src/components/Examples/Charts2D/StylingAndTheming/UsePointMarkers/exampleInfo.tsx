import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DStylingAndThemingUsePointMarkers",
        imagePath: "javascript-chart-custom-pointmarkers.jpg",
        description:
            "Demonstrates how to create **custom data-point markers** on scatter/line series using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to create **custom data-point markers** on scatter/line using SciChart.js, High Performance JavaScript Charts",
                title: "JavaScript Point-Markers Chart",
                pageTitle: "JavaScript Point-Markers Chart",
                metaDescription:
                    "Demonstrates the different point-marker types for JavaScript Scatter charts (Square, Circle, Triangle and Custom image point-marker)",
                markdownContent:
                    "## Use Point Markers in JavaScript\n\n### Overview\nThis example demonstrates how to render custom **data-point markers** using SciChart.js in a JavaScript application. It showcases a variety of marker types including Ellipse, Square, Triangle, Cross, and a custom image marker using that is loaded asynchronously. The example also illustrates how to handle gaps in the data by setting specific data points to NaN.\n\n### Technical Implementation\nThe chart is initialized asynchronously using the `SciChartSurface.create()` method, which efficiently loads the required WebAssembly resources for high-performance rendering. Multiple data series are generated with the `XyDataSeries` class and rendered using the `SplineLineRenderableSeries` for smooth, interpolated lines. Each data series is enhanced with a unique point marker implemented via classes such as `EllipsePointMarker`, `SquarePointMarker`, `TrianglePointMarker`, `CrossPointMarker`, and `SpritePointMarker`. The custom image marker leverages asynchronous image loading using the `createImageAsync()` function. Additionally, the implementation intentionally introduces a data gap by updating a data point to NaN, demonstrating how SciChart.js handles missing values as explained in the [Drawing Gaps in Series](https://www.scichart.com/documentation/js/current/DrawingGapsInSeries.html) documentation.\n\n### Features and Capabilities\nThis example emphasizes high-performance chart rendering using WebGL along with real-time update capabilities and advanced interactivity. Interactive modifiers such as `ZoomPanModifier` and `MouseWheelZoomModifier` are integrated to allow smooth zooming and panning. Each renderable series is uniquely styled to clearly differentiate between the various data sets, even when data gaps occur.\n\n### Integration and Best Practices\nIntegrating SciChart.js into a JavaScript application is straightforward. The asynchronous initialization approach, as detailed in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide and the [Including SciChart.js in an HTML Page using CDN](https://www.scichart.com/documentation/js/current/Tutorial01IncludingSciChartjsHTMLPage.html) tutorial, ensures that all necessary assets are loaded efficiently. By modularizing the chart creation logic and handling asynchronous image loading properly, developers can achieve a maintainable and high-performance charting solution that follows best practices for real-time data visualization.",
            },
            react: {
                subtitle:
                    "Demonstrates how to create **custom data-point markers** on scatter/line using SciChart.js, High Performance React Charts",
                title: "React Point-Markers Chart",
                pageTitle: "React Point-Markers Chart",
                metaDescription:
                    "Demonstrates the different point-marker types for React Scatter charts (Square, Circle, Triangle and Custom image point-marker)",
                markdownContent:
                    "## React Use Point Markers Example\n\n### Overview\nThis example demonstrates how to render custom data point markers in a React application using the SciChart.js library. It showcases various marker types including ellipse, square, triangle, cross, and a custom image marker loaded asynchronously.\n\n### Technical Implementation\nThe implementation leverages the [SciChartReact](https://www.scichart.com/blog/react-charts-with-scichart-js/) component to integrate SciChart.js with React. An asynchronous initialization function sets up the `SciChartSurface` with numeric axes and multiple renderable series using `SplineLineRenderableSeries`. Each series uses a distinct point marker (such as `EllipsePointMarker`, `SquarePointMarker`, `TrianglePointMarker`, `CrossPointMarker`, and `SpritePointMarker` for custom images which can be loaded by `createImageAsync()`) to highlight customization. The example also intentionally introduces a gap in the data (using NaN values) to demonstrate proper handling of missing data. Additional chart modifiers including `ZoomPanModifier`, `MouseWheelZoomModifier`, and `ZoomExtentsModifier` enhance user interactivity. For in-depth details on implementing custom point markers, refer to the [Drawing PointMarkers on Series documentation](https://www.scichart.com/documentation/js/current/DrawingPointMarkersOnSeries.html).\n\n### Features and Capabilities\nKey features of this example include the ability to render multiple custom markers in a high-performance WebGL environment, asynchronous image handling for custom markers, and robust interactivity through integrated chart modifiers. These capabilities enable real-time updates and smooth rendering performance, as detailed in resources like the [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/) article.\n\n### Integration and Best Practices\nThe example illustrates best practices for React integration by encapsulating chart logic within the `<SciChartReact/>` component and an async initialization function, ensuring modular and scalable code. The approach adheres to recommended techniques for asynchronous data handling and interactive chart controls in React. Developers are encouraged to explore further guidance in the [React Charts with SciChart.js blog post](https://www.scichart.com/blog/react-charts-with-scichart-js/) to optimize their implementations.",
            },
            angular: {
                subtitle:
                    "Demonstrates how to create **custom data-point markers** on scatter/line charts using SciChart.js, High Performance Angular Charts",
                title: "Angular Point-Markers Chart",
                pageTitle: "Angular Point-Markers Chart",
                metaDescription:
                    "Demonstrates the different point-marker types for Angular Scatter charts (Square, Circle, Triangle and Custom image point-marker)",
                markdownContent:
                    "## Use Point Markers in Angular\n\n### Overview\nThis example demonstrates how to render custom **data-point markers** using SciChart.js within an Angular standalone component. It showcases a range of marker types including ellipse, square, triangle, cross, and a custom image marker, each applied to separate data series. Gaps in the data are intentionally introduced to demonstrate how the markers handle missing values.\n\n### Technical Implementation\nThe chart is initialized asynchronously using `SciChartSurface.create()`, which loads necessary WebAssembly resources as detailed in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide. The component employs the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package to integrate SciChart.js with Angular, binding the asynchronous initialization function directly in the template. Multiple renderable series are instantiated using `SplineLineRenderableSeries`, each with its own point marker set via classes such as `EllipsePointMarker`, `SquarePointMarker`, `TrianglePointMarker`, `CrossPointMarker`, and `SpritePointMarker`.\n\n### Features and Capabilities\nThis example illustrates the ability to render high-performance charts with custom visual styles for each data series. Advanced features include real-time update capabilities supported by smooth WebGL rendering and interactive modifications through built-in modifiers like `ZoomPanModifier` and `MouseWheelZoomModifier`. The implementation further demonstrates handling asynchronous image loading for custom markers. For detailed marker configuration, refer to the [SciChart.js PointMarkers Documentation](https://www.scichart.com/documentation/js/current/DrawingPointMarkersOnSeries.html).\n\n### Integration and Best Practices\nBy leveraging Angular’s component architecture, this example shows best practices for importing and configuring third-party libraries. It emphasizes asynchronous chart initialization and effective data binding within Angular standalone components. Developers interested in integrating SciChart to Angular can use the `ScichartAngularComponent` from the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package on npm.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/DrawingPointMarkersOnSeries.html",
                title: "SciChart.js PointMarkers Documentation",
                linkTitle: "Point-Markers API documentation",
            },
        ],
        path: "chart-custom-pointmarkers",
        metaKeywords: "data, point, marker, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/StylingAndTheming/UsePointMarkers",
        thumbnailImage: "javascript-chart-custom-pointmarkers.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const usePointMarkersExampleInfo = createExampleInfo(metaData);
