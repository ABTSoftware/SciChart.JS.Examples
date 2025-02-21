import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DTooltipsAndHittestMetaData",
        imagePath: "javascript-chart-metadata.jpg",
        description:
            "Demonstrates how to add and use **MetaData** in a chart using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to add and use **MetaData** in a chart using SciChart.js, High Performance JavaScript Charts",
                title: "Datapoint Metadata Tooltips on JavaScript Chart",
                pageTitle: "Datapoint Metadata Tooltips on JavaScript Chart",
                metaDescription:
                    "Demonstrates using MetaData in a JavaScript Chart - add custom data to points for display or to drive visual customisation",
                markdownContent:
                    '# MetaData Example - Vanilla JavaScript\n\n### Overview\nThis example, "MetaData", demonstrates how to create an interactive line chart using SciChart.js with vanilla JavaScript. It visualizes a dataset where each data point is augmented with metadata that drives customizations such as point colors, dynamic labels, and interactive tooltips.\n\n### Technical Implementation\nThe chart is set up by asynchronously initializing a SciChartSurface with configured X and Y axes using the [NumericAxis](https://www.scichart.com/documentation/js/current/NumericAxis.html) class and a defined growth range via [NumberRange](https://www.scichart.com/documentation/js/current/Axis%20Ranging%20-%20Setting%20and%20Getting%20VisibleRange.html). A dataseries is created by mapping the provided X and Y values and attaching a metadata object for each point. Customizations are applied through a custom palette provider that adjusts the color of each point marker based on metadata. This is achieved using the helper function parseColorToUIntArgb for color conversion, as illustrated in discussions like [What is the most efficient way to parse a CSS color in JavaScript?](https://stackoverflow.com/questions/11068240/what-is-the-most-efficient-way-to-parse-a-css-color-in-javascript). Additionally, a custom data label provider extracts labels from metadata with a metaDataSelector, following concepts from [Getting Labels from Metadata](https://www.scichart.com/documentation/js/current/DataLabelsFromMetadata.html). A [RolloverModifier](https://www.scichart.com/documentation/js/current/RolloverModifier.html) is employed to provide interactive tooltips, enabling dynamic adjustments of marker and tooltip colors based on the underlying data. Text annotations are added using the [TextAnnotation](https://www.scichart.com/documentation/js/current/TextAnnotation.html) class, which supports relative coordinate modes for flexible placement.\n\n### Features and Capabilities\nThis example showcases **metadata-driven customization** where additional properties within each data point dictate not only the visual styling (such as point marker color via a custom palette provider) but also the data labels and tooltips. Such an approach allows each data point to be individually styled and can support features like highlighting or selection. Developers seeking to further customize point markers can review the [EllipsePointMarker documentation](https://www.scichart.com/documentation/js/current/typedoc/classes/ellipsepointmarker.html) while performance considerations are addressed by following the guidance provided in the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) documentation.\n\n### Integration and Best Practices\nThe implementation follows best practices for asynchronous initialization and resource cleanup in vanilla JavaScript, as shown by returning a destructor function that disposes of the SciChartSurface when no longer needed. This pattern is recommended in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide. Although a React wrapper is provided in the project, the core implementation uses plain JavaScript, making it highly adaptable to various environments. By leveraging these techniques, developers can build highly interactive charts with a focus on performance and maintainability.',
            },
            react: {
                subtitle:
                    "Demonstrates how to add and use **MetaData** in a chart using SciChart.js, High Performance JavaScript Charts",
                title: "Datapoint Metadata Tooltips on React Chart",
                pageTitle: "Datapoint Metadata Tooltips on React Chart",
                metaDescription:
                    "Demonstrates using MetaData in a React Chart - add custom data to points for display or to drive visual customisation",
                markdownContent:
                    "# Datapoint Metadata Tooltips on React Chart\n\n### Overview\nThis example demonstrates how to integrate **SciChart.js** within a React application to create high performance charts that leverage custom metadata. The chart renders a spline line chart where each data point holds additional metadata such as custom labels, color information, and selection state. This metadata is used to drive custom point styling, data labels, and interactive tooltips.\n\n### Technical Implementation\nThe chart is initialized asynchronously using the SciChartSurface.create function and is embedded within a React component using the SciChartReact wrapper, as described in the [React Charts with SciChart.js](https://www.scichart.com/blog/react-charts-with-scichart-js/) guide. A data series is constructed by mapping an array of objects with extra metadata to the XyDataSeries. Custom styling is implemented by overriding point marker colors through an object that implements the **IPointMarkerPaletteProvider** interface ([IPointMarkerPaletteProvider API Documentation for SciChart.js](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ipointmarkerpaletteprovider.html)). Additionally, dynamic data labels are provided via the **LineSeriesDataLabelProvider**, enabling labels to be sourced directly from the metadata ([DataLabelProvider documentation](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelprovider.html)).\n\n### Features and Capabilities\nKey features of this example include: \n- Custom point coloring and highlighting based on metadata values\n- Dynamic labeling where data labels are automatically derived from each point's metadata\n- Advanced tooltips that display additional metadata such as custom labels and selection status\n- The use of spline line series with custom point markers for enhanced visual style\nThe performance is optimized by leveraging asynchronous chart initialization and WebAssembly for high-performance rendering, as detailed in the [SciChart JS User Manual](https://www.scichart.com/documentation/js/current/SciChart_JS_User_Manual.html).\n\n### Integration and Best Practices\nThe example illustrates best practices for integrating SciChart.js in React. By utilizing the **SciChartReact** component, developers can ensure that the chart integrates smoothly with React’s component lifecycle. For further insight into efficient React integration and performance optimization techniques, refer to the [React Charts with SciChart.js](https://www.scichart.com/blog/react-charts-with-scichart-js/) article and the [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/) resource. Additionally, the example shows how chart modifiers such as the RolloverModifier can be utilized to enhance user interaction by providing real-time metadata-driven tooltips.\n",
            },
            angular: {
                subtitle:
                    "Demonstrates how to add and use **MetaData** in a chart using SciChart.js, High Performance JavaScript Charts",
                title: "Datapoint Metadata Tooltips on Angular Chart",
                pageTitle: "Datapoint Metadata Tooltips on Angular Chart",
                metaDescription:
                    "Demonstrates using MetaData in a Angular Chart - add custom data to points for display or to drive visual customisation",
                markdownContent:
                    "# Datapoint Metadata Tooltips on Angular Chart\n\n### Overview\nThis example demonstrates how to integrate **SciChart.js** within an Angular application to render a high performance 2D chart. Each data point carries custom metadata that drives dynamic point coloring, advanced tooltips, and data labels. The example leverages asynchronous chart initialization along with WebAssembly rendering for optimal performance.\n\n### Technical Implementation\nThe chart is created asynchronously using SciChart.js's API where numeric axes, a spline line series, and annotations are programmatically configured. A data series is constructed by mapping raw X and Y values along with metadata objects containing properties such as label text, a custom color, and selection state. This metadata is then utilized in multiple ways: a custom palette provider dynamically adjusts point marker colors based on metadata, a custom data label provider extracts labels directly from metadata for each point, and a rollover modifier displays interactive tooltips that include metadata details. For additional details on implementing metadata-driven tooltips and data labels, refer to the [Metadata and Tooltips documentation](https://www.scichart.com/documentation/js/current/DataSeries_PointMetadata_Tooltips.html). The asynchronous initialization approach is further detailed in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide.\n\n### Features and Capabilities\nThe example includes real-time interactive updating of point appearance based on metadata, custom point coloring using a palette provider, and dynamic labeling via a data label provider. Interactive tooltips display extra information such as custom labels and selection status, enhancing user interaction. The implementation leverages WebAssembly for high performance rendering, ensuring that even with these advanced features the chart remains responsive. Developers can explore the customization options provided by the [PaletteProvider API](https://www.scichart.com/documentation/js/current/The%20PaletteProvider%20API.html) and further refine label behavior as described in [Getting Labels from Metadata](https://www.scichart.com/documentation/js/current/DataLabelsFromMetadata.html).\n\n### Integration and Best Practices\nIn Angular applications, managing the chart lifecycle is crucial. The example demonstrates efficient integration by initializing the chart asynchronously and ensuring proper disposal to prevent memory leaks. Performance enhancements are achieved through the use of WebAssembly and optimized rendering techniques outlined in the [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/) guide. This approach emphasizes best practices for integrating complex, high performance charts in Angular environments while offering extensive customization through metadata.\n",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/DataSeries%20PointMetaData%20Api.html",
                title: "The specific page for the SciChart.js documentation for the MetaData API to help you to get started",
                linkTitle: "MetaData API documentation",
            },
        ],
        path: "chart-metadata",
        metaKeywords: "metaData, api, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/TooltipsAndHittest/MetaData",
        thumbnailImage: "javascript-chart-metadata.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const metaDataExampleInfo = createExampleInfo(metaData);
