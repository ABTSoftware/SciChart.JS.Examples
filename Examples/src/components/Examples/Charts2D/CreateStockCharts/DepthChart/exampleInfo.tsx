import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DCreateStockChartsDepthChart",
        imagePath: "javascript-depth-chart.jpg",
        description:
            "How to create a Market Depth (Order Book) JavaScript Chart using Mountain Series and a Custom Modifier",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "How to create a Market Depth (Order Book) JavaScript Chart using Mountain Series and a Custom Modifier",
                title: "JavaScript Market Depth Chart",
                pageTitle: "JavaScript Market Depth Chart",
                metaDescription:
                    "Create a JavaScript Depth Chart, using the high performance SciChart.js chart library. Get free demo now.",
                markdownContent:
                    "# Vanilla JavaScript Depth Chart\n\n### Overview\nThis example demonstrates how to build a high-performance **Market Depth Chart** using vanilla JavaScript and SciChart.js. It visualizes cumulative buy and sell order book data with two mountain series and a bespoke custom modifier that enhances mouse interactions, annotations, and hit testing.\n\n### Technical Implementation\nThe chart is initialized via the drawExample function which creates a SciChartSurface, configures numeric axes, and instantiates two FastMountainRenderableSeries for buy and sell data. The custom modifier, DepthCursorModifier, is implemented directly using the core SciChart.js API to manage mouse events, dynamic annotations, and coordinate transformations. Developers can explore advanced customization through the [Custom Chart Modifier API](https://www.scichart.com/documentation/js/current/CustomChartModifierAPI.html), which is leveraged to handle tasks such as updating crosshair lines and markers based on real-time mouse movement. The implementation also employs accurate hit testing using the [RenderableSeries Hit-Test API](https://www.scichart.com/documentation/js/current/Hit-Test%20API.html) and transforms canvas coordinates to data coordinates using the [Axis APIs - Convert Pixel to Data Coordinates](https://www.scichart.com/documentation/js/current/Axis%20APIs%20-%20Convert%20Pixel%20to%20Data%20Coordinates.html).\n\n### Features and Capabilities\nKey features include real-time updating of annotations, dynamic highlighting of data points, and robust mouse event handling that provides a seamless interactive experience. The chart efficiently computes the mid-price between buy and sell data points and highlights the interactive region with crosshair annotations. For a deeper understanding of market depth visualizations, consider reviewing the [JavaScript Market Depth Chart](https://www.scichart.com/example/javascript-chart/javascript-depth-chart/) example.\n\n### Integration and Best Practices\nThis example follows best practices for resource management in vanilla JavaScript by providing a cleanup (destructor) function that disposes of the SciChartSurface when no longer needed. Additionally, performance optimizations are achieved through careful DPI scaling and efficient update routines as described in the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) documentation. The implementation reinforces principles for developing high-performance, interactive charts while maintaining clear separation of concerns and robust handling of chart events.",
            },
            react: {
                subtitle:
                    "How to create a Market Depth (Order Book) React Chart using Mountain Series and a Custom Modifier",
                title: "React Market Depth Chart",
                pageTitle: "React Market Depth Chart",
                metaDescription:
                    "Create a React Depth Chart, using the high performance SciChart.js chart library. Get free demo now.",
                markdownContent:
                    '# React Market Depth Chart\n\n### Overview\nThis example demonstrates a high performance **Market Depth (Order Book) Chart** built with SciChart.js in a React environment. It visualizes buy and sell data using mountain series and a custom chart modifier to provide an interactive depth chart experience.\n\n### Technical Implementation\nThe chart is initialized using the **SciChartReact** component with an "initChart" prop that assigns the "drawExample" function. Within this function, two mountain series are created to represent cumulative buy and sell volumes, and a custom modifier (the **DepthCursorModifier**) is implemented for enhanced mouse interaction, hit testing, and annotation management. The custom modifier updates crosshair lines, text labels, and marker annotations dynamically based on the mouse position. Developers can explore the detailed implementation of custom modifiers in the [Custom Chart Modifier API](https://www.scichart.com/documentation/js/current/CustomChartModifierAPI.html) documentation.\n\n### Features and Capabilities\nThe example showcases real-time update capabilities as the custom modifier responds to mouse movements over the chart, dynamically highlighting corresponding data points on both series. Advanced features include coordinate translation, DPI scaling, and custom annotations for enhanced visualization of buy and sell data. For more insights on creating market depth charts, refer to the [React Market Depth Chart Demo](https://demo.scichart.com/react/depth-chart).\n\n### Integration and Best Practices\nThis implementation follows best practices for integrating SciChart.js within a React application. The use of the **SciChartReact** component simplifies initialization and cleanup of the SciChartSurface, ensuring optimal performance and resource management. Developers are encouraged to review guidelines for initializing and cleaning up the chart as described in [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html) and to apply the performance optimization techniques detailed in [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/). Additionally, advanced mouse event handling for custom modifiers, including hit testing and dynamic annotations, is implemented, as discussed in the [Detecting Clicks On Chart Parts with a Custom Modifier](https://www.scichart.com/documentation/js/current/DetectingClicksOnChartParts.html) resource.\n',
            },
            angular: {
                subtitle:
                    "How to create a Market Depth (Order Book) Angular Chart using Mountain Series and a Custom Modifier",
                title: "Angular Market Depth Chart",
                pageTitle: "Angular Market Depth Chart",
                metaDescription:
                    "Create a Angular Depth Chart, using the high performance SciChart.js chart library. Get free demo now.",
                markdownContent:
                    "# Angular Market Depth Chart\n\n### Overview\nThis example demonstrates an interactive **Market Depth Chart** built using Angular and SciChart.js. It visualizes buy and sell order book data with two mountain series and a custom chart modifier that dynamically highlights data points. The example leverages Angular's standalone components as outlined in the [Getting started with standalone components - Angular](https://angular.io/guide/standalone-components) documentation and integrates the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package for seamless UI integration.\n\n### Technical Implementation\nThe implementation initializes a SciChartSurface with custom **NumericAxis** configurations and renders two cumulative mountain series to depict market depth. A bespoke custom modifier, the **DepthCursorModifier**, is implemented to handle advanced mouse events, coordinate translation, and dynamic annotation updates. Developers can refer to the [Custom Chart Modifier API](https://www.scichart.com/documentation/js/current/CustomChartModifierAPI.html) for further customization details. The code also carefully manages DPI scaling and coordinate transformations to ensure accurate visual rendering, as discussed in the [Advanced JavaScript Chart and Graph Library | SciChart JS](https://www.scichart.com/javascript-chart-features/) documentation.\n\n### Features and Capabilities\nThe chart exhibits real-time update capabilities by dynamically adjusting annotations, crosshair lines, and marker positions in response to mouse movement. Advanced features include precise hit testing for both buy and sell series, dynamic marker rendering, and interactive region highlighting. These capabilities ensure responsive user interaction and are supported by [performance optimization techniques](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/) that enable efficient WebGL rendering even with high-density data.\n\n### Integration and Best Practices\nThis example adheres to best practices by encapsulating the SciChart.js chart initialization within an Angular standalone component, promoting clear separation of concerns. The use of the **SciChartAngularComponent** simplifies the integration while ensuring proper resource management and cleanup inherent in Angular's dependency injection framework. Developers are encouraged to explore related topics such as chart interactivity and annotation management in the [Advanced JavaScript Chart and Graph Library | SciChart JS](https://www.scichart.com/javascript-chart-features/) documentation to enhance their implementations further.\n",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/SciChart_JS_User_Manual.html",
                title: "The SciChart.js documentation contains loads of useful information on how to use our High Performance JavaScript Charts",
                linkTitle: "SciChart.js Documentation Home",
            },
        ],
        path: "depth-chart",
        metaKeywords: "depth, orderbook, stock, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/CreateStockCharts/DepthChart",
        thumbnailImage: "javascript-depth-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const depthChartExampleInfo = createExampleInfo(metaData);
