import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "FeaturedAppsFeatureDemosSubChartsAPI",
        imagePath: "javascript-subcharts-grid.jpg",
        description:
            "Using the SubCharts API as part of SciChart.js, this demo showcases an 8x8 grid of 64 charts updating in realtime in JavaScript.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Using the SubCharts API as part of SciChart.js, this demo showcases an 8x8 grid of 64 charts updating in realtime in JavaScript.",
                title: "JavaScript 64-Chart Dashboard Performance Demo",
                pageTitle: "JavaScript 64-Chart Dashboard Performance Demo",
                metaDescription:
                    "Using the SubCharts API as part of SciChart.js, this demo showcases an 8x8 grid of 64 charts updating in realtime in JavaScript",
                markdownContent:
                    "# SubChartsAPI Example with Vanilla JavaScript\n\n## Overview\nThis example demonstrates how to implement a multi-chart dashboard using **SciChart.js** in a pure vanilla JavaScript environment. It focuses on combining several sub-charts into a unified interface, managing synchronized axes, and delivering real-time updates. Developers can explore the detailed [worked example](https://www.scichart.com/documentation/js/current/SubChartsWorkedExample10x10Grid.html) to understand the fundamental concepts behind multi-chart integration.\n\n## Technical Implementation\nThe implementation leverages a modular design pattern to dynamically create and manage chart components using JSON-based configurations. The Builder API facilitates setting up complex chart structures, a strategy well-documented in the [SciChart.js JavaScript Charts User Manual](https://www.scichart.com/documentation/js/current/SciChart_JS_User_Manual.html). Additionally, the synchronization of axes across sub-charts is achieved using methods discussed in the [Synchronizing Multiple Charts](https://www.scichart.com/documentation/js/current/Synchronizing%20Multiple%20Charts.html) guide, ensuring a coordinated zoom and pan experience across the entire dashboard.\n\n## Features and Capabilities\nThis example supports a range of advanced features including real-time data updates, efficient zoom and pan interactions, and high-performance rendering using WebGL. The dashboard benefits from [realtime chart updates](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html), while the integration of WebGL, as described in the [JavaScript Stock Charts with WebGL WebAssembly](https://www.scichart.com/blog/scichart-js-preview-creating-real-time-stock-charts-in-javascript/) article, helps render complex visualizations smoothly. User interactions are further enhanced by incorporating behaviors from the [Tutorial 03 - Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html) documentation.\n\n## Integration and Best Practices\nThe project adheres to best practices by utilizing a modular approach for dynamic component management and event handling, which simplifies maintenance and scalability in long-running applications. Performance optimization techniques, as detailed in [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/), are applied to ensure efficient rendering and memory management. Following these strategies not only improves responsiveness but also minimizes potential memory leaks, a critical aspect in extensive vanilla JavaScript projects.\n",
            },
            react: {
                subtitle:
                    "Using the SubCharts API as part of SciChart.js, this demo showcases an 8x8 grid of 64 charts updating in realtime in JavaScript.",
                title: "React 64-Chart Dashboard Performance Demo",
                pageTitle: "React 64-Chart Dashboard Performance Demo",
                metaDescription:
                    "Using the SubCharts API as part of SciChart.js, this demo showcases an 8x8 grid of 64 charts updating in realtime in JavaScript",
                markdownContent:
                    "# SubChartsAPI in React\n\n## Overview\nThis example demonstrates how to integrate SciChart.js within a React application to create complex sub-chart compositions. The implementation focuses on using functional components along with React hooks such as useEffect, providing a streamlined approach to building high-performance charts with advanced features in a React environment.\n\n## Technical Implementation\nThe implementation leverages the Builder API with JSON data to configure and instantiate chart surfaces. It utilizes React’s useEffect hook to initialize and manage SciChartSurface instances, ensuring optimal resource management and performance. Essential to this approach is the use of React refs for managing the lifecycle of the chart instances, an approach detailed in [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html). Additionally, the application minimizes unnecessary re-renders, in line with techniques discussed in [ReactJS Sweep Line: Optimizing SciChartJS Performance](https://stackoverflow.com/questions/77781766/reactjs-sweep-line-optimizing-scichartjs-performance-reusing-wasmcontext-for-m).\n\n## Features and Capabilities\nThe SubChartsAPI example provides several powerful features:\n\n- **Real-time updates**: Optimized React state management is used to handle high-frequency data updates successfully. Further insight into this implementation can be found in [Adding Realtime Updates](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html).\n\n- **Sub-chart composition**: Multiple sub-charts are composed within a single SciChart.js component. This modular approach allows for clear separation of chart functionalities and is similar to the patterns shown in [React Chart Examples | SciChart.js](https://demo.scichart.com/react).\n\n- **Advanced interactive features**: The example implements interactive annotations and custom behaviors using advanced SciChart APIs. Developers can explore these capabilities further as described in [The Annotations API Overview](https://www.scichart.com/documentation/js/current/The%20Annotations%20API%20Overview.html).\n\n## Integration and Best Practices\nThe example adheres to best practices for React integration by utilizing functional components and React hooks to initialize, update, and dispose of chart instances effectively. Efficient ref management is used to prevent memory leaks, as emphasized in [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html).\n\nAdditionally, the solution takes advantage of performance optimization techniques to reduce unnecessary re-renders, which is crucial in dynamic data environments. Developers are encouraged to also review [What is React Strict Mode and why is my application double re-rendering?](https://www.scichart.com/blog/what-is-react-strict-mode-and-why-is-my-application-double-re-rendering/) for insights into further optimizations.\n\nOverall, the SubChartsAPI example in React serves as an excellent resource for developers looking to combine the power of SciChart.js with modern React development practices for building robust, interactive, and high-performance visualizations.",
            },
            angular: {
                subtitle:
                    "Using the SubCharts API as part of SciChart.js, this demo showcases an 8x8 grid of 64 charts updating in realtime in JavaScript.",
                title: "Angular 64-Chart Dashboard Performance Demo",
                pageTitle: "Angular 64-Chart Dashboard Performance Demo",
                metaDescription:
                    "Using the SubCharts API as part of SciChart.js, this demo showcases an 8x8 grid of 64 charts updating in realtime in JavaScript",
                markdownContent:
                    "# SubChartsAPI - Angular\n\n## Overview\nThe SubChartsAPI example demonstrates the integration of SciChart.js sub-charts within an Angular application. This example leverages Angular's dependency injection and component lifecycle hooks to initialize and update charts efficiently. It showcases how developers can embed interactive and performance-oriented charts into Angular components using best practices from the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide.\n\n## Technical Implementation\nThe implementation uses a Builder API that works seamlessly with JSON configurations to define chart properties, sub-chart hierarchies, and interactions. This approach enables a declarative and modular chart design within Angular. Furthermore, the code optimizes rendering performance by leveraging WebGL and Angular performance optimization techniques. For more details on performance considerations, developers can refer to the [SciChart.js Performance Demo: 1 Million Datapoints in under 15ms](https://www.scichart.com/blog/scichart-js-performance-demo-1-million-datapoints-70ms/) and explore strategies for [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/).\n\n## Features and Capabilities\nThe example exhibits several advanced features including **real-time chart updates** and dynamic data binding, which allow sub-charts to refresh seamlessly as new data streams in. This is achieved by integrating Angular's advanced data binding practices with SciChart.js's real-time update capabilities as described in [Adding Realtime Updates | JavaScript Chart Documentation](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html). In addition, interactive functionalities like synchronized zooming and panning are implemented. Developers can see techniques for linking interactive behavior in [How to Link JavaScript Charts and Synchronise zooming, panning ...](https://www.scichart.com/blog/how-to-link-javascript-charts-and-synchronise-zooming-panning-crosshairs/).\n\n## Integration and Best Practices\nThe integration follows modular design principles in Angular, ensuring that external libraries like SciChart.js can be easily incorporated into Angular projects. Best practices include using Angular’s dependency injection, lifecycle hooks, and change detection strategies, such as ChangeDetectionStrategy.OnPush, to optimize re-rendering and performance. Detailed discussion on Angular component lifecycle can be found in the [Component Lifecycle - Angular](https://angular.io/guide/lifecycle-hooks) documentation, while insights into the OnPush strategy are available in [Deep dive into the OnPush change detection strategy in Angular](https://medium.com/angular-in-depth/deep-dive-into-the-onpush-change-detection-strategy-in-angular-fab5e4da1d69). By following these guidelines, the example achieves a high degree of responsiveness and efficiency, making it suitable for applications with large datasets and complex chart interactions.\n",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#WhatIsTheSubChartsAPI.html",
                title: "This specifics page in the JavaScript SubCharts API documentation will help you to get started",
                linkTitle: "Scichart.js SubCharts API Documentation",
            },
        ],
        path: "multiple-chart-dashboard-performance-demo",
        metaKeywords: "javascript, multichart, dashboard, performance, grid, realtime, webgl, canvas",
        onWebsite: false,
        filepath: "FeaturedApps/FeatureDemos/SubChartsAPI",
        thumbnailImage: "javascript-subcharts-grid.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const subchartsGridExampleInfo = createExampleInfo(metaData);
