import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "Load1MillionPoints",
        id: "featuredApps_performanceDemos_LoadOneMillionPoints",
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
                markdownContent:
                    "## JavaScript Chart Performance Demo - Loading 1 Million Points\n\n### Overview\nThis example demonstrates how to efficiently render one million data points using SciChart.js in a pure JavaScript environment. The example focuses on generating a large dataset, appending it to an `XyDataSeries` using high performance techniques, and measuring the performance of data generation, appending, and rendering using JavaScript timestamps.\n\n### Technical Implementation\nThe implementation initializes the chart with a WASM context via the call to `SciChartSurface.create()`, which is documented in the [Creating a new SciChartSurface and loading Wasm](https://www.scichart.com/documentation/js/current/SciChartSurface.create%20and%20createSingle.html) guide. It adds `NumericAxis` with fixed visible ranges and creates a `FastLineRenderableSeries`. The example uses typed arrays (`Float64Array`) to store the x and y values for one million data points, ensuring optimal performance. Batch appending of the data is performed with the `XyDataSeries.appendRange()` method, a technique explained under [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html). Performance is measured by recording different timestamps before and after data generation, appending, and the rendering of the first frame.\n\n### Features and Capabilities\nKey features include real-time update capabilities where data is refreshed every 200 milliseconds using `setInterval`, as well as dynamic watermark annotations added with the `TextAnnotation` type. These annotations are positioned relative to the chart area, which allows for adaptable watermarking even when the chart dimensions change. More details about using `TextAnnotation` in SciChart.js can be found in the [TextAnnotation Documentation](https://www.scichart.com/documentation/js/current/TextAnnotation.html). Additionally, the example demonstrates the use of essential chart modifiers such as `ZoomExtentsModifier`, `ZoomPanModifier`, and `MouseWheelZoomModifier` to enable intuitive zooming and panning; you can review how to add such behavior in the [Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html) guide.\n\n### Integration and Best Practices\nDesigned entirely in JavaScript, this example highlights best practices for performance optimization in charting applications, such as the usage of typed arrays for data handling and batch updates to the data series for improved rendering efficiency. It also illustrates real-time update patterns by subscribing to the chart’s rendered event and measuring performance using JavaScript Date timestamps. Developers looking to integrate similar techniques into their applications can also explore realtime chart updates as described in the [Adding Realtime Updates](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html) tutorial. Overall, this example serves as a practical reference for handling large datasets with SciChart.js while maintaining high performance and smooth user interactions.",
            },
            react: {
                subtitle:
                    "Showcases how SciChart.js can load and display 1-Million Data-points in milliseconds. Click the **Reload** button at the bottom of the demo to see the chart draw again.",
                title: "Load 1 Million Points Performance Demo",
                pageTitle: "Load 1 Million Points Performance Demo",
                metaDescription:
                    "This demo showcases the incredible performance of our JavaScript Chart by loading a million points instantly.",
                markdownContent:
                    "## React Chart Performance Demo - Loading 1 Million Points\n\n### Overview\nThe Load 1 Million Points example demonstrates how to render and interact with one million data points using SciChart.js within a React framework. The focus is on achieving high-performance rendering and efficient real-time updates, making it ideal for applications that require rapid data processing and dynamic chart interactions.\n\n### Technical Implementation\nThe chart is set up using the `<SciChartReact/>` component which leverages an asynchronous `onInit` callback to initialize the chart on a specified DOM element. This process is managed with React Hooks such as `useState` and `useRef` for state management and control subscription. The `drawExample` function configures the chart by setting `NumericAxis`, `TextAnnotation`, and a `FastLineRenderableSeries`. WebGL rendering is utilized to achieve high performance when handling large datasets. For more details on how to integrate SciChart.js with React, see [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/). The asynchronous operations and side-effect management are handled in accordance with best practices outlined in [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html).\n\n### Features and Capabilities\nThis example showcases several advanced features including: \n- **Real-time Data Updates:** Efficiently generates, appends, and renders one million data points with performance metrics collected for generation, data appending, and rendering. This demonstrates [real-time chart updates](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html) capabilities.\n- **Dynamic Control Subscription:** Provides both single reload and automated interval-based updates to further simulate and evaluate performance under continuous data streaming.\n- **Material UI Integration:** Utilizes Material UI components to create a responsive user interface with controls such as buttons and alerts for an enhanced user experience.\n\n### Integration and Best Practices\nThe implementation adheres to React best practices by employing `useRef` for managing external chart controls and `useState` for handling performance timing metrics. The use of asynchronous hooks ensures that event subscriptions are properly managed and cleaned up, thus preventing memory leaks and unnecessary re-renders. Developers are encouraged to optimize their applications further by leveraging memoization techniques and efficient state updates as discussed in [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/).\n\nOverall, this example provides a comprehensive demonstration of leveraging SciChart.js in a React environment to achieve exceptional performance in large-scale data visualization, combining advanced configuration, real-time updating, and modern UI integration.",
            },
            angular: {
                subtitle:
                    "Showcases how SciChart.js can load and display 1-Million Data-points in milliseconds. Click the **Reload** button at the bottom of the demo to see the chart draw again.",
                title: "Load 1 Million Points Performance Demo",
                pageTitle: "Load 1 Million Points Performance Demo",
                metaDescription:
                    "This demo showcases the incredible performance of our JavaScript Chart by loading a million points instantly.",
                markdownContent:
                    "## Angular Chart Performance demo - Loading 1 Million Points\n\n### Overview\nThis example demonstrates how to integrate SciChart.js within an Angular application to efficiently render one million data points in milliseconds. It showcases high-performance real-time charting while providing detailed performance measurements during data generation, appending, and rendering.\n\n### Technical Implementation\nThe implementation uses an Angular standalone component that imports the `ScichartAngularComponent` from the [scichart-angular package](https://www.npmjs.com/package/scichart-angular) and leverages Angular lifecycle hooks (such as OnInit) to initialize the chart. Within the component, `NumericAxis` are added and `TextAnnotations` are added to display a static watermark. Event binding is used to capture reload events and real-time updates of performance data, a technique further explained in [Angular Data Binding: An Ultimate Guide By Experts](https://www.bacancytechnology.com/blog/angular-data-binding).\n\n### Features and Capabilities\nKey capabilities include real-time update functionality, interactive reloads via Angular Material buttons, and precise performance tracking for data generation, data appending, and frame rendering. The example emphasizes an efficient handling of extensive datasets through clear performance results, making it an essential resource for developers looking to integrate high-frequency data updates in Angular applications.\n\n### Integration and Best Practices\nThe chart integration emphasizes best practices such as utilizing Angular dependency injection for modular configuration and capitalizing on Angular's robust event and data binding mechanisms. The use of Angular Material further enhances the user interface with responsive and accessible design elements. Developers can gain more insights into using dependency injection by visiting the [Angular Dependency Injection guide](https://angular.io/guide/dependency-injection) and explore external library integrations through this [Stack Overflow discussion](https://stackoverflow.com/questions/44945766/use-external-javascript-library-in-angular-application). For additional performance optimization techniques, the [Angular Performance Optimization article](https://davembush.medium.com/angular-performance-optimization-5ec630d2b8f1) is a recommended resource.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/Common%20RenderableSeries%20Features.html",
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
        isNew: false
    };
//// End of computer generated metadata

const loadOneMillionPointsExampleInfo = createExampleInfo(metaData);
export default loadOneMillionPointsExampleInfo;
