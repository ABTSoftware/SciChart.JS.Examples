import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "FeaturedAppsPerformanceDemosLoad500By500",
        imagePath: "javascript-chart-load-500-series-by-500-points.jpg",
        description:
            "Demonstrates loading **500 series, each with 500 points (250k points total) instantly**. Click the **Reload** button at the bottom of the demo to see the chart draw again.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates loading **500 series, each with 500 points (250k points total) instantly**. Click the **Reload** button at the bottom of the demo to see the chart draw again.",
                title: "Load 500 Series x 500 Points Performance Demo",
                pageTitle: "Load 500 Series x 500 Points Performance Demo",
                metaDescription:
                    "This demo showcases the incredible performance of our JavaScript Chart by loading 500 series with 500 points (250k points) instantly!",
                markdownContent: null,
            },
            react: {
                subtitle:
                    "Demonstrates loading **500 series, each with 500 points (250k points total) instantly**. Click the **Reload** button at the bottom of the demo to see the chart draw again.",
                title: "Load 500 Series x 500 Points Performance Demo",
                pageTitle: "Load 500 Series x 500 Points Performance Demo",
                metaDescription:
                    "This demo showcases the incredible performance of our React Chart by loading 500 series with 500 points (250k points) instantly!",
                markdownContent:
                    "# Load500By500 Example with React\n\n## Overview\nThis example, Load500By500, demonstrates a high-performance chart rendering scenario using SciChart.js within a React application. It showcases the integration of SciChart.js into React components to efficiently render and manage large datasets, while ensuring smooth real-time updates and optimal performance.\n\n## Technical Implementation\nThe implementation leverages the SciChart.js Builder API with JSON configurations to initialize and update the chart. The design uses React hooks such as useEffect and useState for component lifecycle management and data updates. The integration follows best practices outlined in [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html), ensuring proper resource disposal and clean-up to prevent memory leaks. For rendering, it utilizes WebGL for accelerated graphics, as detailed in the [SciChart.js JavaScript Charts User Manual](https://www.scichart.com/documentation/js/current/SciChart_JS_User_Manual.html).\n\n## Features and Capabilities\nThe chart comes with advanced features including: \n\n- **Real-time Updates**: The example supports dynamic data streaming, with implementations similar to those described in [Adding Realtime Updates | JavaScript Chart Documentation - SciChart](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html).\n- **Performance Optimization**: Special considerations have been made for handling large datasets for enhanced performance. Techniques such as using React memoization with useMemo and useCallback allow smooth interactions, in line with practices from [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/).\n- **Customizable Chart Components**: Developers can easily extend and modify capabilities through a modular approach that fosters reusability, as explained in the context of [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/).\n\n## Integration and Best Practices\nThis implementation not only integrates SciChart.js with React but also emphasizes performance and maintainability. By adhering to best practices for resource management and component modularity, the example ensures that charts are efficiently updated and rendered. Developers are encouraged to review the detailed guides on [React integration](https://www.scichart.com/blog/react-charts-with-scichart-js/) and apply techniques such as memoization and proper disposal of resources, which are critical for managing complex, real-time visualizations.\n\nOverall, the Load500By500 example is a comprehensive demonstration of integrating SciChart.js within a React framework, showcasing advanced performance optimizations, real-time data handling, and robust component design.",
            },
            angular: {
                subtitle:
                    "Demonstrates loading **500 series, each with 500 points (250k points total) instantly**. Click the **Reload** button at the bottom of the demo to see the chart draw again.",
                title: "Load 500 Series x 500 Points Performance Demo",
                pageTitle: "Load 500 Series x 500 Points Performance Demo",
                metaDescription:
                    "This demo showcases the incredible performance of our Angular Chart by loading 500 series with 500 points (250k points) instantly!",
                markdownContent:
                    "# Load500By500 - Angular\n\n## Overview\nThe Load500By500 example demonstrates how to integrate SciChart.js with Angular to render a complex 500x500 chart grid. This implementation focuses on efficiently visualizing large datasets and providing real-time update capabilities using Angular’s powerful component and lifecycle management system.\n\n## Technical Implementation\nThis example leverages Angular’s component-based architecture to encapsulate the charting logic. The SciChart.js configuration is defined using JSON, enabling rapid setup and customization. Angular lifecycle hooks such as ngOnInit are used for initializing the chart instance, ensuring that the WebGL-based rendering is optimally configured. Performance optimizations are addressed by applying Angular change detection strategies, as discussed in [Boosting Performance with Angular Change Detection Strategies](https://www.csharp.com/article/boosting-performance-with-angular-change-detection-strategies/). For more details on the chart configuration, consult the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide.\n\n## Features and Capabilities\nThe implementation supports advanced features including real-time data updates, efficient data binding, and event integration. Angular Observables are employed to handle streaming data, ensuring the chart reacts promptly to changes. Interaction capabilities such as zooming and panning are seamlessly integrated, providing a smooth user experience. For insights on rendering performance, refer to the [SciChart.js Javascript 3D Charts with WebGL & WebAssembly](https://dev.to/andyb1979/scichartjs-javascript-3d-charts-with-webgl-webassembly-5gle) documentation.\n\n## Integration and Best Practices\nKey integration aspects include the use of Angular dependency injection to manage SciChart.js services, lazy-loading strategies for dynamic module loading, and efficient event handling that ties SciChart.js events with Angular’s event system. These approaches not only improve the overall performance but also enhance modularity and maintainability. Developers should explore Angular’s best practices for component implementation as outlined in the [SciChart.js for Web](https://www.scichart.com/scichart-js-for-web-a-fast-realtime-2d-3d-chart-component-for-html5-javascript-apps/) documentation to fully leverage these capabilities.\n",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#Common%20RenderableSeries%20Features.html",
                title: "Go to the Performance Tips and Tricks page in the SciChart.js Documentation",
                linkTitle: "SciChart.js Performance Tips and Tricks",
            },
        ],
        path: "load-500-series-x-500-points-performance-demo",
        metaKeywords: "performance, demo, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "FeaturedApps/PerformanceDemos/Load500By500",
        thumbnailImage: "javascript-chart-load-500-series-by-500-points.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const load500By500ExampleInfo = createExampleInfo(metaData);
