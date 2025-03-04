import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DModifyAxisBehaviorCentralAxes",
        imagePath: "javascript-central-axes.jpg",
        description:
            "Demonstrates how to create a **JavaScript Chart with central axes** using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to create a **JavaScript Chart with central axes** using SciChart.js, High Performance JavaScript Charts",
                title: "JavaScript Chart with Central Axes",
                pageTitle: "JavaScript Chart with Central Axes",
                metaDescription:
                    "Demonstrates Central Axes on a JavaScript Chart using SciChart.js. SciChart supports unlimited left, right, top, bottom X, Y axis with configurable layout",
                markdownContent:
                    "## Central Axes Vanilla JavaScript Chart\n\n### Overview\nThis example demonstrates how to create a high-performance chart with **central axes** using SciChart.js in a vanilla JavaScript framework. The chart positions the x and y axes to cross at the data value (0,0), producing an oscilloscope-like layout. It leverages the advanced customization available in SciChart.js for axis placement, as detailed in the [Central Axis Layout documentation](https://www.scichart.com/documentation/js/current/CentralAxisLayout.html).\n\n### Technical Implementation\nThe implementation begins by initializing a SciChartSurface with an integrated WebAssembly context, following guidelines from the [Tutorial 01 - Including SciChart.js in an HTML Page using CDN](https://www.scichart.com/documentation/js/current/Tutorial01IncludingSciChartjsHTMLPage.html) documentation. Both the x and y axes are configured as inner axes by enabling the **isInnerAxis** property and aligned to the center using the CentralAxesLayoutManager with data value based positioning. A dynamically generated butterfly curve is rendered using the **FastLineRenderableSeries** and utilizes a fade animation as provided by the [Animations API](https://www.scichart.com/documentation/js/current/Animations%20API.html) for performance and visual enhancement. Interaction is further enriched with modifiers such as [ZoomPanModifier](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html), MouseWheelZoomModifier, and ZoomExtentsModifier, which support smooth zooming and panning.\n\n### Features and Capabilities\nThis example showcases advanced chart capabilities such as real-time data rendering for complex curves and dynamic interactivity. The efficient use of WebAssembly ensures high performance even when visualizing large data sets. Additionally, the chart demonstrates clear separation of concerns by isolating initialization, axis configuration, data rendering, and user interaction, which allows for robust customization based on the application’s needs.\n\n### Integration and Best Practices\nIntegrating SciChart.js into a vanilla JavaScript application is streamlined by employing a modular approach where the chart initialization function is directly invoked with a designated root element. Resource cleanup is handled by returning a destructor function that calls the delete() method on the SciChartSurface, in line with best practices suggested in the [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) documentation. Developers looking to extend or optimize their chart applications can also refer to the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide for additional insights on integration and performance optimization.",
            },
            react: {
                subtitle:
                    "Demonstrates how to create a **React Chart with central axes** using SciChart.js, High Performance JavaScript Charts",
                title: "React Chart with Central Axes",
                pageTitle: "React Chart with Central Axes",
                metaDescription:
                    "Demonstrates Central Axes on a React Chart using SciChart.js. SciChart supports unlimited left, right, top, bottom X, Y axis with configurable layout",
                markdownContent:
                    "## React Chart with Central Axes\n\n### Overview\nThis example demonstrates how to create a high performance React chart with central axes using SciChart.js. The chart leverages a custom central axes layout, showcasing how axes can be positioned in the center of the chart by setting the inner axis properties and using the CentralAxesLayoutManager.\n\n### Technical Implementation\nThe chart is initialized through the SciChartReact component by passing the drawExample function as a prop, a pattern that follows [best practices for React integration](https://www.scichart.com/blog/react-charts-with-scichart-js/). The drawExample function sets up the SciChartSurface and configures the central axes by using the CentralAxesLayoutManager with options that specify data value based positioning. NumericAxis instances are added with the inner axis flag enabled to ensure that the axes are rendered inside the chart. For more detailed information on central axis customization, please refer to the [Central Axis Layout documentation](https://www.scichart.com/documentation/js/current/CentralAxisLayout.html).\n\n### Features and Capabilities\nThe example features an efficient data series generation that calculates a butterfly curve and displays it using FastLineRenderableSeries with a fade animation, as described in [The Animations API](https://www.scichart.com/documentation/js/current/Animations%20API.html). Interaction is enhanced by including several chart modifiers such as ZoomPanModifier, MouseWheelZoomModifier, and ZoomExtentsModifier, providing dynamic zoom and pan capabilities which can be explored further in the [ZoomPanModifier documentation](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html). Additionally, a text annotation is added to explain the chart's functionality.\n\n### Integration and Best Practices\nThis React implementation follows a modular approach by using the SciChartReact component to encapsulate chart initialization, making it easier to integrate SciChart.js into larger React applications. The example illustrates proper use of inner axis configurations with NumericAxis, supporting efficient performance and clear visual presentation. Developers looking to extend the feature set or optimize performance can find further guidance in the [Numeric Axis documentation](https://www.scichart.com/documentation/js/current/NumericAxis.html) as well as the [React Charts with SciChart.js article](https://www.scichart.com/blog/react-charts-with-scichart-js/).",
            },
            angular: {
                subtitle:
                    "Demonstrates how to create a **Angular Chart with central axes** using SciChart.js, High Performance JavaScript Charts",
                title: "Angular Chart with Central Axes",
                pageTitle: "Angular Chart with Central Axes",
                metaDescription:
                    "Demonstrates Central Axes on a Angular Chart using SciChart.js. SciChart supports unlimited left, right, top, bottom X, Y axis with configurable layout",
                markdownContent:
                    "## Angular Chart with Central Axes Example\n\n### Overview\nThis Angular example demonstrates how to create a high-performance chart with **central axes** using SciChart.js. The chart positions both axes in the center by using a custom central axis layout and inner axis configuration. It leverages the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package, which simplifies integration with Angular projects.\n\n### Technical Implementation\nThe implementation initializes a SciChartSurface using the Angular standalone component, which passes the chart setup function through the [initChart] property. The chart employs the **CentralAxesLayoutManager** with options set to position the axes based on data values, ensuring that the axes cross at (0,0). Both the x and y axes are defined as inner axes by enabling the **isInnerAxis** property, as detailed in the [Numeric Axis documentation](https://www.scichart.com/documentation/js/current/NumericAxis.html). A **FastLineRenderableSeries** is used to render a dynamically generated butterfly curve, with a fade animation enhancing performance. Additional interactivity is provided through the **ZoomPanModifier**, **MouseWheelZoomModifier**, and **ZoomExtentsModifier**, which offer smooth zooming and panning as described in the [Tutorial 03 - Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html).\n\n### Features and Capabilities\nThis example highlights advanced chart capabilities such as real-time updates, dynamic data rendering, and a unique oscilloscope style layout. The efficient rendering of complex data series, such as the butterfly curve, is optimized by the use of fast line series and fade animations, supporting high performance even with large data sets. For insights into performance optimization, developers can refer to the techniques discussed in [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/).\n\n### Integration and Best Practices\nFollowing Angular best practices, the example uses a standalone component to encapsulate chart initialization, which promotes modularity and ease of management within larger Angular applications. Developers are encouraged to consult the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide and the [Central Axis Layout documentation](https://www.scichart.com/documentation/js/current/CentralAxisLayout.html) for further details on advanced axis customization and integration techniques. This example provides a robust reference for implementing complex axis layouts, interactive modifiers, and performance optimizations in Angular environments.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/CentralAxisLayout.html",
                title: "SciChart.js Central Axis Documentation page",
                linkTitle: "Central Axis documentation",
            },
        ],
        path: "central-axes",
        metaKeywords: "multiple, axis, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/ModifyAxisBehavior/CentralAxes",
        thumbnailImage: "javascript-central-axes.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const centralAxesExampleInfo = createExampleInfo(metaData);
