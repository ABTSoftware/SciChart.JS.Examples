import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "FeaturedAppsFeatureDemosAxisLayout",
        imagePath: "javascript-axis-layout.jpg",
        description:
            "The same data is rendered many to show the Axis Layout options in SciChart.js. Charts support outer, inner, central and stacked axes, and use of axis alignment to create vertical charts. Series may be registered on specific X,Y axis pairs for infinite layout configuration.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "The same data is rendered many to show the Axis Layout options in SciChart.js. Charts support outer, inner, central and stacked axes, and use of axis alignment to create vertical charts. Series may be registered on specific X,Y axis pairs for infinite layout configuration.",
                title: "JavaScript Chart Axis Layout Options",
                pageTitle: "JavaScript Chart Axis Layout Options",
                metaDescription:
                    "Demonstrates outer, inner, central and stacked axes, and use of axis alignment to create vertical charts",
                markdownContent:
                    '# Axis Layout Example in Vanilla JavaScript\n\n## Overview\nThis example demonstrates how to create a high-performance chart using SciChart.js with vanilla JavaScript. The "Axis Layout" example showcases advanced axis synchronization, customized styling, inner axis placement, and complex layout strategies to manage horizontal and vertical axes effectively.\n\n## Technical Implementation\nThe chart is created asynchronously by calling an async function that initializes a SciChartSurface on a provided HTML element. Multiple NumericAxes are defined with common styling options such as grid line and tick customization, with each axis configured individually. Visible range synchronization is achieved by subscribing to visibleRangeChanged events, ensuring that paired axes remain in sync. For more details on synchronizing axes, refer to the [Synchronizing Multiple Charts](https://www.scichart.com/documentation/js/current/Synchronizing%20Multiple%20Charts.html) documentation. Data is plotted using the FastLineRenderableSeries and XyDataSeries classes; these components are optimized for performance even with large datasets, as described in the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) guide.\n\n## Features and Capabilities\nThe example includes several advanced features such as inner axis layout. It uses the EInnerAxisPlacementCoordinateMode.DataValue to position inner axes precisely, information on which can be found in the [EInnerAxisPlacementCoordinateMode](https://www.scichart.com/documentation/js/current/typedoc/enums/einneraxisplacementcoordinatemode.html) documentation. In addition, a right-aligned vertically stacked axis layout strategy is employed through the RightAlignedOuterVerticallyStackedAxisLayoutStrategy, details of which are provided in the [Vertically Stacked Axis Layout](https://www.scichart.com/documentation/js/current/Axis%20Layout%20-%20Vertically%20Stacked%20Axis.html) documentation. Interactive chart modifiers such as ZoomPanModifier, XAxisDragModifier, and YAxisDragModifier are added to enable zooming, panning, and dragging interactions. You can learn more about these modifiers in their respective [XAxisDragModifier](https://www.scichart.com/documentation/js/current/XAxisDragModifier.html) and [ZoomPanModifier](https://www.scichart.com/documentation/js/current/CustomChartModifierAPI.html) pages.\n\n## Integration and Best Practices\nThe example is written in plain vanilla JavaScript without relying on frameworks, although additional files demonstrate integration with Angular and React. Resource management is handled by calling the sciChartSurface.delete() method when the chart is no longer needed, following best practices as outlined in the [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) documentation. Asynchronous initialization using promises is critical in this project to ensure that all chart components are loaded correctly. Customization of axis borders and styles is implemented with configuration options detailed in the [Axis Borders and Background](https://www.scichart.com/documentation/js/current/Axis%20Styling%20-%20Axis%20Borders.html) guide. For further guidance on integrating SciChart.js in a non-framework project, see the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) documentation.',
            },
            react: {
                subtitle:
                    "The same data is rendered many to show the Axis Layout options in SciChart.js. Charts support outer, inner, central and stacked axes, and use of axis alignment to create vertical charts. Series may be registered on specific X,Y axis pairs for infinite layout configuration.",
                title: "React Chart Axis Layout Options",
                pageTitle: "React Chart Axis Layout Options",
                metaDescription:
                    "Demonstrates outer, inner, central and stacked axes, and use of axis alignment to create vertical charts",
                markdownContent:
                    "# Axis Layout Example - React\n\n## Overview\nThis example demonstrates the integration of SciChart.js within a React application using the SciChartReact component. It showcases advanced axis layout options by configuring outer, inner, central, and stacked axes to achieve a highly customizable and dynamic chart.\n\n## Technical Implementation\nThe chart is initialized by passing an asynchronous function via the initChart prop on the SciChartReact component, which creates and configures the SciChartSurface using JSON-based settings. Multiple axes are instantiated with various configurations such as flipped coordinates, custom axis alignment, and dynamic positioning using the RightAlignedOuterVerticallyStackedAxisLayoutStrategy. Event subscriptions like visibleRangeChanged are used to synchronize axis ranges across the chart, ensuring real-time updates. For more detailed guidance on initializing SciChart surfaces in React, refer to the [Tutorial on Setting Up a Project with scichart-react](https://www.scichart.com/documentation/js/current/TutorialSetupProjectWithSciChartReact.html).\n\n## Features and Capabilities\nKey features include real-time update capabilities and advanced customizations. The example binds unique data series to each axis pair with individually styled properties, and integrates interactive modifiers such as ZoomPanModifier, XAxisDragModifier, and YAxisDragModifier to enhance user interaction. These features guarantee high-performance rendering through WebGL and ensure that extensive diagnostic and performance tuning across axes is possible. Additional insights into performance optimizations can be found in [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/).\n\n## Integration and Best Practices\nThis implementation exemplifies robust React integration by leveraging React hooks along with the SciChartReact component, thereby ensuring efficient lifecycle management and update synchronization. Developers are encouraged to explore best practices in React component optimization and state management as demonstrated in [React Charts with SciChart.js](https://www.scichart.com/blog/react-charts-with-scichart-js/). Furthermore, the example utilizes advanced custom axis layout techniques as detailed in the [SciChart.js Axis Documentation](https://www.scichart.com/documentation/js/current/webframe.html#StartHere-AxisOverview.html), and best practices for performance using React hooks such as useMemo and useCallback, as described in [Mastering useCallback and useMemo in React: A Deep Dive into Performance Optimization](https://javascript.plainenglish.io/mastering-usecallback-and-usememo-in-react-a-deep-dive-into-performance-optimization-263a33962a29).",
            },
            angular: {
                subtitle:
                    "The same data is rendered many to show the Axis Layout options in SciChart.js. Charts support outer, inner, central and stacked axes, and use of axis alignment to create vertical charts. Series may be registered on specific X,Y axis pairs for infinite layout configuration.",
                title: "Angular Chart Axis Layout Options",
                pageTitle: "Angular Chart Axis Layout Options",
                metaDescription:
                    "Demonstrates outer, inner, central and stacked axes, and use of axis alignment to create vertical charts",
                markdownContent:
                    "# AxisLayout Example - Angular\n\n## Overview\nThis example illustrates advanced **axis layout** customization using SciChart.js within the Angular framework. It demonstrates the configuration of outer, inner, central, and stacked axes, while enabling dynamic real-time data updates.\n\n## Technical Implementation\nThe implementation is encapsulated in an Angular standalone component that leverages the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package for seamless integration with Angular’s dependency injection and lifecycle hooks. The chart is initialized via the SciChartSurface.create function and axes are instantiated using direct API calls from SciChart.js. The layout is fine-tuned using strategies such as the RightAlignedOuterVerticallyStackedAxisLayoutStrategy and is further enhanced by subscribing to events like visibleRangeChanged for synchronized axis updates. Developers can explore more about chart initialization in [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) and best practices for Angular components in the [Angular Standalone Components](https://angular.io/guide/standalone-components) guide.\n\n## Features and Capabilities\nThe example presents a rich set of features including real-time update capabilities, custom axis styling, and interactive modifiers such as ZoomPanModifier, XAxisDragModifier, and YAxisDragModifier. Each axis instance is uniquely configured with custom borders, tick styles, and label alignments to demonstrate the flexibility of SciChart.js. Advanced axis customization is discussed in detail in the [SciChart.js Axis Documentation](https://www.scichart.com/documentation/js/current/Axis%20Layout%20-%20Inside%20and%20Central%20Axis.html), which outlines effective techniques for managing inner and stacked axes.\n\n## Integration and Best Practices\nBy leveraging Angular’s dependency injection and lifecycle management (see [Component Lifecycle](https://angular.io/guide/lifecycle-hooks)), the example adheres to best practices for integrating external libraries into an Angular project. This approach ensures optimal performance and maintainability, allowing developers to build scalable, high-performance applications with dynamic WebGL-rendered charts.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#StartHere-AxisOverview.html",
                title: "SciChart.js Axis Documentation",
                linkTitle: "Scichart.js Axis Documentation",
            },
        ],
        path: "chart-axis-layout-options",
        metaKeywords: "stacked, axis, layout, alignment, vertical, javascript, webgl, canvas",
        onWebsite: false,
        filepath: "FeaturedApps/FeatureDemos/AxisLayout",
        thumbnailImage: "javascript-axis-layout.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const axisLayoutExampleInfo = createExampleInfo(metaData);
