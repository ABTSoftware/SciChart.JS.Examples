import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "TriangleSeriesChart",
        id: "chart2D_v4Charts_TriangleSeriesChart",
        imagePath: "javascript-triangle-series-chart.jpg",
        description:
            "Creates a **JavaScript Triangle Series Chart** using SciChart.js, with the following features: drawing triangles in strip, list mode, and polygons modes. Illustrating palette providers, and gradient palette fills.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Triangle Series Chart** using SciChart.js, with the following features: drawing triangles in strip mode (for letter \"**S**\"), drawing triangles in list mode (for letter \"**c**\") and drawing polygons (for letter \"**i**\").",
                title: "JavaScript Triangle Series Chart",
                pageTitle: "JavaScript Triangle Series Chart | JavaScript Charts | SciChart.js",
                metaDescription:
                    "JavaScript Triangle Series Chart demo by SciChart supports gradient fill and palette providers for more custom coloring options. Get your free demo now.",
                markdownContent:
                    "## Triangle Series Chart Example (JavaScript)\n\n### Overview\nThis example demonstrates how to create **Triangle Series Chart** using SciChart.js in a JavaScript environment. The chart illustrates key features such as different drawing modes, palette providers, and gradient palette fills, providing a high-performance real-time data visualization solution.\n\n### Technical Implementation\nThe chart is initialized by creating a `SciChartSurface` via the asynchronous call to `SciChartSurface.create()`, a method detailed in the [Tutorial 01 - Including SciChart.js in an HTML Page using CDN](https://www.scichart.com/documentation/js/current/Tutorial01IncludingSciChartjsHTMLPage.html). The implementation sets up numeric axes using the `NumericAxis` class and populates the chart with a `FastTriangleRenderableSeries`, which uses an `XyDataSeries` to manage the data points. Advanced customizations include setting rounded corners, a gradient fill created with `IFillPaletteProvider`. For more details on these aspects, refer to the [The Triangle Series Type](https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html) documentation.\n\n### Features and Capabilities\nKey technical features of this example include interactive modifiers such as `ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier` which enhance user interaction by providing seamless zooming and panning capabilities. The series is further enhanced with data labels that are styled and positioned above each column for improved readability. The use of gradient fills via `PaletteFactory` not only enhances visual appeal but also demonstrates advanced customization options, aligning with best practices for high-performance WebGL rendering. Details on gradient customization can be found in the [The PaletteFactory Helper Class](https://www.scichart.com/documentation/js/current/PaletteFactoryHelperClass.html) documentation.\n\n### Integration and Best Practices\nIn a JavaScript integration, the chart is created and managed by directly invoking the `drawExample` function. Resource management is handled by returning a destructor function that calls `sciChartSurface.delete()`, ensuring that resources are properly freed when the chart is no longer needed. This approach aligns with recommended practices for WebAssembly integration and efficient memory management as explained in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide. Additionally, the direct method of instantiating and disposing of the chart ensures optimal performance in high-frequency data scenarios.\n",
            },
            react: {
                subtitle:
                    "Creates a **React Triangle Series Chart** using SciChart.js, with the following features: drawing triangles in strip mode (for letter \"**S**\"), drawing triangles in list mode (for letter \"**c**\") and drawing polygons (for letter \"**i**\").",
                title: "React Triangle Series Chart",
                pageTitle: "React Triangle Series Chart | React Charts | SciChart.js",
                metaDescription:
                    "React Triangle Series Chart demo by SciChart supports gradient fill and palette providers for more custom coloring options. Get your free demo now.",
                markdownContent:
                    "## Triangle Series Chart Example (React)\n\n### Overview\nThis example demonstrates how to create **Triangle Series Chart** using SciChart.js in a React environment. The chart illustrates key features such as different drawing modes, palette providers, and gradient palette fills, providing a high-performance real-time data visualization solution.\n\n### Technical Implementation\nThe chart is initialized by creating a `SciChartSurface` via the asynchronous call to `SciChartSurface.create()`, a method detailed in the [Tutorial 01 - Including SciChart.js in an HTML Page using CDN](https://www.scichart.com/documentation/js/current/Tutorial01IncludingSciChartjsHTMLPage.html). The implementation sets up numeric axes using the `NumericAxis` class and populates the chart with a `FastTriangleRenderableSeries`, which uses an `XyDataSeries` to manage the data points. Advanced customizations include setting rounded corners, a gradient fill created with `IFillPaletteProvider`. For more details on these aspects, refer to the [The Triangle Series Type](https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html) documentation.\n\n### Features and Capabilities\nKey technical features of this example include interactive modifiers such as `ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier` which enhance user interaction by providing seamless zooming and panning capabilities. The series is further enhanced with data labels that are styled and positioned above each column for improved readability. The use of gradient fills via `PaletteFactory` not only enhances visual appeal but also demonstrates advanced customization options, aligning with best practices for high-performance WebGL rendering. Details on gradient customization can be found in the [The PaletteFactory Helper Class](https://www.scichart.com/documentation/js/current/PaletteFactoryHelperClass.html) documentation.\n\n### Integration and Best Practices\nIn a JavaScript integration, the chart is created and managed by directly invoking the `drawExample` function. Resource management is handled by returning a destructor function that calls `sciChartSurface.delete()`, ensuring that resources are properly freed when the chart is no longer needed. This approach aligns with recommended practices for WebAssembly integration and efficient memory management as explained in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide. Additionally, the direct method of instantiating and disposing of the chart ensures optimal performance in high-frequency data scenarios.\n",
            },
            angular: {
                subtitle:
                    "Creates a **Angular Triangle Series Chart** using SciChart.js, with the following features: drawing triangles in strip mode (for letter \"**S**\"), drawing triangles in list mode (for letter \"**c**\") and drawing polygons (for letter \"**i**\").",
                title: "Angular Triangle Series Chart",
                pageTitle: "Angular Triangle Series Chart | Angular Charts | SciChart.js",
                metaDescription:
                    "Angular Triangle Series Chart demo by SciChart supports gradient fill and palette providers for more custom coloring options. Get your free demo now.",
                markdownContent:
                    "## Triangle Series Chart Example (Angular)\n\n### Overview\nThis example demonstrates how to create **Triangle Series Chart** using SciChart.js in a Angular environment. The chart illustrates key features such as different drawing modes, palette providers, and gradient palette fills, providing a high-performance real-time data visualization solution.\n\n### Technical Implementation\nThe chart is initialized by creating a `SciChartSurface` via the asynchronous call to `SciChartSurface.create()`, a method detailed in the [Tutorial 01 - Including SciChart.js in an HTML Page using CDN](https://www.scichart.com/documentation/js/current/Tutorial01IncludingSciChartjsHTMLPage.html). The implementation sets up numeric axes using the `NumericAxis` class and populates the chart with a `FastTriangleRenderableSeries`, which uses an `XyDataSeries` to manage the data points. Advanced customizations include setting rounded corners, a gradient fill created with `IFillPaletteProvider`. For more details on these aspects, refer to the [The Triangle Series Type](https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html) documentation.\n\n### Features and Capabilities\nKey technical features of this example include interactive modifiers such as `ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier` which enhance user interaction by providing seamless zooming and panning capabilities. The series is further enhanced with data labels that are styled and positioned above each column for improved readability. The use of gradient fills via `PaletteFactory` not only enhances visual appeal but also demonstrates advanced customization options, aligning with best practices for high-performance WebGL rendering. Details on gradient customization can be found in the [The PaletteFactory Helper Class](https://www.scichart.com/documentation/js/current/PaletteFactoryHelperClass.html) documentation.\n\n### Integration and Best Practices\nIn a JavaScript integration, the chart is created and managed by directly invoking the `drawExample` function. Resource management is handled by returning a destructor function that calls `sciChartSurface.delete()`, ensuring that resources are properly freed when the chart is no longer needed. This approach aligns with recommended practices for WebAssembly integration and efficient memory management as explained in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide. Additionally, the direct method of instantiating and disposing of the chart ensures optimal performance in high-frequency data scenarios.\n",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Triangle Series Chart documentation will help you to get started",
                linkTitle: "JavaScript Triangle Series Chart Documentation",
            },
        ],
        path: "triangle-series-chart",
        metaKeywords: "triangle-series, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/v4Charts/TriangleSeriesChart",
        thumbnailImage: "javascript-triangle-series-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

const TriangleSeriesChartExampleInfo = createExampleInfo(metaData);
export default TriangleSeriesChartExampleInfo;
