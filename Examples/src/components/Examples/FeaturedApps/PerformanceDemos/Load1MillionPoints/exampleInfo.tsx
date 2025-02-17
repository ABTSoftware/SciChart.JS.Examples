import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "FeaturedAppsPerformanceDemosLoad1MillionPoints",
        imagePath: "javascript-chart-performance-load-one-million-points.jpg",
        description:
            "Showcases how SciChart.js can load and display 1-Million Data-points in milliseconds. Click the **Reload** button at the bottom of the demo to see the chart draw again.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Showcases how SciChart.js can load and display 1-Million Data-points in milliseconds. Click the **Reload** button at the bottom of the demo to see the chart draw again.",
                title: "Load 1 Million Points Performance Demo",
                pageTitle: "Load 1 Million Points Performance Demo",
                metaDescription:
                    "This demo showcases the incredible performance of our JavaScript Chart by loading a million points instantly.",
                markdownContent: null,
            },
            react: {
                subtitle:
                    "Showcases how SciChart.js can load and display 1-Million Data-points in milliseconds. Click the **Reload** button at the bottom of the demo to see the chart draw again.",
                title: "Load 1 Million Points Performance Demo",
                pageTitle: "Load 1 Million Points Performance Demo",
                metaDescription:
                    "This demo showcases the incredible performance of our JavaScript Chart by loading a million points instantly.",
                markdownContent:
                    "# Load1MillionPoints - React\n\n## Overview\n\nThe Load1MillionPoints example is a high-performance SciChart.js implementation built with **React**. This example demonstrates how to render and interact with 1 million data points efficiently, leveraging key React integration techniques for managing state, lifecycle, and performance optimizations.\n\n## Technical Implementation\n\nThe example is architected around React components that encapsulate SciChart.js charting functionality. It utilizes the Builder API combined with JSON configuration for dynamically setting up the charts, which allows for a clean separation between the chart logic and the UI components. The implementation leverages advanced state management with **React Hooks** as explained in [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html) to manage real-time data updates and component lifecycle. Additionally, the chart rendering is optimized using techniques described in the [SciChart.js Performance Demo](https://www.scichart.com/blog/scichart-js-performance-demo-1-million-datapoints-70ms/), which highlights strategies for handling large datasets efficiently.\n\n## Features and Capabilities\n\nThis example showcases several advanced features and capabilities: \n\n- **Real-time Updates**: The charts support real-time data streaming, ensuring that the display remains responsive even as large volumes of data are updated frequently.\n\n- **High Performance with WebGL**: By leveraging WebGL rendering as detailed in [SciChart.js for Web](https://www.scichart.com/scichart-js-for-web-a-fast-realtime-2d-3d-chart-component-for-html5-javascript-apps/), the example achieves smooth and rapid updates necessary for real-time applications.\n\n- **Advanced Customizations**: The JSON-based configuration allows developers to integrate custom tooltips, legends, and other interactive elements, enabling a high degree of customization tailored to specific application needs.\n\n## Integration and Best Practices\n\nThe integration of SciChart.js in a React environment is enhanced by following best practices for both React and SciChart.js. The example makes use of the [React Charts with SciChart.js](https://www.scichart.com/blog/react-charts-with-scichart-js/) guidelines which illustrate how to decouple business logic from UI components, ensuring that the component remains modular and maintainable. For performance optimization, the implementation applies memoization and state management techniques that reduce unnecessary re-renders, in line with the [React optimization patterns](https://dev.to/codeofrelevancy/optimize-react-component-performance-with-memoization-using-reactmemo-3chp) best practices. Furthermore, asynchronous data integration is handled seamlessly by incorporating asynchronous hooks and effect patterns, similar to those described in the [Tutorial Setup Project with SciChart React](https://www.scichart.com/documentation/js/current/TutorialSetupProjectWithSciChartReact.html) documentation.\n\nOverall, the Load1MillionPoints example provides a robust demonstration of how to integrate SciChart.js with React to manage high frequency and large-scale data efficiently, employing state-of-the-art rendering and performance optimization techniques.",
            },
            angular: {
                subtitle:
                    "Showcases how SciChart.js can load and display 1-Million Data-points in milliseconds. Click the **Reload** button at the bottom of the demo to see the chart draw again.",
                title: "Load 1 Million Points Performance Demo",
                pageTitle: "Load 1 Million Points Performance Demo",
                metaDescription:
                    "This demo showcases the incredible performance of our JavaScript Chart by loading a million points instantly.",
                markdownContent:
                    "# Load1MillionPoints (Angular)\n\n## Overview\n\nThe Load1MillionPoints example showcases how to integrate SciChart.js within the Angular framework to efficiently render one million data points. By leveraging Angular's component architecture and lifecycle hooks, this example demonstrates how to build highly responsive and performance-optimized charting solutions.\n\n## Technical Implementation\n\nThe implementation utilizes the SciChart.js [Angular integration](https://classic.yarnpkg.com/en/package/scichart-angular) package to embed charting components in Angular applications. Using Angular lifecycle hooks, the chart is initialized during the component's creation and properly disposed of on destruction, as described in the [Component Lifecycle - Angular](https://angular.io/guide/lifecycle-hooks) documentation. The Builder API processes JSON-based configurations to set up the chart properties and data, ensuring that even large datasets are handled efficiently. Additional best practices can be explored in [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/).\n\n## Features and Capabilities\n\nThis example emphasizes **real-time update capabilities** and high-performance data visualization techniques. Among its key features are:\n\n- **Dynamic Data Streaming:** Real-time updates are supported through efficient change detection and Angular's optimized data-binding mechanisms.\n\n- **Advanced Performance Optimizations:** The design employs strategies to minimize change detection overhead and leverages dependency injection for modular configuration. An example of handling large datasets is highlighted in the [SciChart.js Performance Demo: 1 Million Datapoints](https://www.scichart.com/blog/scichart-js-performance-demo-1-million-datapoints-70ms/).\n\n## Integration and Best Practices\n\nThe example demonstrates several best practices for integrating SciChart.js with Angular:\n\n- **Angular Dependency Injection:** The chart configuration is modularized using Angular’s dependency injection, supporting clean separation of concerns. For more details, refer to [Dependency injection in action - Angular](https://v17.angular.io/guide/dependency-injection-in-action).\n\n- **Lazy Loading Strategies:** To further boost performance, the chart component can be lazily loaded, optimizing the initial load time of the Angular application. Techniques are discussed in the [Boost Angular Performance: Lazy Loading Guide - Syncfusion](https://www.syncfusion.com/blogs/post/boost-angular-performance-lazy-loading).\n\n- **Event Handling and Change Detection:** The example adopts best practices for managing subscriptions and optimizing Angular’s change detection, ensuring smooth and efficient real-time updates.\n\nOverall, Load1MillionPoints serves as a robust example of blending high-performance charting with best practices in Angular development, providing developers with a practical blueprint for managing large-scale data visualizations with SciChart.js.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#Common%20RenderableSeries%20Features.html",
                title: "Go to the Performance Tips and Tricks page in the SciChart.js Documentation",
                linkTitle: "SciChart.js Performance Tips and Tricks",
            },
        ],
        path: "chart-performance-load-one-million-points",
        metaKeywords: "performance, loading, million, points, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "FeaturedApps/PerformanceDemos/Load1MillionPoints",
        thumbnailImage: "javascript-chart-performance-load-one-million-points.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const loadOneMillionPointsExampleInfo = createExampleInfo(metaData);
