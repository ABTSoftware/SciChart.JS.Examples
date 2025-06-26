import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";
import { EPageLayout } from "../../../../../helpers/types/types";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "FeaturedAppsShowCasesServerTrafficDashboard",
        imagePath: "javascript-server-traffic-dashboard.jpg",
        description:
            "Demonstrates handling realtime big data with different chart types using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates handling realtime big data with different chart types using SciChart.js, High Performance JavaScript Charts",
                title: "Server Traffic Dashboard",
                pageTitle: "Server Traffic Dashboard",
                metaDescription:
                    "This dashboard demo showcases the incredible realtime performance of our JavaScript charts by updating the series with millions of data-points!",
                markdownContent:
                    '## Server Traffic Dashboard (JavaScript)\n\n### Overview\nThis example, "Server Traffic Dashboard," demonstrates how to create a sophisticated real-time dashboard using SciChart.js with a pure JavaScript approach. The dashboard displays multiple interlinked charts—such as overall request rates, URL statistics, server load, and regional breakdowns—while offering interactive controls and smooth animations to provide deep insights into server traffic patterns.\n\n### Technical Implementation\nThe implementation leverages SciChart.js’s core capabilities to handle high-performance rendering and real-time updates. For instance, the synchronization of the x-axis visible range across charts is managed by the custom `VisibleRangeSynchronizationManager`, a solution that follows the practices outlined in the [Synchronizing Multiple Charts](https://www.scichart.com/documentation/js/current/Synchronizing%20Multiple%20Charts.html) documentation. In addition, a `GridLayoutModifier` is used to dynamically rearrange the server load chart into a grid of sub-charts, a technique closely related to concepts found in the [What is the SubCharts API?](https://www.scichart.com/documentation/js/current/WhatIsTheSubChartsAPI.html) documentation. The code also makes extensive use of data grouping and filtering techniques to efficiently process large datasets in JavaScript. `CustomPaletteProvider` dynamically adjusts the color of data points based on computed values (such as average duration), a feature that is well explained in the [PaletteProvider API](https://www.scichart.com/documentation/js/current/The%20PaletteProvider%20API.html) reference. Additionally, animations for smooth transitions and updates are implemented using `GenericAnimation` and `WaveAnimation`, as described in the [Generic Animations](https://www.scichart.com/documentation/js/current/Generic%20Animations.html) documentation.\n\n### Features and Capabilities\nThe dashboard supports real-time updates by clearing and appending new data to the charts, ensuring that the displayed information is always current. Interactive modifiers such as `CursorModifier`, `RolloverModifier`, and various zoom and pan modifiers enrich the user experience by providing detailed tooltips and responsive navigation. A notable feature is the interactive threshold slider, which allows users to adjust parameters like the average duration threshold; this, in turn, changes the conditional coloring of data points in real time. These techniques not only improve usability but also demonstrate effective methods for managing large datasets in a high-performance charting environment.\n\n### Integration and Best Practices\nWhile some components hint at integrations typically seen with React, this example is implemented entirely with JavaScript. It follows best practices by extending functionality through mechanisms such as `chartBuilder.registerFunction` — enabling advanced customization and modular configuration as noted in the [Complex Options](https://www.scichart.com/documentation/js/current/Complex%20Options.html) documentation. The example also illustrates how to synchronize mouse events across charts using a custom `ModifierGroup`, ensuring that user interactions such as hovering and selection are consistently propagated. Developers looking to optimize performance and interactivity in their own projects should review the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) documentation for further guidance.',
            },
            react: {
                subtitle:
                    "Demonstrates handling realtime big data with different chart types using SciChart.js, High Performance JavaScript Charts",
                title: "Server Traffic Dashboard",
                pageTitle: "Server Traffic Dashboard",
                metaDescription:
                    "This dashboard demo showcases the incredible realtime performance of our React charts by updating the series with millions of data-points!",
                markdownContent:
                    '## Server Traffic Dashboard - React Example\n\n### Overview\nThis React-based example, "Server Traffic Dashboard," demonstrates how to build a complex, interactive dashboard using SciChart.js within a React application. The dashboard brings together multiple charts—including a main time series chart, a page statistics chart, a server load chart, and region-based charts (both column and pie charts)—to provide a comprehensive view of server traffic and performance data.\n\n### Technical Implementation\nThe example is structured around React hooks and  `<SciChartReact/>` components to manage lifecycle events and context. It uses a custom `VisibleRangeSynchronizationManager` to coordinate zooming and panning across different chart surfaces; see the [Synchronizing Multiple Charts](https://www.scichart.com/documentation/js/current/Synchronizing%20Multiple%20Charts.html) documentation for more details. Custom tooltip templates are implemented via option functions registered with the ChartBuilder API, as described in the [Complex Options](https://www.scichart.com/documentation/js/current/Complex%20Options.html) guide. Dynamic styling is achieved through a `CustomPaletteProvider` that adjusts point markers based on metadata, following the guidelines in the [PaletteProvider API](https://www.scichart.com/documentation/js/current/The%20PaletteProvider%20API.html). Additionally, a specialized `GridLayoutModifier` enables the transformation of the server load chart into a grid of sub-charts with smooth animations, which is in line with techniques presented in the [SubCharts Worked Example](https://www.scichart.com/documentation/js/current/SubChartsWorkedExample10x10Grid.html).\n\n### Features and Capabilities\nKey features include real-time data updates, interactive data filtering, and advanced tooltips that display aggregated statistics (such as average request duration). The dashboard also supports a 100% stacked column view for URL statistics, which aggregates data across different pages as detailed in our [Stacked Column Chart](https://www.scichart.com/documentation/js/current/The%20Stacked%20Column%20Series%20Type.html) resources. Interactive animations and hover effects are implemented using the `GenericAnimation` framework ([Generic Animations](https://www.scichart.com/documentation/js/current/Generic%20Animations.html)), and mouse event synchronization across chart modifiers is managed by a custom `ModifierGroup` class.\n\n### Integration and Best Practices\nThe implementation demonstrates excellent integration with React by encapsulating individual charts into `<SciChartReact/>` components and coordinating them through a shared context and a chart group loader. Techniques for real-time updates are implemented to ensure efficient rendering and smooth performance, as recommended in [Realtime Updates](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html). Additionally, advanced synchronization of mouse events across multiple charts highlights best practices for interactive dashboards; more details can be found in the [Synchronizing ChartModifier Mouse Events](https://www.scichart.com/synchronizing-chartmodifier-mouse-events-across-charts/) article. For further insights into integrating SciChart.js with React, developers are encouraged to review the [React Charts with SciChart.js](https://www.scichart.com/blog/react-charts-with-scichart-js/) blog post.',
            },
            angular: {
                subtitle:
                    "Demonstrates handling realtime big data with different chart types using SciChart.js, High Performance JavaScript Charts",
                title: "Server Traffic Dashboard",
                pageTitle: "Server Traffic Dashboard",
                metaDescription:
                    "This dashboard demo showcases the incredible realtime performance of our Angular charts by updating the series with millions of data-points!",
                markdownContent:
                    "## Server Traffic Dashboard on Angular\n\n### Overview\nThis example demonstrates a comprehensive server traffic dashboard implemented using SciChart.js within an Angular framework. It showcases real-time data updates across multiple chart types including a main chart, URL statistics, server load, and region statistics, offering interactive exploration and high performance visualization capabilities.\n\n### Technical Implementation\nThe dashboard is built by asynchronously initializing several SciChart surfaces using `ScichartAngularComponent` from [scichart-angular](https://www.npmjs.com/package/scichart-angular). Each chart is configured via dedicated Angular services which manage state updates and inter-chart communication. The implementation employs a visible range synchronization manager that ensures the x-axis visible ranges remain consistent across charts as detailed in the [Synchronizing Multiple Charts](https://www.scichart.com/documentation/js/current/Synchronizing%20Multiple%20Charts.html) guide. Custom modifiers such as the `GridLayoutModifier` leverage SciChart.js’ `GenericAnimation` API to provide smooth grid formation and transition effects, which aligns with best practices for implementing [Angular animations](https://scichart.com/demo/angular/style-animation).\n\n### Features and Capabilities\nKey features include real-time data filtering based on server and location selections, dynamic chart updating, and interactive tooltips defined through custom palette providers registered with the chart builder. Advanced interactivity is achieved with custom rollover and cursor modifiers that enhance user engagement. Performance considerations are addressed by optimizing render routines to handle large data volumes, as described in the [Performance Optimization Tips](https://www.scichart.com/documentation/js/current/Performance%20Tips.html).\n\n### Integration and Best Practices\nFrom an Angular integration perspective, this dashboard illustrates effective state management and component communication techniques, crucial for real-time data visualization. It adopts a responsive grid layout rendered through Angular, ensuring that charts resize and update seamlessly. Developers are encouraged to review [Angular real-time data visualization](/angular/chart-realtime-performance-demo) and component interaction guidance on managing chart thresholds and synchronization, aligning with best practices for implementing interactive dashboards in Angular. Additionally, custom theming and tooltip configurations provided via SciChart.js enhance the overall user experience, marking this example as a robust reference for high-performance Angular dashboard development.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/SciChart_JS_User_Manual.html",
                title: "The SciChart.js documentation contains loads of useful information on how to use our High Performance JavaScript Charts",
                linkTitle: "SciChart.js Documentation Home",
            },
        ],
        path: "server-traffic-dashboard",
        metaKeywords: "realtime, performance, demo, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "FeaturedApps/ShowCases/ServerTrafficDashboard",
        thumbnailImage: "javascript-server-traffic-dashboard.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "max-width",
        extraDependencies: {
            country_flag_icons: "^1.5.7",
        },
    };
//// End of computer generated metadata

export const serverTrafficDashboardDemoExampleInfo = createExampleInfo(metaData);
