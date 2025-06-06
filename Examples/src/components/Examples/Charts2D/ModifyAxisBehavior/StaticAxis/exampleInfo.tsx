import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DModifyAxisBehaviorStaticAxis",
        imagePath: "javascript-static-axis.jpg",
        description:
            "Demonstrates a realtime **JavaScript static axis chart** - where the ticks and gridlines are fixed, but the labels change.\nWith SciChart.js High Performance JavaScript Charts you can achieve this simply by setting isStaticAxis property to true on the X axis.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates a realtime **JavaScript static axis chart** - where the ticks and gridlines are fixed, but the labels change.\nWith SciChart.js High Performance JavaScript Charts you can achieve this simply by setting isStaticAxis property to true on the X axis.",
                title: "JavaScript Chart with Static X Axis",
                pageTitle: "JavaScript Chart with Static X Axis",
                metaDescription: "Demonstrates isStaticAxis on a JavaScript Chart using SciChart.js.",
                markdownContent:
                    "## Static Axis Example with JavaScript\n\n### Overview\nThis example demonstrates a real-time chart built with JavaScript using SciChart.js. The chart features two X axes: a **static axis_* where gridlines and tick positions remain fixed, and a **normal axis** that updates dynamically as new data streams in. By setting the property `axis.isStaticAxis` to true, the static axis ensures that while the labels change with incoming data, the label positions and gridline positions stay constant. More details on static axis behavior can be found in the [SciChart.js Static Axis Documentation](https://www.scichart.com/documentation/js/current/Static%20Axis.html).\n\n### Technical Implementation\nThe chart is initialized using the high-performance `SciChartSurface.create()` method passing in a custom theme. Two `NumericAxis` instances are created for the X axis: one configured with `isStaticAxis = true` and the other as a normal axis. The static axis subscribes to the `visibleRangeChanged` event to synchronize its visible range with the normal axis, a technique related to [axis synchronization](https://www.scichart.com/documentation/js/current/Synchronizing%20Multiple%20Charts.html). Real-time data is generated and appended to an `XyDataSeries` via a setInterval callback using the [dataSeries.appendRange](https://www.scichart.com/documentation/js/current/DataSeries_RealtimeUpdates.html) method, ensuring smooth, continuous updates. Additionally, a horizontal line annotation is added to highlight Y=0, showcasing the ability to integrate annotations seamlessly. Toggle buttons for 'Normal Axis' and 'Static Axis' call the `toggleStaticAxis()` function in `drawExample.ts`, setting which axis has `isPrimaryAxis` flag set to true, which defines which axis draws the gridlines.\n\n### Features and Capabilities\nKey features of this implementation include real-time update capabilities, dual X axis configuration with one axis maintaining static gridlines, and the integration of annotations. The synchronization between the static and normal axes ensures consistent visual behavior and improves readability during rapid updates. This multi-axis management approach aligns with practices detailed in the [Tutorial 08 - Adding Multiple Axis](https://www.scichart.com/documentation/js/current/Tutorial%2008%20-%20Adding%20Multiple%20Axis.html) documentation.\n\n### Integration and Best Practices\nDevelopers using JavaScript can integrate SciChart.js using this example as a baseline for high-performance, real-time charting applications. The approach emphasizes efficient data handling with FIFO data series (`XyDataSeries.fifoCapacity`) and leverages the performance benefits offered through WebAssembly integration.",
            },
            react: {
                subtitle:
                    "Demonstrates a realtime **React static axis chart** - where the ticks and gridlines are fixed, but the labels change.\nWith SciChart.js High Performance JavaScript Charts you can achieve this simply by setting isStaticAxis property to true on the X axis.",
                title: "React Chart with Static X Axis",
                pageTitle: "React Chart with Static X Axis",
                metaDescription: "Demonstrates isStaticAxis on a React Chart using SciChart.js.",
                markdownContent:
                    "## Static Axis React Example\n\n### Overview\nThis example demonstrates a real-time chart in a React application using SciChart.js. The chart features a static X axis, where the gridlines and ticks remain fixed while only the labels update dynamically. This provides a smooth visualization experience during real-time data updates.\n\n### Technical Implementation\nThe chart is initialized using the `<SciChartReact/>` component from the SciChart.js React integration library. Two `NumericAxis` are created: a static axis (with the property `isStaticAxis` set to true) that maintains fixed label and gridline positions, and a normal axis that updates with the new data. The static axis not only preserves its layout but also synchronizes its visible range with the normal axis through an event subscription to `visibleRangeChanged` (see [Axis Ranging](https://www.scichart.com/documentation/js/current/Axis%20Ranging%20-%20How%20to%20Listen%20to%20VisibleRange%20Changes.html) for more details). Data is continuously streamed into the chart in real-time via a `setInterval` callback using `dataSeries.appendRange()`, aligning with techniques described in the [DataSeries Realtime Updates](https://www.scichart.com/documentation/js/current/DataSeries_RealtimeUpdates.html) documentation.\n\n### Features and Capabilities\nThe example showcases several advanced features including real-time chart updates and the unique behavior of a static axis with fixed gridlines. A toggle control built with the Material-UI `ToggleButtonGroup` allows users to switch the primary axis between static and normal modes interactively. The function `toggleStaticAxis()` in `drawExample.ts` updates the `axis.isPrimaryAxis` property, defining which axis is responsible for drawing gridlines. This toggle functionality is managed with React state and the `useRef` hook, enabling direct control over child component methods.\n\n### Integration and Best Practices\nIntegrating SciChart.js within a React application is streamlined with the `<SciChartReact/>` component, which encapsulates the rendering logic and lifecycle management of the chart. The use of Material-UI for styling and interactive controls, such as the toggle for switching axis behaviors, follows best practices for UI development in React. Developers seeking further guidance on React integration can refer to the [React Charts with SciChart.js](https://www.scichart.com/blog/react-charts-with-scichart-js/) article. \n\nThis example serves as a comprehensive guide for implementing a high performance, real-time chart with static axis behavior in React using SciChart.js.",
            },
            angular: {
                subtitle:
                    "Demonstrates a realtime **Angular static axis chart** - where the ticks and gridlines are fixed, but the labels change.\nWith SciChart.js High Performance JavaScript Charts you can achieve this simply by setting isStaticAxis property to true on the X axis.",
                title: "Angular Chart with Static X Axis",
                pageTitle: "Angular Chart with Static X Axis",
                metaDescription: "Demonstrates isStaticAxis on a Angular Chart using SciChart.js.",
                markdownContent:
                    "## Angular Chart with Static X Axis\n\n### Overview\nThis example demonstrates a real-time chart in an Angular application using SciChart.js. It focuses on configuring a **static X axis** where the gridlines and ticks remain fixed while the labels update dynamically as new data is streamed. The example provides an interactive toggle to switch between a static and a normal axis configuration.\n\n### Technical Implementation\nThe chart is initialized by creating a `SciChartSurface` and setting up two `NumericAxis`. One axis is designated as static by enabling the `isStaticAxis` property, ensuring that its gridlines and ticks retain their original positions regardless of the data updates. The synchronization between the axes is achieved by subscribing to the `visibleRangeChanged` event, a technique detailed in the [Axis Ranging - How to Listen to VisibleRange Changes - SciChart](https://www.scichart.com/documentation/js/current/Axis%20Ranging%20-%20How%20to%20Listen%20to%20VisibleRange%20Changes.html). Real-time data updates are managed by appending new data points to the data series at regular intervals, following the practices described in the [Adding Realtime Updates | JavaScript Chart Documentation - SciChart](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html) guide.\n\n### Features and Capabilities\nKey features of this implementation include real-time data streaming, advanced axis synchronization, and support for annotations. The static axis minimizes visual flickering during high-frequency updates while maintaining consistent gridlines. Additional customizations, such as the inclusion of a horizontal line annotation, enhance the clarity and usability of the chart. These functionalities highlight the chart’s capability to handle complex, dynamic data efficiently.\n\n### Integration and Best Practices\nFor Angular developers, integrating SciChart.js can be streamlined using `ScichartAngularComponent` from the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package, which simplifies the embedding of high-performance charts into Angular applications. The example follows best practices for updating and synchronizing axes, ensuring that performance remains optimal even with realtime data streams.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/Static%20Axis.html",
                title: "SciChart.js Static xAxis Documentation page",
                linkTitle: "Static Axis",
            },
        ],
        path: "static-x-axis",
        metaKeywords: "multiple, axis, static, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/ModifyAxisBehavior/StaticAxis",
        thumbnailImage: "javascript-static-axis.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const staticAxisExampleInfo = createExampleInfo(metaData);
