import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DModifyAxisBehaviorSecondaryYAxes",
        imagePath: "javascript-chart-with-secondary-y-axis.jpg",
        description:
            "Demonstrates how to create a **JavaScript Chart with Secondary Y axis** using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to create a **JavaScript Chart with Secondary Y axis** using SciChart.js, High Performance JavaScript Charts",
                title: "JavaScript Chart with Secondary Y Axes",
                pageTitle: "JavaScript Chart with Secondary Y Axes",
                metaDescription:
                    "Demonstrates Secondary Y Axis on a JavaScript Chart using SciChart.js. SciChart supports unlimited, multiple left, right, top, bottom X, Y axis with configurable alignment and individual zooming, panning",
                markdownContent:
                    "# Secondary Y Axes (vanilla javascript)\n\n## Overview\nThis example demonstrates how to create a high-performance sciChart using vanilla javascript with two vertically aligned Y axes, one on the left and a secondary on the right. The chart is built using SciChart.js and showcases binding different data series to distinct axes, each with its own custom styling and interactive capabilities.\n\n## Technical Implementation\nThe implementation begins by initializing a SciChartSurface with a WebAssembly (WASM) context to ensure optimal rendering performance. Developers can refer to the [Creating a new SciChartSurface and loading Wasm](https://www.scichart.com/documentation/js/current/SciChartSurface.create%20and%20createSingle.html) documentation for further details on WASM context initialization. The primary X axis and left Y axis are set up first using **NumericAxis**, after which a secondary right Y axis is added. Each axis is configured with unique styling properties like color, title, and label alignment. Data series are bound to their corresponding axes using the yAxisId property, following the guidelines in the [Tutorial 08 - Adding Multiple Axis](https://www.scichart.com/documentation/js/current/Tutorial%2008%20-%20Adding%20Multiple%20Axis.html) guide. Interactive modifiers, including YAxisDragModifier, XAxisDragModifier, ZoomPanModifier, MouseWheelZoomModifier, and ZoomExtentsModifier, are added to enable dynamic chart interactions.\n\n## Features and Capabilities\nThis example features real-time data visualization with dynamic updates and drag-to-scale capabilities. Both series use custom point markers rendered with the **EllipsePointMarker**, ensuring that each data point is visually distinctive. The chart also integrates both native and text annotations, providing contextual information directly on the chart. For more on configuring custom point markers, check the [EllipsePointMarker](https://www.scichart.com/documentation/js/current/typedoc/classes/ellipsepointmarker.html) documentation.\n\n## Integration and Best Practices\nLeveraging vanilla javascript, this example provides a straightforward integration approach by directly calling the drawExample function and handling resource cleanup with a destructor on the SciChartSurface. The cleanup process follows best practices for memory management, as outlined in resources such as the [Proper Disposal of SciChartSurface](https://stackoverflow.com/questions/50356282/proper-disposal-of-scichartsurface) guide. Additionally, the use of interactive chart modifiers enhances user experience by allowing intuitive dragging, zooming, and panning. Developers are encouraged to follow these patterns to maintain performance and ensure efficient resource management.\n\nFor further technical context and advanced customization options, please explore the additional links provided, which cover various aspects from numeric axis configuration to performance optimization in SciChart.js.",
            },
            react: {
                subtitle:
                    "Demonstrates how to create a **React Chart with Secondary Y axis** using SciChart.js, High Performance JavaScript Charts",
                title: "React Chart with Secondary Y Axes",
                pageTitle: "React Chart with Secondary Y Axes",
                metaDescription:
                    "Demonstrates Secondary Y Axis on a React Chart using SciChart.js. SciChart supports unlimited, multiple left, right, top, bottom X, Y axis with configurable alignment and individual zooming, panning",
                markdownContent:
                    "# React Chart with Secondary Y Axes\n\n## Overview\nThis example demonstrates how to create a high-performance SciChart.js chart with secondary Y axes using **React**. The chart features two separate Y axes—one on the left and one on the right—with distinct styling and data series bindings. Interactive modifiers enable users to zoom, pan, and drag axes for dynamic chart updates.\n\n## Technical Implementation\nThe implementation leverages the SciChart.js library in a React environment by utilizing the [SciChart React](https://www.scichart.com/blog/react-charts-with-scichart-js/) component. The chart is created by calling the SciChartSurface.create method with a theme, after which primary and secondary **NumericAxis** instances are configured with individual styles and titles. Two FastLineRenderableSeries are added; one is bound to the primary left Y axis and the other to a secondary right Y axis using different data series generated from a random walk algorithm. Custom point markers are rendered with [EllipsePointMarker](https://www.scichart.com/documentation/js/current/typedoc/classes/ellipsepointmarker.html). For comprehensive guidance on configuring multiple axes, please refer to [Tutorial 08 - Adding Multiple Axis](https://www.scichart.com/documentation/js/current/Tutorial%2008%20-%20Adding%20Multiple%20Axis.html).\n\n## Features and Capabilities\nThis example highlights real-time data visualization capabilities and advanced customization. It demonstrates the binding of data series to specific axes, custom styling of axes and series, and the use of interactive modifiers such as YAxisDragModifier, XAxisDragModifier, ZoomPanModifier, MouseWheelZoomModifier, and ZoomExtentsModifier, which collectively provide a fluid and responsive charting experience. Custom annotations further enhance the chart by offering contextual information.\n\n## Integration and Best Practices\nThe React integration is achieved via the SciChartReact component, which simplifies incorporating SciChart.js into React applications. This approach adheres to modern React practices by managing the chart lifecycle within a functional component. Developers should apply best practices such as properly disposing of chart resources on component unmount. Detailed guidance for managing these aspects is provided in the [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html) documentation. By combining structured configuration with interactive capabilities, the example serves as a robust reference for building advanced charting solutions in React.",
            },
            angular: {
                subtitle:
                    "Demonstrates how to create a **Angular Chart with Secondary Y axis** using SciChart.js, High Performance JavaScript Charts",
                title: "Angular Chart with Secondary Y Axes",
                pageTitle: "Angular Chart with Secondary Y Axes",
                metaDescription:
                    "Demonstrates Secondary Y Axis on a Angular Chart using SciChart.js. SciChart supports unlimited, multiple left, right, top, bottom X, Y axis with configurable alignment and individual zooming, panning",
                markdownContent:
                    "# Angular Chart with Secondary Y Axes\n\n## Overview\nThis example demonstrates how to integrate SciChart.js into an Angular standalone component using the SciChartAngularComponent. The implementation creates a high-performance chart featuring a shared X axis and two distinct Y axes (one on the left and a secondary one on the right). This dual-axis setup enables binding different data series with unique styling, making it ideal for applications requiring multi-axis data visualization.\n\n## Technical Implementation\nWithin an Angular environment, the chart is initialized by calling SciChartSurface.create with a WASM context to ensure optimal rendering performance. The primary X and left Y axes are defined first, and a secondary right Y axis is then added and configured with its own settings. Data series are bound to the appropriate axes using the yAxisId property, while custom point markers and annotations provide additional visual context. Interactive modifiers, such as YAxisDragModifier, XAxisDragModifier, ZoomPanModifier, MouseWheelZoomModifier, and ZoomExtentsModifier, are incorporated to facilitate intuitive chart interactivity. For further details on configuring multiple axes, refer to the [Tutorial 08 - Adding Multiple Axis](https://www.scichart.com/documentation/js/current/Tutorial%2008%20-%20Adding%20Multiple%20Axis.html) resource.\n\n## Features and Capabilities\nThis example showcases several advanced features including real-time data visualization, customized axis styling, and the use of intuitive interactive chart controls. Custom point markers are created with the EllipsePointMarker, and annotations (both native and text based) add informative overlays to the chart. The usage of a performance-optimized WASM context underlines the example's capability to handle complex data sets efficiently. Additional customization options are available through detailed configuration settings as described in the [Secondary and Multiple Axis documentation](https://www.scichart.com/documentation/js/current/Axis%20Alignment%20-%20Setting%20Axis%20Alignment.html).\n\n## Integration and Best Practices\nIntegrating SciChart.js within Angular is streamlined by utilizing the SciChartAngularComponent, making the setup process straightforward. Developers are encouraged to consult the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide and the [scichart-angular - Yarn](https://www.npmjs.com/package/scichart-angular) documentation for best practices on projects. The example demonstrates efficient use of interactive chart modifiers and performance optimization techniques, ensuring that resource management and user experience remain a priority. For example, the use of [XAxisDragModifier](https://www.scichart.com/documentation/js/current/XAxisDragModifier.html) illustrates how interactive controls can enhance chart functionality in an Angular context.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#Axis%20Alignment%20-%20Setting%20Axis%20Alignment.html",
                title: "SciChart.js Multiple XAxis Documentation",
                linkTitle: "SciChart.js Documentation Home",
            },
        ],
        path: "chart-with-secondary-y-axis",
        metaKeywords: "secondary, axis, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/ModifyAxisBehavior/SecondaryYAxes",
        thumbnailImage: "javascript-chart-with-secondary-y-axis.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const secondaryYAxesExampleInfo = createExampleInfo(metaData);
