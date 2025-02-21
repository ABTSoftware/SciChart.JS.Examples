import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DFiltersCustomFilters",
        imagePath: "javascript-custom-filters.jpg",
        description:
            "Demonstrates simple and advanced **Custom Filters**, with realtime updates using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates simple and advanced **Custom Filters**, with realtime updates using SciChart.js, High Performance JavaScript Charts",
                title: "Custom Filters",
                pageTitle: "Custom Filters",
                metaDescription:
                    "Demonstrates simple and advanced Custom Filters for data transformation and aggregation, with realtime updates",
                markdownContent:
                    "## Custom Filters - Vanilla JavaScript\n\n### Overview\nThis example demonstrates advanced **custom filters** within the SciChart.js library using vanilla JavaScript. The implementation showcases real-time data transformations by applying a Gaussian randomization filter and a bespoke aggregation filter that extends the XyFilterBase class to compute frequency distributions.\n\n### Technical Implementation\nThe custom filtering mechanism is implemented by subclassing [XyFilterBase](https://www.scichart.com/documentation/js/current/typedoc/classes/xyfilterbase.html) to create an aggregation filter, and by applying a transformation function via [XyCustomFilter](https://www.scichart.com/documentation/js/current/Creating%20a%20Custom%20Filter.html) that utilizes a Gaussian random function. Real-time updates are executed using a timer-based approach with setTimeout, as detailed in the [Adding Realtime Updates](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html) guide. The example also leverages WebAssembly acceleration for high-frequency data processing, a key aspect for performance optimization as described in the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html).\n\n### Features and Capabilities\nKey features include real-time updates with efficient batch data appending and advanced data transformation techniques. The Gaussian randomization modifies the incoming data series before it is aggregated, while the custom aggregation filter bins the data to produce a frequency distribution. This dual filtering approach enables developers to visualize both raw and processed data concurrently, ensuring a high level of interactivity and responsiveness.\n\n### Integration and Best Practices\nFocusing solely on vanilla JavaScript, the example adheres to robust object-oriented design patterns by extending base filtering classes without relying on framework-specific hooks or builder APIs. The implementation follows best practices outlined in the [SciChart.js JavaScript Charts User Manual](https://www.scichart.com/documentation/js/current/SciChart_JS_User_Manual.html) to build high-performance, real-time charting applications. Developers are encouraged to explore these techniques further to optimize large-scale data visualization solutions.",
            },
            react: {
                subtitle:
                    "Demonstrates simple and advanced **Custom Filters**, with realtime updates using SciChart.js, High Performance JavaScript Charts",
                title: "Custom Filters",
                pageTitle: "Custom Filters",
                metaDescription:
                    "Demonstrates simple and advanced Custom Filters for data transformation and aggregation, with realtime updates",
                markdownContent:
                    "## Custom Filters Example in React\n\n### Overview\nThis example demonstrates a high-performance charting application built with SciChart.js in a React framework. It focuses on transforming data in real-time using advanced custom filters, which includes dynamically aggregating data into frequency distributions. The implementation is specifically tailored for React using the SciChartReact component for asynchronous chart initialization and lifecycle management.\n\n### Technical Implementation\nThe chart is initialized asynchronously via the SciChartReact component, where the chart setup is encapsulated within the drawExample function. The implementation leverages custom filters such as a Gaussian filter and a bespoke aggregation filter that extends the XyFilterBase to compute frequency distributions. Data is appended in real-time using an update function that efficiently processes high data volumes through WebAssembly acceleration. Developers interested in asynchronous initialization can refer to the [React Charts with SciChart.js](https://www.scichart.com/blog/react-charts-with-scichart-js/) documentation for more details.\n\n### Features and Capabilities\nThe example includes several advanced features including **real-time updates** by dynamically appending high-frequency data points to the chart. The use of custom filters for data transformation is a key aspect of the demo; for instance, the Gaussian random filter modifies data points before they are aggregated into bins using the custom aggregation filter. This approach is aligned with the guidance on [Creating a Custom Filter](https://www.scichart.com/documentation/js/current/Creating%20a%20Custom%20Filter.html) which provides a solid reference for implementing custom transformations. Additionally, rendered series such as scatter, line, and column series illustrate how different types of data can be visualized concurrently.\n\n### Integration and Best Practices\nIn the React context, this example makes use of the onInit and onDelete callbacks of the SciChartReact component to manage the chart lifecycle, ensuring seamless integration and performance optimization. Real-time data streaming is implemented with a controlled timer mechanism to handle large data volumes while maintaining optimal rendering performance, as detailed in the [Adding Realtime Updates](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html) guide. Furthermore, the example emphasizes performance optimization techniques such as using WebAssembly context (wasmContext) which is essential when dealing with high frequency updates. For best practices on performance, developers can refer to the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) page.\n",
            },
            angular: {
                subtitle:
                    "Demonstrates simple and advanced **Custom Filters**, with realtime updates using SciChart.js, High Performance JavaScript Charts",
                title: "Custom Filters",
                pageTitle: "Custom Filters",
                metaDescription:
                    "Demonstrates simple and advanced Custom Filters for data transformation and aggregation, with realtime updates",
                markdownContent:
                    "## Custom Filters (Custom Filters in Angular)\n\n### Overview\nThis example demonstrates advanced use of custom filters within the SciChart.js library integrated into an Angular standalone component. The purpose is to showcase real-time data transformations and aggregations by applying custom filtering algorithms to streaming data.\n\n### Technical Implementation\nThe application leverages Angular event binding with the SciChart Angular component to handle asynchronous chart initialization and real-time updates via the Angular lifecycle hooks onInit and onDelete as documented in [Component Lifecycle - Angular](https://angular.io/guide/lifecycle-hooks). A custom aggregation filter is implemented by extending the SciChart.js XyFilterBase, which computes frequency distributions from data series. Additionally, a Gaussian randomization filter is applied using the XyCustomFilter functionality, aligning with the guidelines provided in the [SciChart.js Custom Filters Documentation](https://www.scichart.com/documentation/js/current/Creating%20a%20Custom%20Filter.html).\n\n### Features and Capabilities\nThe example supports high-frequency real-time updates by using a timer-based mechanism to append data points to the series, triggering dynamic updates in the rendered line, scatter, and column charts. This real-time data management is optimized using WebAssembly acceleration, a technique further detailed in the [Adding Realtime Updates | JavaScript Chart Documentation - SciChart](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html).\n\n### Integration and Best Practices\nAngular integration is achieved using the scichart-angular component, which simplifies embedding complex charts into Angular applications. The use of lifecycle hooks ensures that the chart initialization and cleanup are performed efficiently, following Angular best practices as described in [Component Lifecycle - Angular](https://angular.dev/guide/components/lifecycle). Developers are encouraged to review the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide for additional context on setting up high-performance charts and consult the [Performance Tips & Tricks | JavaScript Chart Documentation](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) for strategies on optimizing real-time updates in their applications.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/Creating%20a%20Custom%20Filter.html",
                title: "This specific page in the JavaScript Filters API documentation will help you to get started",
                linkTitle: "SciChart.js Custom Filters Documentation",
            },
        ],
        path: "custom-filters",
        metaKeywords: "real-time, filter, transform, updating, aggregation, custom, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/Filters/CustomFilters",
        thumbnailImage: "javascript-custom-filters.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const customFiltersExampleInfo = createExampleInfo(metaData);
