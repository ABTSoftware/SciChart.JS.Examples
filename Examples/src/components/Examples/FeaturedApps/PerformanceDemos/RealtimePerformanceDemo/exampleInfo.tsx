import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "FeaturedAppsPerformanceDemosRealtimePerformanceDemo",
        imagePath: "javascript-chart-realtime-performance-demo.jpg",
        description:
            "Demonstrates appending **millions of points** to a line chart with SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates appending **millions of points** to a line chart with SciChart.js, High Performance JavaScript Charts",
                title: "Realtime JavaScript Chart Performance Demo",
                pageTitle: "Realtime JavaScript Chart Performance Demo",
                metaDescription:
                    "This demo showcases the incredible realtime performance of our JavaScript charts by updating the series with millions of data-points!",
                markdownContent:
                    "# Realtime Performance Demo with Vanilla JavaScript\n\n### Overview\nThis example, “Realtime Performance Demo”, demonstrates how to create a highly performant real-time chart using plain, vanilla JavaScript and SciChart.js. The demo continuously appends large batches of data points to a line chart while measuring performance metrics such as frames per second (FPS), all powered by the efficient WebGL rendering capabilities of SciChart.js.\n\n### Technical Implementation\nThe implementation begins by asynchronously initializing a SciChartSurface using the dedicated WebGL canvas via the SciChartSurface.createSingle method (see [Adding Realtime Updates | JavaScript Chart Documentation](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html)). Two NumericAxes are created and configured with auto-ranging set to EAutoRange.Always, which is detailed in the [Axis Ranging - AutoRange Documentation](https://www.scichart.com/documentation/js/current/Axis%20Ranging%20-%20AutoRange.html). Three XyDataSeries objects are instantiated and bound to FastLineRenderableSeries to efficiently render large ranges of data points. A setTimeout loop is used to drive the continuous, real-time data updates, with a random walk generator appending 1,000 points every 10 milliseconds. Performance is measured by subscribing to the rendered event, which calculates metrics such as FPS and the total number of data points—techniques discussed in the [Performance Tips & Tricks Guide](https://www.scichart.com/documentation/js/current/Performance%20Tips.html).\n\n### Features and Capabilities\n**Real-Time Updates:** The demo showcases live data streaming by continuously appending thousands of data points. This demonstrates how efficiently the [DataSeries Realtime Updates](https://www.scichart.com/documentation/js/current/DataSeries_RealtimeUpdates.html) feature can handle high-frequency updates in vanilla JavaScript.\n\n**Axis Configuration:** By using NumericAxis with an auto-range configuration, the chart automatically adjusts its view to new data without manual intervention. Developers interested in further details can review the [Axis Ranging - AutoRange Documentation](https://www.scichart.com/documentation/js/current/Axis%20Ranging%20-%20AutoRange.html).\n\n**Asynchronous Initialization:** The use of async/await ensures that the chart is set up efficiently and that resources are properly managed. This practice follows guidelines outlined in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) documentation.\n\n**Performance Measurement:** The rendered.subscribe event is leveraged to compute performance statistics like FPS, enabling developers to gain insights into rendering efficiency. For more on these techniques, see the [Performance Tips & Tricks Guide](https://www.scichart.com/documentation/js/current/Performance%20Tips.html).\n\n### Integration and Best Practices\nEven though this example is implemented purely in vanilla JavaScript, the control patterns—such as starting/stopping real-time updates and cleaning up resources using a destructor function—are applicable to any framework. The chart controls provide methods to start and stop the update loop, and the SciChartSurface.delete() method is called to dispose of WebGL resources efficiently, aligning with the best practices detailed in the [Memory Best Practices](https://www.scichart.com/documentation/js/current/Memory%20Best%20Practices.html) documentation. This example clearly illustrates how real-time chart updates, efficient data series handling, and performance measurement techniques can be combined in a vanilla JavaScript environment using SciChart.js.",
            },
            react: {
                subtitle:
                    "Demonstrates appending **millions of points** to a line chart with SciChart.js, High Performance JavaScript Charts",
                title: "Realtime React Chart Performance Demo",
                pageTitle: "Realtime React Chart Performance Demo",
                metaDescription:
                    "This demo showcases the incredible realtime performance of our React charts by updating the series with millions of data-points!",
                markdownContent:
                    "# Realtime Performance Demo (React)\n\n### Overview\nThis example demonstrates a high-performance, real-time chart using SciChart.js in a React environment. It is designed to dynamically append millions of data points to a line chart, showcasing smooth rendering and live performance metrics such as frame rate and data point count.\n\n### Technical Implementation\nThe chart is initialized asynchronously with the SciChartReact component provided by the scichart-react library. The onInit callback sets up the WebGL powered SciChartSurface, two numeric axes with automatic range, and multiple line series using the FastLineRenderableSeries. Data points are continuously appended to the renderable series via a timer callback that simulates real-time updates. This asynchronous approach follows [best practices for asynchronous initialization in React](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html) and utilizes React hooks such as useRef and useState to manage external chart control references.\n\n### Features and Capabilities\nThe example supports real-time update capabilities by streaming data generated from a random walk algorithm. It not only renders a high volume of data points efficiently through WebGL but also allows for interactivity such as zooming and panning when the update process is paused. Using the SciChart.js performance engine, the demo optimizes rendering throughput, ensuring smooth updates even with millions of points as highlighted in [WebGL performance optimization techniques](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/).\n\n### Integration and Best Practices\nIntegration with React is seamlessly achieved by implementing start and stop update controls, with proper event handling facilitated through callbacks and React lifecycle events. The component cleans up resources using the onDelete callback for proper chart disposal, following [React integration best practices](https://www.scichart.com/blog/react-charts-with-scichart-js/). The use of React’s useRef hook for managing chart controls and real-time state updates ensures efficient state management and performance measurement, as discussed in [React Hooks for external library integration](https://dev.to/ashsajal/the-useref-hook-in-react-for-managing-references-4cfa).\n\nDevelopers seeking to build similar real-time, high-performance React applications with SciChart.js are encouraged to review these techniques along with additional insights from the [Creating a React Dashboard with SciChart.js](https://www.scichart.com/blog/creating-a-react-dashboard-with-scichart-js-scichart-react-and-deepseek-r1/) guide.",
            },
            angular: {
                subtitle:
                    "Demonstrates appending **millions of points** to a line chart with SciChart.js, High Performance JavaScript Charts",
                title: "Realtime Angular Chart Performance Demo",
                pageTitle: "Realtime Angular Chart Performance Demo",
                metaDescription:
                    "This demo showcases the incredible realtime performance of our Angular charts by updating the series with millions of data-points!",
                markdownContent:
                    "# Realtime Angular Chart Performance Demo\n\n### Overview\nThis example demonstrates a high-performance real-time chart built in Angular using SciChart.js. It showcases how to update a line chart with millions of data points efficiently, leveraging Angular components and SciChartAngularComponent for seamless integration.\n\n### Technical Implementation\nThe demo is implemented as a standalone Angular component. It uses property binding to pass the chart initialization function via the [initChart] input of SciChartAngularComponent and manages chart lifecycle events with (onInit) and (onDelete) event bindings. These event bindings ensure that the chart is initialized asynchronously and cleaned up correctly, adhering to [Angular lifecycle hooks](https://angular.io/guide/lifecycle-hooks) for effective resource management. The chart’s rendering logic is defined in a separate module, which sets up a SciChartSurface using WebGL for high-performance graphics. Real-time data is appended using a timer (setTimeout) and a random walk algorithm, following concepts from [adding real-time updates](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html) and [DataSeries real-time updates](https://www.scichart.com/documentation/js/current/DataSeries_RealtimeUpdates.html).\n\n### Features and Capabilities\nThe example highlights several advanced features:\n\n- **Real-time data streaming:** Millions of data points are dynamically appended to the chart, ensuring smooth rendering and real-time performance statistics such as frames per second (FPS).\n- **Performance optimization:** Using SciChart.js’s WebGL capabilities, the demo maximizes performance under heavy data loads.\n- **Interactivity controls:** When updates are paused, users can zoom and pan the chart using interactive modifiers added to the SciChartSurface.\n\n### Integration and Best Practices\nThe implementation embraces best practices in Angular development by using property binding for passing function references, as outlined in discussions like [Angular2: Pass by reference to interact between components](https://stackoverflow.com/questions/40260158/angular2-pass-by-reference-to-interact-between-components). Furthermore, handling of asynchronous updates and cleanup is achieved via event callbacks in the Angular component, ensuring that timer-based updates are properly stopped when the component is destroyed. This approach is aligned with efficient resource management practices detailed in [Angular Lifecycle Hooks Best Practices](https://www.angularminds.com/blog/angular-lifecycle-hooks-best-practices). Developers are encouraged to review the provided documentation links for a deeper understanding of Angular event handling and asynchronous updates for external chart libraries.\n",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/Common%20RenderableSeries%20Features.html",
                title: "Go to the Performance Tips and Tricks page in the SciChart.js Documentation",
                linkTitle: "SciChart.js Performance Tips and Tricks",
            },
        ],
        path: "chart-realtime-performance-demo",
        metaKeywords: "realtime, performance, demo, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "FeaturedApps/PerformanceDemos/RealtimePerformanceDemo",
        thumbnailImage: "javascript-chart-realtime-performance-demo.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const realtimePerformanceDemoExampleInfo = createExampleInfo(metaData);
