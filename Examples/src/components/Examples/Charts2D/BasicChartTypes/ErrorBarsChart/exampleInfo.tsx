import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "ErrorBarsChart",
        id: "chart2D_basicCharts_ErrorBarsChart",
        imagePath: "javascript-error-bars-chart.jpg",
        description:
            "This SciChart demo demonstrates how to create a **JavaScript Error Bars Chart** using SciChart.js our High Performance JavaScript Chart component.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "This SciChart demo demonstrates how to create a **JavaScript Error Bars Chart** using SciChart.js our High Performance JavaScript Chart component.",
                title: "JavaScript Error Bars Chart",
                pageTitle: "JavaScript Error Bars Chart |  Online Examples | SciChart.js",
                metaDescription:
                    "Create JavaScript Error Bars Chart using high performance SciChart.js. Display uncertainty or statistical confidence of a data-point. Get free demo now.",
                markdownContent:
                    "## JavaScript Error Bars Chart\n\n### Overview\nThis example demonstrates how to create a high performance **JavaScript Error Bars Chart** using SciChart.js in JavaScript. It visualizes data uncertainty with both vertical and horizontal error bars, providing developers with a clear method to represent statistical confidence and variability in data points.\n\n### Technical Implementation\nThe chart is initialized by creating a `SciChartSurface` with a WebAssembly context using the [SciChartSurface.create](https://www.scichart.com/documentation/js/current/SciChartSurface.create%20and%20createSingle.html) method. Axes are set up using the `NumericAxis` class with customized `growBy` settings to ensure proper spacing. Error bars are rendered using the `FastErrorBarsRenderableSeries`, which uses an `HlcDataSeries` to provide absolute error values. This approach follows best practices as outlined in [The Error Bars Chart](https://www.scichart.com/documentation/js/current/The%20Error%20Bars%20Chart%20Type.html) documentation. Additionally, a `SplineMountainRenderableSeries` with a gradient fill and scale animations (detailed in the [Spline (Smoothed) Mountain Series Type](https://www.scichart.com/documentation/js/current/The%20Spline%20(Smoothed)%20Mountain%20Series%20Type.html)) is implemented to add visual context and improve aesthetic appeal.\n\n### Features and Capabilities\nKey features of this implementation include dual error bars for both horizontal and vertical directions, smooth scale animations, and high performance rendering through WebGL. The example leverages interactive chart modifiers such as zooming and panning to offer users a dynamic and responsive experience. The integration of custom point markers further enhances the visualization, making it easier to identify specific data points.\n\n### Integration and Best Practices\nBuilt using JavaScript, this example emphasizes clean initialization and resource management. The chart is created within a dedicated function that returns a cleanup method to correctly dispose of the SciChartSurface, aligning with the guidelines found in [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html). This approach ensures that applications maintain optimal performance and prevent memory leaks. Developers are encouraged to explore the linked documentation for further details on initializing WebAssembly contexts, configuring numeric axes, and optimizing interactive chart performance.",
            },
            react: {
                subtitle:
                    "This SciChart demo demonstrates how to create a **React Error Bars Chart** using SciChart.js our High Performance JavaScript Chart component.",
                title: "React Error Bars Chart",
                pageTitle: "React Error Bars Chart |  Online Examples | SciChart.js",
                metaDescription:
                    "Create React Error Bars Chart using high performance SciChart.js. Display uncertainty or statistical confidence of a data-point. Get free demo now.",
                markdownContent:
                    '# React Error Bars Chart\n\n### Overview\nThis example demonstrates how to create an **Error Bars Chart** in a React application using SciChart.js. The implementation uses the `<SciChartReact/>` component to initialize the chart via the `drawExample` function, offering a high performance, interactive chart experience with both vertical and horizontal error bars.\n\n### Technical Implementation\nThe chart is set up by creating a `SciChartSurface` with preconfigured numeric axes and then adding multiple renderable series. A mountain series with a gradient fill is added for visual context, while two `FastErrorBarsRenderableSeries` are used to demonstrate both horizontal and vertical error bars. Data for error bars is generated dynamically using absolute values via `HlcDataSeries`. The chart also integrates smooth animations with the `EAnimationType` Scale configuration, providing a visually appealing entry effect. Developers looking to further understand the React integration can refer to the [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html) documentation.\n\n### Features and Capabilities\nKey features of this example include the use of both horizontal and vertical error bars to represent uncertainty in data points. The chart leverages performance optimizations through the `FastErrorBarsRenderableSeries`, ensuring that rendering remains efficient even with dynamic data updates. Additionally, the example showcases advanced customization such as gradient fills and custom point markers with `EllipsePointMarker`, enhancing the visual appeal. For further details about error bar configuration, see [The Error Bars Chart Type](https://www.scichart.com/documentation/js/current/The%20Error%20Bars%20Chart%20Type.html).\n\n### Integration and Best Practices\nThis example exemplifies best practices for integrating SciChart.js into a React application. The `<SciChartReact/>` component is used to initialize charts with the `drawExample` pattern, ensuring a clean separation between the React component and chart creation logic. Interactive chart modifiers such as `ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier` are incorporated to allow users to effortlessly explore the data. Developers interested in reactive chart integration and performance strategies should review [React Charts with SciChart.js: Introducing "SciChart React"](https://www.scichart.com/blog/react-charts-with-scichart-js/) and the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) documentation for advanced optimization techniques.\n',
            },
            angular: {
                subtitle:
                    "This SciChart demo demonstrates how to create a **Angular Error Bars Chart** using SciChart.js our High Performance JavaScript Chart component.",
                title: "Angular Error Bars Chart",
                pageTitle: "Angular Error Bars Chart |  Online Examples | SciChart.js",
                metaDescription:
                    "Create Angular Error Bars Chart using high performance SciChart.js. Display uncertainty or statistical confidence of a data-point. Get free demo now.",
                markdownContent:
                    "## Angular Error Bars Chart\n\n### Overview\nThe Angular Error Bars Chart example demonstrates how to integrate SciChart.js into an Angular standalone component to render a high performance chart with both vertical and horizontal error bars. This example uses the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package to embed the chart into an Angular application and showcases the use of interactive chart modifiers and advanced visual features.\n\n### Technical Implementation\nThe chart is initialized inside an Angular standalone component through a call to a dedicated `drawExample` function. The implementation configures numeric axes, data series for plotting error bars, and an optional animated `SplineMountainRenderableSeries` for added visual context. The error bars are implemented via `FastErrorBarsRenderableSeries` using absolute values provided by an `HlcDataSeries`. Interactive behaviors such as panning, zoom extents, and mouse wheel zoom are added using `ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier`. Developers can refer to the [Tutorial 01 - Setting up a npm Project with SciChart.js](https://www.scichart.com/documentation/js/current/Tutorial%2001%20-%20Setting%20up%20a%20Project%20with%20SciChart.js.html) for additional context on project configuration and integration techniques.\n\n### Features and Capabilities\nThe example demonstrates real-time chart customization using animated transitions (with `EAnimationType` Scale) and dual error bar representations in both vertical and horizontal directions. The chart includes advanced customizations such as gradient fills in the mountain series and custom point markers to highlight data points. The detailed configuration of error bars is aligned with the guidelines provided in [The Error Bars Chart Type](https://www.scichart.com/documentation/js/current/The%20Error%20Bars%20Chart%20Type.html), ensuring that uncertainty and statistical confidence are visualized accurately.\n\n### Integration and Best Practices\nThis implementation leverages Angular's standalone component architecture to simplify integration with third-party libraries. By using the [standalone components guide](https://angular.io/guide/standalone-components), the example maintains a clean separation of concerns, ensuring that chart initialization and lifecycle management occur efficiently. The interactivity of the chart, such as zooming and panning, is handled elegantly within the Angular component, encouraging developers to explore advanced topics like data binding and performance optimization. For more insights into managing component lifecycles in Angular, refer to the [Component Lifecycle - Angular](https://angular.io/guide/lifecycle-hooks) documentation. Additionally, users can further optimize chart performance by exploring techniques described in [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html).\n\nThis example serves as a solid foundation for developers looking to integrate high performance charts with error bars into Angular applications, providing clear guidance on both configuration and best practices.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20Error%20Bars%20Chart%20Type.html",
                title: "This specific page in the JavaScript Error Bars Chart documentation will help you to get started",
                linkTitle: "JavaScript Impulse Chart Documentation",
            },
        ],
        path: "error-bars-chart",
        metaKeywords: "error, bars, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/ErrorBarsChart",
        thumbnailImage: "javascript-error-bars-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

const errorBarsChartExampleInfo = createExampleInfo(metaData);
export default errorBarsChartExampleInfo;
