import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DFiltersPercentageChange",
        imagePath: "javascript-percentage-change.jpg",
        description:
            "Demonstrates how to use a ScaleOffsetFilter to convert data to a **Percentage Change** with realtime updates, using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to use a ScaleOffsetFilter to convert data to a **Percentage Change** with realtime updates, using SciChart.js, High Performance JavaScript Charts",
                title: "Realtime Percentage Change using Filter",
                pageTitle: "Realtime Percentage Change using Filter",
                metaDescription:
                    "How to use a ScaleOffsetFilter to convert data to a percentage change, with realtime updates, rescale on pan",
                markdownContent:
                    "# Percentage Change Example in Vanilla JavaScript\n\n## Overview\nThis example demonstrates how to transform raw data into a real-time percentage change chart using SciChart.js with Vanilla JavaScript. It converts random walk data into percentage-based visualizations and offers dynamic interactivity with high performance.\n\n## Technical Implementation\nThe implementation generates two random walk data series that are transformed using the [XyScaleOffsetFilter](https://www.scichart.com/documentation/js/current/Scale%20Offset%20Filters.html) to calculate percentage changes. By subscribing to the x-axis visible range changes, the chart dynamically adjusts the filter scale in real time, as detailed in the [Adding Realtime Updates documentation](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html). Furthermore, a custom series extending the fast line renderable series is implemented to override tooltip behavior, providing precise display of original values—techniques similar to those covered in [Tutorial 07 - Adding Tooltips and Legends](https://www.scichart.com/documentation/js/current/Tutorial%2007%20-%20Adding%20Tooltips%20and%20Legends.html).\n\n## Features and Capabilities\nThe example incorporates real-time data transformation and interactive features such as zooming and panning using modifiers like the [ZoomPanModifier](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html). It also provides a toggle mechanism to switch between the original data and its percentage change view, ensuring an engaging and informative user experience. Data simulation is achieved via the RandomWalkGenerator, echoing strategies used in the [Realtime JavaScript Chart Performance Demo](https://demo.scichart.com/javascript/chart-realtime-performance-demo).\n\n## Integration and Best Practices\nFocusing on Vanilla JavaScript, the example emphasizes clean integration with SciChart.js by adhering to event-driven update patterns and performance optimization techniques. By limiting updates to essential parameters and leveraging efficient WebGL rendering, the implementation serves as a robust template for developers aiming to build interactive, high-performance charts with SciChart.js.",
            },
            react: {
                subtitle:
                    "Demonstrates how to use a ScaleOffsetFilter to convert data to a **Percentage Change** with realtime updates, using SciChart.js, High Performance JavaScript Charts",
                title: "Realtime Percentage Change using Filter",
                pageTitle: "Realtime Percentage Change using Filter",
                metaDescription:
                    "How to use a ScaleOffsetFilter to convert data to a percentage change, with realtime updates, rescale on pan",
                markdownContent:
                    "# Percentage Change Example using React\n\n## Overview\nThis example demonstrates how to implement a real-time percentage change chart using SciChart.js in a React application. It showcases toggling between displaying the original data and a percentage change transformation in a high performance chart. The implementation leverages the powerful [SciChart React integration](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html) for embedding charts into a React component.\n\n## Technical Implementation\nThe core of the example is in the drawExample function, where a SciChartSurface is created. Two data series are generated using a Random Walk algorithm and then transformed using a ScaleOffsetFilter to compute a percentage change over a baseline. The X-axis visible range event (visibleRangeChanged) is used to update the scale factor of the transformation dynamically. Customizations include the extension of the FastLineRenderableSeries by creating a TransformedSeries class to override the getSeriesInfo method for precise tooltip display. For an in-depth understanding of SciChart.js filters, see the [ScaleOffsetFilter documentation](https://www.scichart.com/example/javascript-chart/javascript-percentage-change/).\n\n## Features and Capabilities\nThis example exhibits several advanced features: real-time data updates through reactive event handling, dynamic data transformation using the XyScaleOffsetFilter, and responsive chart annotations. It also demonstrates the use of custom number formatting, efficient re-rendering by forcing chart reinitialization using the React key prop, and a dual visualization mode toggled via a Material UI ToggleButtonGroup. Developers interested in event-driven data transformations can refer to the [event-driven updates documentation](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html) for further details.\n\n## Integration and Best Practices\nThe integration with React is facilitated by the SciChartReact component, which makes it simple to embed the SciChartSurface into the React component tree. The use of the key property in React ensures proper reinitialization when toggling between percentage change and original data modes, a best practice for managing component state resets as highlighted in common [React re-rendering techniques](https://medium.com/@albertogasparin/forcing-state-reset-on-a-react-component-by-using-the-key-prop-14b36cd7448e). Moreover, the example integrates Material UI’s ToggleButtonGroup to provide a seamless UI for switching chart modes, demonstrating best practices in combining Material UI with SciChart. For more on optimizing real-time chart performance in React, you might find this [React and SciChart performance optimization guide](https://www.scichart.com/blog/react-charts-with-scichart-js/) useful.\n",
            },
            angular: {
                subtitle:
                    "Demonstrates how to use a ScaleOffsetFilter to convert data to a **Percentage Change** with realtime updates, using SciChart.js, High Performance JavaScript Charts",
                title: "Realtime Percentage Change using Filter",
                pageTitle: "Realtime Percentage Change using Filter",
                metaDescription:
                    "How to use a ScaleOffsetFilter to convert data to a percentage change, with realtime updates, rescale on pan",
                markdownContent:
                    "# Realtime Percentage Change using Filter - Angular\n\n## Overview\nThis example demonstrates how to integrate SciChart.js with Angular for real-time data visualization. It focuses on converting series data into percentage change values by applying a dynamic [ScaleOffsetFilter](https://www.scichart.com/documentation/js/current/Scale%20Offset%20Filters.html) transformation and allows users to toggle between displaying the original data and the percentage change view.\n\n## Technical Implementation\nThe implementation initializes a SciChartSurface with numeric X and Y axes and adds two line series that use random walk data as their source. A custom renderable series is created by extending the default series class to provide enhanced tooltip information. The key part of the logic involves subscribing to axis changes to update the scale factor of the filter dynamically, ensuring that percentage changes are calculated in real-time. Detailed technical insights on custom series development can be found in the [Custom RenderableSeries API](https://www.scichart.com/documentation/js/current/The%20Custom%20RenderableSeries%20API.html).\n\n## Features and Capabilities\nThe example offers real-time data updates, dynamic percentage recalculations, and interactive features such as zooming and panning. It leverages Angular’s event handling to subscribe to axis range changes and apply corresponding transformations on the fly. Additionally, the sample emphasizes performance by updating only the necessary filter parameters, which optimizes rendering performance during continuous data updates. For further reading on real-time updates and performance optimization, refer to the [Adding Realtime Updates documentation](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html).\n\n## Integration and Best Practices\nThis example illustrates best practices for integrating SciChart.js into an Angular application. By utilizing component-based design and Angular’s robust event management system, developers can build charts that handle real-time data efficiently. Even though the source example originally demonstrates some concepts with React, the Angular integration follows a similar approach by using Angular-compatible toggle buttons and state management strategies. Developers interested in further Angular integrations should explore the [scichart-angular package](https://www.npmjs.com/package/scichart-angular) and review the [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) to ensure efficient resource management in high-performance applications.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/Scale%20Offset%20Filters.html",
                title: "This specific page in the JavaScript Filters API documentation will help you to get started",
                linkTitle: "SciChart.js ScaleOffsetFilter Documentation",
            },
        ],
        path: "percentage-change",
        metaKeywords: "real-time, updating, percentage, transform, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/Filters/PercentageChange",
        thumbnailImage: "javascript-percentage-change.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const percentageChangeExampleInfo = createExampleInfo(metaData);
