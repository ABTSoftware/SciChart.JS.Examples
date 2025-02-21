import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DAxisLabelCustomizationMultiLineLabels",
        imagePath: "javascript-multiline-labels.jpg",
        description:
            "Demonstrates how to use **Multi-Line Text** for axis labels using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to use **Multi-Line Text** for axis labels using SciChart.js, High Performance JavaScript Charts",
                title: "Multi-line and Rotated Text labels",
                pageTitle: "Multi-line and Rotated Text labels",
                metaDescription:
                    "Demonstrates how to use arbitrary text for axis labels, rather than formatted data values, using the new TextLabelProvider",
                markdownContent:
                    "# Multi-line and Rotated Axis Labels in Vanilla JavaScript\n\n### Overview\nThis example demonstrates how to implement **multi-line** and **rotated axis labels** using SciChart.js with vanilla JavaScript. The chart visualizes 2022 market share data for mobile phone manufacturers and uses a custom TextLabelProvider to map data indices to descriptive labels. For more details, refer to the [Text and Multi-Line Labels documentation](https://www.scichart.com/documentation/js/current/MultiLineLabels.html).\n\n### Technical Implementation\nThe implementation starts by asynchronously creating a SciChartSurface and handling the underlying WebAssembly context as explained in the [Creating a new SciChartSurface](https://www.scichart.com/documentation/js/current/SciChartSurface.create%20and%20createSingle.html) guide. The X-Axis leverages a TextLabelProvider configured with properties for maximum text length and rotation (e.g., maxLength and rotation values) to ensure label clarity. This configuration is further elaborated in the [Text / String Axis documentation](https://www.scichart.com/documentation/js/current/TextStringAxis.html). Additionally, gradient fill customization for the column series is applied using the [PaletteFactory Helper Class](https://www.scichart.com/documentation/js/current/PaletteFactoryHelperClass.html), and a wave animation effect is integrated via the [Animations API](https://www.scichart.com/documentation/js/current/Animations%20API.html).\n\n### Features and Capabilities\nThe example features real-time update capabilities where label properties such as rotation and maximum length can be dynamically adjusted. It employs a high-performance FastColumnRenderableSeries to render the data efficiently, which is critical for handling complex chart visualizations. Performance optimization techniques can be explored further in the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) documentation.\n\n### Integration and Best Practices\nThis implementation adheres to best practices for vanilla JavaScript integration by directly initializing chart components without reliance on a Builder API. Developers are encouraged to utilize the TextLabelProvider for versatile label formatting and to manage the WASM context effectively to ensure optimal performance. The approach presented here serves as a practical example of enhancing chart readability and visual appeal using advanced SciChart.js features.",
            },
            react: {
                subtitle:
                    "Demonstrates how to use **Multi-Line Text** for axis labels using SciChart.js, High Performance JavaScript Charts",
                title: "Multi-line and Rotated Text labels",
                pageTitle: "Multi-line and Rotated Text labels",
                metaDescription:
                    "Demonstrates how to use arbitrary text for axis labels, rather than formatted data values, using the new TextLabelProvider",
                markdownContent:
                    "# Multi-Line Labels in React\n\n### Overview\nThis example demonstrates how to implement multi-line and rotated axis labels in a SciChart.js chart within a React application. The chart displays a column series representing the percentage market share of mobile phone manufacturers in 2022, with customized text labels on the X-Axis. The implementation leverages the [SciChart React](https://www.scichart.com/blog/react-charts-with-scichart-js/) component for integrating SciChart.js within a React codebase.\n\n### Technical Implementation\nThe example initializes a SciChartSurface by calling an asynchronous function which creates axes and a column series. A custom TextLabelProvider is used to map dataset indices to descriptive labels that include multi-line formatted text. The axis labels are dynamically customized using React state and refs; changes in the toggle button control update the label rotation and maximum text length. This dynamic update is managed in the React component by storing a reference to the TextLabelProvider and adjusting its properties based on user interaction, as documented in the [Rotating Axis Labels | JavaScript Chart Documentation - SciChart](https://www.scichart.com/documentation/js/current/RotatingAxisLabels.html). The example does not use the Builder API but directly calls initialization functions, keeping it straightforward and efficient for React applications.\n\n### Features and Capabilities\nThe chart features include multi-line text labels that are rotated to improve readability and a column series with gradient fill customization provided by the PaletteFactory. Animations such as a wave effect are applied to the column series, enhancing the visual appeal and providing a smooth user experience. The performance is optimized using the FastColumnRenderableSeries, ensuring that the chart renders efficiently even with dynamic data updates. For more details on the multi-line label capabilities, see the [Multi-line and Rotated Text labels - SciChart.js Demo](https://demo.scichart.com/react/multiline-labels) and [Text and Multi-Line Labels | JavaScript Chart Documentation](https://www.scichart.com/documentation/js/current/MultiLineLabels.html).\n\n### Integration and Best Practices\nThis example illustrates best practices for integrating SciChart.js into a React application by utilizing the SciChartReact component and React hooks such as useRef and useState for managing chart instances and dynamic updates. The integration with Material-UI's ToggleButtonGroup demonstrates how to build interactive chart controls within a modern UI framework. Developers are encouraged to follow best practices for managing the WASM context and chart optimizations, as outlined in the [SciChart.js Performance Demo: 1 Million Datapoints in under 15ms](https://www.scichart.com/blog/scichart-js-performance-demo-1-million-datapoints-70ms/). Additionally, the use of gradient fill customization through the PaletteFactory (see [PaletteFactory | API Documentation for SciChart.js - v3.5.706](https://www.scichart.com/documentation/js/current/typedoc/classes/palettefactory.html)) further enhances the visual quality of the charts.\n\nThis implementation serves as a comprehensive example of how to create high-performance, customizable charts in a React environment while leveraging advanced features of SciChart.js.",
            },
            angular: {
                subtitle:
                    "Demonstrates how to use **Multi-Line Text** for axis labels using SciChart.js, High Performance JavaScript Charts",
                title: "Multi-line and Rotated Text labels",
                pageTitle: "Multi-line and Rotated Text labels",
                metaDescription:
                    "Demonstrates how to use arbitrary text for axis labels, rather than formatted data values, using the new TextLabelProvider",
                markdownContent:
                    "# Multi-line and Rotated Text Labels in Angular\n\n### Overview\nThis example demonstrates how to integrate SciChart.js in an Angular application to render high-performance charts with **multi-line** and **rotated axis labels**. The example focuses on configuring custom axis label rendering through the [TextLabelProvider](https://www.scichart.com/documentation/js/current/typedoc/classes/textlabelprovider.html) and dynamically updating label properties to enhance chart readability.\n\n### Technical Implementation\nThe chart is initialized asynchronously to properly manage the underlying WebAssembly context, following Angular best practices as described in [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/). The X-Axis is configured with a custom label provider that maps data indices to descriptive multi-lined manufacturer names with a specified rotation, detailed in the [Rotating Axis Labels](https://www.scichart.com/documentation/js/current/RotatingAxisLabels.html) documentation. Additionally, a column series is rendered with a gradient fill using the [PaletteFactory](https://www.scichart.com/documentation/js/current/PaletteFactoryHelperClass.html) and enhanced with a [WaveAnimation](https://www.scichart.com/documentation/js/current/Animations%20API.html) effect, ensuring smooth and visually appealing transitions.\n\n### Features and Capabilities\nThis example provides real-time interactive capabilities by allowing dynamic updates to axis label properties such as rotation and maximum text length. Such dynamic updating enhances usability in data-dense displays. The implementation optimizes performance through careful management of the WebAssembly context and employs advanced visual customizations like gradient color fills and animations to deliver an engaging user experience. For further details on performance optimizations, refer to the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) section.\n\n### Integration and Best Practices\nAngular developers can take advantage of the official [scichart-angular](https://www.npmjs.com/package/scichart-angular) package to seamlessly integrate these high-performance charts into their applications. The example emphasizes asynchronous initialization patterns and the use of custom label providers for precise axis customization. By following these patterns, and taking cues from best practices in the SciChart.js documentation, developers can efficiently manage the WebAssembly context and ensure optimal performance in their Angular applications.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/TextStringAxis.html",
                title: "This specific page in the JavaScript TextLabelProvider documentation will help you to get started",
                linkTitle: "Scichart.js TextlabelProvider Documentation",
            },
        ],
        path: "multiline-labels",
        metaKeywords: "text, axis, label, wrap, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/AxisLabelCustomization/MultiLineLabels",
        thumbnailImage: "javascript-multiline-labels.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const multiLineLabelsExampleInfo = createExampleInfo(metaData);
