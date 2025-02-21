import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "FeaturedAppsFeatureDemosChartTitle",
        imagePath: "javascript-chart-title.jpg",
        description:
            "A Chart Title can be placed above, below, or either side of the chart, and be left, center or right aligned.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "A Chart Title can be placed above, below, or either side of the chart, and be left, center or right aligned.",
                title: "JavaScript Chart Title",
                pageTitle: "JavaScript Chart Title",
                metaDescription: "Demonstrates chart title with different position and alignment options",
                markdownContent:
                    '# Chart Title Example (Vanilla JavaScript)\n\n## Overview\nThis example demonstrates how to configure a multi-line chart title in SciChart.js using vanilla JavaScript. The chart is initialized with a custom title, set to "Multiline\nChart Title", and styled with properties for font size, color, padding, and text alignment. This approach introduces developers to high-performance charting with SciChart.js as described in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide.\n\n## Technical Implementation\nThe chart is created by initializing a SciChartSurface, applying a custom theme, and setting up numeric axes with tailored axis titles via the "axisTitleStyle" property (see [NumericAxis Documentation](https://www.scichart.com/documentation/js/current/NumericAxis.html)). A FastLineRenderableSeries is added using an XyDataSeries sourced from randomly generated data, which illustrates efficient handling of dynamic data sets as detailed in the [FastLineRenderableSeries documentation](https://www.scichart.com/scichart-js-update-fast-realtime-javascript-charts/). Dynamic update functions are provided to modify the title text, alignment, position, and other style properties in real-time, following the approaches recommended in the [Chart Styling - Chart Titles](https://www.scichart.com/documentation/js/current/ChartTitles.html) guide.\n\n## Features and Capabilities\n- **Real-time Updates:** The example includes functions to change the chart title and its alignment dynamically, demonstrating advanced customization techniques.\n- **Advanced Styling:** Title styling options such as font size, color, and padding are configurable, allowing for multi-line title adjustments as explained in the [Label Alignment and Positioning](https://www.scichart.com/documentation/js/current/LabelAlignmentPositioning.html) documentation.\n- **Efficient Rendering:** The use of FastLineRenderableSeries ensures optimized performance for rendering live data.\n\n## Integration and Best Practices\nAlthough the provided source code is wrapped in a React component for demonstration purposes, the core implementation leverages vanilla JavaScript for initializing and updating the chart. Developers can integrate this approach into any vanilla JavaScript application by following practices from the [Tutorial 01 - Including SciChart.js in an HTML Page using CDN](https://www.scichart.com/documentation/js/current/Tutorial01IncludingSciChartjsHTMLPage.html). For further details on managing data series, refer to the [Working with Data](https://www.scichart.com/documentation/js/current/Working%20with%20Data.html) section. Overall, this example illustrates how to combine efficient rendering, responsive updates, and advanced styling to create a powerful, high-performance chart using SciChart.js in a vanilla JavaScript environment.',
            },
            react: {
                subtitle:
                    "A Chart Title can be placed above, below, or either side of the chart, and be left, center or right aligned.",
                title: "React Chart Title",
                pageTitle: "React Chart Title",
                metaDescription: "Demonstrates chart title with different position and alignment options",
                markdownContent:
                    "# React Chart Title Example\n\n## Overview\nThis example demonstrates how to integrate SciChart.js within a React application using the SciChartReact component. It focuses on dynamic chart title management where users can update the title text, alignment, position, and multiline configuration in real-time through interactive controls integrated with Material UI.\n\n## Technical Implementation\nThe chart is asynchronously initialized via the SciChartSurface.create method, establishing the WebGL rendering context and setting up the SciChartSurface with custom title properties. React hooks such as useState and useRef are employed to manage and update the chart title state efficiently within the component lifecycle. For a detailed guide on creating and managing such components, see [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html). The example also integrates event handling for dynamic updates, reflecting changes immediately on the rendered chart.\n\n## Features and Capabilities\nThe example offers several advanced features including **real-time updates** that enable immediate propagation of title changes, **dynamic customization** of visual elements such as text alignment and positioning, and **efficient resource management** through proper asynchronous initialization and cleanup. These aspects are crucial when working with high-performance WebGL rendering, as outlined in the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) documentation.\n\n## Integration and Best Practices\nThis implementation adheres to modern React integration best practices by leveraging component lifecycle management and state handling for dynamic customization. The use of Material UI components for user input demonstrates effective event handling within a React context. Developers can explore further insights on React integration with SciChart.js in [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/) which provides additional context on managing and optimizing these interactive charting solutions.",
            },
            angular: {
                subtitle:
                    "A Chart Title can be placed above, below, or either side of the chart, and be left, center or right aligned.",
                title: "Angular Chart Title",
                pageTitle: "Angular Chart Title",
                metaDescription: "Demonstrates chart title with different position and alignment options",
                markdownContent:
                    "# ChartTitle - Angular\n\n## Overview\nThis example demonstrates the integration of SciChart.js within an Angular application to dynamically manage and update a chart title. The chart title is highly configurable, allowing placement above, below, or to either side of the chart, with flexible alignment options such as left, center, or right. By leveraging Angular’s modular architecture, this example ensures a responsive and maintainable charting solution.\n\n## Technical Implementation\nThe implementation encapsulates the SciChart.js initialization logic within Angular services, employing dependency injection as outlined in the [Introduction to services and dependency injection](https://angular.io/guide/architecture-services) documentation. Angular lifecycle hooks, such as ngOnInit, are used to initialize the chart and manage real-time updates using JSON-driven configuration, in line with the guidelines provided by [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/). Additionally, techniques like RxJS integration support asynchronous data streams and real-time chart title updates.\n\n## Features and Capabilities\nThis example offers several advanced features including **real-time updates** that reflect immediate changes in the chart title; **advanced customization** of title properties such as alignment, position, and multiline configurations; and efficient handling of WebGL rendering for optimal performance. These capabilities ensure that dynamic data binding and event handling are integrated seamlessly into the Angular framework.\n\n## Integration and Best Practices\nThe solution follows Angular best practices for third-party library integration. It makes extensive use of dependency injection to encapsulate SciChart.js logic and lifecycle hooks to manage component initialization and updates, as documented in [Component Lifecycle - Angular](https://angular.io/guide/lifecycle-hooks). Performance optimizations are achieved by integrating Angular change detection techniques along with efficient WebGL canvas management, reflecting insights from [Angular Performance Optimization - Dave Bush](https://davembush.medium.com/angular-performance-optimization-5ec630d2b8f1). This structured approach facilitates scalable and maintainable charting applications within the Angular ecosystem.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/SciChart_JS_User_Manual.html",
                title: "The SciChart.js documentation contains loads of useful information on how to use our High Performance JavaScript Charts",
                linkTitle: "SciChart.js Documentation Home",
            },
        ],
        path: "chart-title",
        metaKeywords: "title, text, alignment, multiline, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "FeaturedApps/FeatureDemos/ChartTitle",
        thumbnailImage: "javascript-chart-title.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const chartTitleExampleInfo = createExampleInfo(metaData);
