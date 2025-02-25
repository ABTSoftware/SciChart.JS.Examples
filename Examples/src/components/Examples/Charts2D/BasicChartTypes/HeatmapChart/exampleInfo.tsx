import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DBasicChartTypesHeatmapChart",
        imagePath: "javascript-heatmap-chart.jpg",
        description:
            "If you want to learn about heatmaps. this demo shows you how to create a **JavaScript Heatmap Chart** using SciChart.js, our 5-star rated JavaScript Chart Component.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "If you want to learn about heatmaps. this demo shows you how to create a **JavaScript Heatmap Chart** using SciChart.js, our 5-star rated JavaScript Chart Component.",
                title: "JavaScript Heatmap Chart",
                pageTitle: "JavaScript Heatmap Chart | JavaScript Chart Library Examples",
                metaDescription:
                    "Easily create a high performance JavaScript Heatmap Chart with SciChart. Get your free trial of our 5-star rated JavaScript Chart Component today.",
                markdownContent:
                    "## Heatmap Chart Example - Vanilla JavaScript\n\n### Overview\nThis example demonstrates a high-performance **Heatmap Chart** implemented using vanilla JavaScript with SciChart.js. The implementation focuses on real-time data streaming and dynamic visual updates, leveraging WebGL-powered rendering for optimal performance.\n\n### Technical Implementation\nThe chart is built by creating a SciChartSurface instance via the SciChart.js API, and hidden numeric axes are added to simplify the presentation. The example generates a two-dimensional array of data which is fed to a UniformHeatmapDataSeries. A UniformHeatmapRenderableSeries is then configured with a detailed gradient via HeatmapColorMap to accurately represent the data. Real-time updates are managed using JavaScript’s setTimeout to continuously update the series, as explained in the [Adding Realtime Updates](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html) documentation.\n\n### Features and Capabilities\nKey features include real-time chart updates with dynamic data streaming, advanced color mapping techniques, and integrated performance monitoring. The color mapping is finely tuned using gradient stops which you can learn more about in the [Uniform Heatmap Chart documentation](https://www.scichart.com/documentation/js/current/The-Uniform-Heatmap-Chart-Type.html) and [Uniform-Heatmap-Colormaps](https://www.scichart.com/documentation/js/current/Uniform-Heatmap-Colormaps.html) resources. In addition, interactive modifiers such as zoom, pan, and mouse wheel zoom enhance the user experience.\n\n### Integration and Best Practices\nBuilt on vanilla JavaScript, this example adheres to best practices by directly interacting with the SciChart.js API without relying on additional frameworks. Developers can monitor performance by subscribing to render events, a technique detailed in the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) guide. Furthermore, interactive features are implemented using modifiers like the [MouseWheelZoomModifier](https://www.scichart.com/documentation/js/current/MouseWheelZoomModifier.html) to ensure a smooth user experience. This approach provides a clear and maintainable structure for integrating SciChart.js within any JavaScript project.",
            },
            react: {
                subtitle:
                    "If you want to learn about heatmaps. this demo shows you how to create a **React Heatmap Chart** using SciChart.js, our 5-star rated JavaScript Chart Component.",
                title: "React Heatmap Chart",
                pageTitle: "React Heatmap Chart | JavaScript Chart Library Examples",
                metaDescription:
                    "Easily create a high performance React Heatmap Chart with SciChart. Get your free trial of our 5-star rated JavaScript Chart Component today.",
                markdownContent:
                    "## Heatmap Chart Example in React\n\n### Overview\nThis example demonstrates a real-time updating **Heatmap Chart** built using SciChart.js and integrated into a React application. The implementation leverages the [SciChart React](https://www.scichart.com/blog/react-charts-with-scichart-js/) component for chart creation and lifecycle management, providing a high-performance chart that displays dynamic heatmap data with an accompanying legend.\n\n### Technical Implementation\nThe chart is initialized using the SciChartReact component which receives custom draw functions via the onInit callback. This function sets up the chart with numerical axes, a uniform heatmap data series, and various chart modifiers for interactive features such as zoom and pan. Real-time updates are managed via a timed loop mechanism (using setTimeout) that refreshes the heatmap’s data series while a subscription to render events tracks FPS and data dimensions. Developers interested in understanding effective real-time update strategies can explore the [Realtime Heatmap Documentation](https://www.scichart.com/documentation/js/current/webframe.html#Updating-Uniform-Heatmaps.html) documentation.\n\n### Features and Capabilities\nThe implementation offers several advanced features and customizations including real-time data streaming, dynamic performance monitoring, and interactive chart modifiers (like zoom pan and mouse wheel zoom). The detailed color map and data generation function ensure that the heatmap accurately represents complex data with continuous visual transitions. These capabilities are essential for applications requiring high-performance data visualization.\n\n### Integration and Best Practices\nThe React integration demonstrates best practices such as using the useRef hook to manage chart control functions and handling chart initialization and cleanup within the component lifecycle. The example also incorporates Material UI components to build an interactive toolbar, providing users with clear control over starting and stopping the real-time updates. For further guidance on integrating SciChart.js within a React framework, developers can refer to the [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/) article and the [Tutorial 01 - Setting up a project with scichart-react and config object](https://www.scichart.com/documentation/js/current/TutorialSetupProjectWithSciChartReact.html) documentation.\n",
            },
            angular: {
                subtitle:
                    "If you want to learn about heatmaps. this demo shows you how to create a **Angular Heatmap Chart** using SciChart.js, our 5-star rated JavaScript Chart Component.",
                title: "Angular Heatmap Chart",
                pageTitle: "Angular Heatmap Chart | JavaScript Chart Library Examples",
                metaDescription:
                    "Easily create a high performance Angular Heatmap Chart with SciChart. Get your free trial of our 5-star rated JavaScript Chart Component today.",
                markdownContent:
                    "## Angular Heatmap Chart Example\n\n### Overview\nThis example demonstrates how to integrate SciChart.js with Angular using Standalone Components and the scichart-angular package. It showcases a high-performance heatmap visualization that updates in real-time while providing interactive controls to start and stop the updates.\n\n### Technical Implementation\nThe implementation leverages a custom Angular Standalone Component that embeds the SciChartAngularComponent. The chart is created via the asynchronous function `drawExample` which initializes the SciChartSurface, attaches numeric axes (hidden for a cleaner look), and sets up a uniform heatmap data series. Real-time updates are managed using JavaScript’s `setTimeout`, while performance is monitored by subscribing to render events to extract data such as FPS and heatmap dimensions. This approach adheres to the integration patterns described in the [scichart-angular documentation](https://www.npmjs.com/package/scichart-angular) and the [Getting Started with SciChart JS guide](https://www.scichart.com/getting-started/scichart-javascript/).\n\n### Features and Capabilities\nThe example includes advanced features such as dynamic color mapping using a detailed gradient setup, a dedicated heatmap legend provided by the `drawHeatmapLegend` function, and interactive chart modifiers including zoom and pan functionalities. The real-time data update mechanism allows the chart to refresh continuously with performance statistics being updated live. This ensures that developers can monitor and optimize rendering performance using insights provided by [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html).\n\n### Integration and Best Practices\nAngular-specific integration is handled using property binding and event subscriptions, ensuring smooth communication between the Angular component and the SciChartSurface instance. The example follows best practices for Angular lifecycle management, as detailed in the [Component Lifecycle - Angular](https://angular.io/guide/lifecycle-hooks) documentation. Additionally, Angular event handling and dynamic styling are used to control chart behavior and update the UI in response to user interactions, making the integration robust and maintainable.\n\nDevelopers looking to extend or customize this implementation can refer to the provided documentation links for deeper technical context and further optimization techniques.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The-Uniform-Heatmap-Chart-Type.html",
                title: "The specific page for the JavaScript Heatmap Chart documentation will help you to get started",
                linkTitle: "JavaScript Heatmap Chart Documentation",
            },
        ],
        path: "heatmap-chart",
        metaKeywords: "heatmap, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/HeatmapChart",
        thumbnailImage: "javascript-heatmap-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const heatmapChartExampleInfo = createExampleInfo(metaData);
