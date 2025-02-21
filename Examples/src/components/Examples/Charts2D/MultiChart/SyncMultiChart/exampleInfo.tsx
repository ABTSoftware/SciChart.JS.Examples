import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DMultiChartSyncMultiChart",
        imagePath: "javascript-sync-multi-chart.jpg",
        description:
            "This example demonstrates how to synchronise layout and visible range across multiple dynamic charts, and how to synchronise series with an overview chart.using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "This example demonstrates how to synchronise layout and visible range across multiple dynamic charts, and how to synchronise series with an overview chart.using SciChart.js, High Performance JavaScript Charts",
                title: "Synchronise Multiple Charts",
                pageTitle: "Synchronise Multiple Charts",
                metaDescription: "Synchronise multiple dynamic charts and overview",
                markdownContent:
                    "# Synchronise Multiple Charts using Vanilla JavaScript\n\n### Overview\nThis example demonstrates how to synchronise layout, visible ranges, and data series across multiple dynamic charts using SciChart.js in a vanilla JavaScript environment. The implementation includes a manually configured overview chart that controls the visible range for all the main charts, delivering a cohesive and interactive dashboard experience.\n\n### Technical Implementation\nThe example employs a custom **AxisSynchroniser** class that implements custom event handling to listen for visible range changes and propagate updates to all linked axes. For details on how to listen to visible range changes, refer to the [Axis Ranging Documentation](https://www.scichart.com/documentation/js/current/Axis%20Ranging%20-%20How%20to%20Listen%20to%20VisibleRange%20Changes.html). In addition, the overview chart is manually implemented by adding an [OverviewRangeSelectionModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/overviewrangeselectionmodifier.html) to a standard SciChartSurface. This approach ensures that when the selected area in the overview changes, the new range is immediately applied to the main charts. The overall coordination of multiple charts is in line with the techniques described in [Synchronizing Multiple Charts](https://www.scichart.com/documentation/js/current/Synchronizing%20Multiple%20Charts.html) and the methods outlined in [Linking JavaScript Charts and Synchronising Zooming, Panning, Crosshairs](https://www.scichart.com/blog/how-to-link-javascript-charts-and-synchronise-zooming-panning-crosshairs/).\n\n### Features and Capabilities\nThis example showcases several advanced features, including real-time dynamic chart rendering, coordinated zooming and panning through modifier groups such as **RolloverModifier** and **RubberBandXyZoomModifier**, and dynamic addition or removal of chart instances. The ability to clone renderable series for integration into the overview chart ensures that data continuity is maintained without data duplication.\n\n### Integration and Best Practices\nBy relying solely on vanilla JavaScript, the example adheres to efficient memory and resource management practices, including the proper cleanup of SciChartSurface objects when charts are removed. For further guidance on integrating SciChart.js and optimising performance, developers are encouraged to review the [SciChart.js JavaScript Charts User Manual](https://www.scichart.com/documentation/js/current/SciChart_JS_User_Manual.html) and the article on [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/). The techniques demonstrated here provide a solid foundation for building high-performance, interactive chart dashboards with SciChart.js.",
            },
            react: {
                subtitle:
                    "This example demonstrates how to synchronise layout and visible range across multiple dynamic charts, and how to synchronise series with an overview chart.using SciChart.js, High Performance JavaScript Charts",
                title: "Synchronise Multiple Charts",
                pageTitle: "Synchronise Multiple Charts",
                metaDescription: "Synchronise multiple dynamic charts and overview",
                markdownContent:
                    "# Synchronise Multiple Charts - React\n\n### Overview\nThis example demonstrates how to synchronise layout and visible range across multiple dynamic charts in a React application using SciChart.js. It features a main overview chart that is linked to several dynamic charts, allowing the user to zoom and pan in one chart and see the changes reflected in the others.\n\n### Technical Implementation\nThe implementation utilizes React hooks such as useState, useRef, and useEffect to manage the lifecycle of each SciChartSurface component dynamically. A custom **AxisSynchroniser** class manages the visible range updates for all linked X axes, ensuring synchronized navigation across charts. The example also demonstrates how to clone series for the overview chart using SciChart.js methods, and integrates various chart modifiers like RolloverModifier, RubberBandXyZoomModifier, ZoomPanModifier, and MouseWheelZoomModifier to enhance interactivity. For further technical details on synchronizing charts, refer to the [Synchronizing Multiple Charts Documentation](https://www.scichart.com/documentation/js/current/Synchronizing%20Multiple%20Charts.html).\n\n### Features and Capabilities\nThis example offers several advanced features including real-time dynamic chart rendering, coordinated zooming and panning across multiple charts, and interactive adding or removing of chart components. Custom event handling through the **AxisSynchroniser** class allows for smooth updates between the main charts and the overview. The efficient use of [custom event handling for axis ranging](https://www.scichart.com/documentation/js/current/Axis%20Ranging%20-%20How%20to%20Listen%20to%20VisibleRange%20Changes.html) ensures that performance remains optimal even during dynamic data updates.\n\n### Integration and Best Practices\nBuilt exclusively with React, this example highlights best practices for integrating third-party libraries like SciChart.js into a React project. The use of refs for managing instances such as SciChartVerticalGroup, combined with meticulous cleanup within the useEffect hook, adheres to performance optimization techniques as detailed in the [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html). Additionally, the integration of Material UI components for layout management provides a clear example of how to combine modern UI toolkits with high-performance charting. Developers looking for an in-depth understanding of React integration can explore the guidance provided in [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html).",
            },
            angular: {
                subtitle:
                    "This example demonstrates how to synchronise layout and visible range across multiple dynamic charts, and how to synchronise series with an overview chart.using SciChart.js, High Performance JavaScript Charts",
                title: "Synchronise Multiple Charts",
                pageTitle: "Synchronise Multiple Charts",
                metaDescription: "Synchronise multiple dynamic charts and overview",
                markdownContent:
                    '# Synchronise Multiple Charts - Angular\n\n### Overview\nThis example, "Synchronise Multiple Charts", demonstrates how to synchronise layout, visible ranges, and data series across multiple dynamic chart components in an Angular application using SciChart.js. The implementation focuses on coordinating zoom, pan, and overview series updates among various charts to deliver a consistent and responsive dashboard experience.\n\n### Technical Implementation\nThe core of the implementation is a custom **AxisSynchroniser** class that manages the visible range state across multiple X axes. Each chart’s axis subscribes to range change events, and any update is propagated to all linked charts. The charts are created dynamically by invoking SciChart.js methods such as SciChartSurface.create and instantiating axes like NumericAxis, without the use of a Builder API, ensuring that every chart is independently rendered and easily synchronised. This approach also leverages Angular’s component lifecycle techniques (similar to ngOnInit and ngOnDestroy as explained in the [Angular Component Lifecycle](https://angular.io/guide/lifecycle-hooks)) to handle proper initialisation and cleanup, thereby avoiding memory leaks as detailed in the [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) documentation.\n\n### Features and Capabilities\nThe example supports real-time updating of charts with dynamic data, synchronized zooming and panning, and an interactive overview chart that controls the visible range of the main charts. Users can dynamically add or remove charts, and toggle synchronization using built-in UI controls. The custom implementation seamlessly links the primary charts with an overview component by copying series data and manually managing event handlers for range updates. This interactivity and custom synchronisation mechanism reflect advanced features of SciChart.js and provide a robust foundation for developing high-performance, multi-chart Angular dashboards.\n\n### Integration and Best Practices\nDesigned specifically for Angular, this example follows best practices for integration by utilising Angular Material and Flexbox for layout management, ensuring a fully responsive multi-chart dashboard as described in resources like [Angular Material and CSS Flex Layout](https://stackoverflow.com/questions/78878905/angular-material-and-css-flex-layout). Additionally, efficient resource management is demonstrated through rigorous cleanup routines and controlled event subscription handling, principles that are essential in Angular applications. For organizing chart synchronisation logic, the use of dependency injection with Angular services can further modularise and enhance maintainability, aligning with the strategies outlined in [Angular Services and Dependency Injection Explained](https://angular.io/guide/architecture-services). Finally, developers interested in advanced synchronisation techniques might find it beneficial to review the strategies provided in the [Tutorial 09 - Linking Multiple Charts](https://www.scichart.com/documentation/js/current/Tutorial%2009%20-%20Linking%20Multiple%20Charts.html) for a deeper technical context.',
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/Tutorial%2009%20-%20Linking%20Multiple%20Charts.html",
                title: "This is a tutorial for how to synchronise the axis and modifiers for multiple charts",
                linkTitle: "SciChart.js Synchronise Charts Tutorial",
            },
            {
                href: "https://www.scichart.com/documentation/js/current/SciChartOverview.html",
                title: "This specific page in the JavaScript SciChartOverview Api documentation will help you to get started",
                linkTitle: "SciChart.js Overview Documentation",
            },
        ],
        path: "sync-multi-chart",
        metaKeywords: "axis, synchronise, multiple, charts, overview, zoom, pan, javascript, webgl, canvas",
        onWebsite: false,
        filepath: "Charts2D/MultiChart/SyncMultiChart",
        thumbnailImage: "javascript-sync-multi-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const syncMultiChartExampleInfo = createExampleInfo(metaData);
