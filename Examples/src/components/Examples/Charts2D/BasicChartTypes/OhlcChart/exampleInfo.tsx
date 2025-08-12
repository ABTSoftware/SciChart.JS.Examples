import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "OhlcChart",
        id: "chart2D_basicCharts_OhlcChart",
        imagePath: "javascript-ohlc-chart.jpg",
        description:
            "For this example, we demonstrate how to create a **JavaScript OHLC Chart** or Stock Chart using SciChart.js. This is our powerful JavaScript Chart Component.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "For this example, we demonstrate how to create a **JavaScript OHLC Chart** or Stock Chart using SciChart.js. This is our powerful JavaScript Chart Component.",
                title: "JavaScript OHLC Chart",
                pageTitle: "JavaScript OHLC Chart | JavaScript Chart Examples | SciChart",
                metaDescription:
                    "Easily create JavaScript OHLC Chart or Stock Chart using feature-rich SciChart.js chart library. Supports custom colors. Get your free trial now. ",
                markdownContent:
                    "## Ohlc Chart - JavaScript\n\n### Overview\nThis example demonstrates how to create an **Ohlc Chart** (Open-High-Low-Close Chart) using JavaScript with SciChart.js. It is designed to visually represent financial market data, making it ideal for stock trading applications and financial data analysis.\n\n### Technical Implementation\nThe chart is initialized by calling the asynchronous function that creates a `SciChartSurface` using [SciChartSurface.create](https://www.scichart.com/documentation/js/current/SciChartSurface.create%20and%20createSingle.html). A `CategoryAxis` is added and configured with a [SmartDateLabelProvider](https://www.scichart.com/documentation/js/current/Axis%20Label%20Formatting%20-%20LabelProvider%20API.html) to effectively handle non-contiguous stock market dates, and a `NumericAxis` is used to display financial values with precise formatting. Financial data is managed via an `OhlcDataSeries` that feeds into a `FastOhlcRenderableSeries`, which renders the OHLC data points efficiently. A [SweepAnimation](https://www.scichart.com/documentation/js/current/typedoc/classes/sweepanimation.html) enhances the visual presentation by animating the appearance of the series.\n\n### Features and Capabilities\nThis implementation includes several advanced features such as interactive chart modifiers. The chart supports intuitive user interactions through `ZoomExtentsModifier`, `ZoomPanModifier`, and `MouseWheelZoomModifier`, allowing for seamless zooming and panning operations. Additionally, performance optimizations are achieved with WebGL rendering, ensuring smooth animations and responsiveness even with large datasets. For detailed performance insights, refer to the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) documentation.\n\n### Integration and Best Practices\nThe example employs JavaScript integration, highlighting best practices for resource management. A cleanup function is provided by calling `sciChartSurface.delete()` to properly dispose of the chart resources when they are no longer needed, aligning with the guidelines in the [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) documentation. This approach ensures that applications remain performant and free of memory leaks. The example serves as a robust reference for developers looking to integrate high-performance financial charts without additional framework dependencies.\n\nOverall, this Ohlc Chart example using JavaScript with SciChart.js encapsulates best practices for chart initialization, axis configuration, animation, interactivity, and resource management, providing an excellent starting point for building scalable financial data visualization applications.",
            },
            react: {
                subtitle:
                    "For this example, we demonstrate how to create a **React OHLC Chart** or Stock Chart using SciChart.js. This is our powerful JavaScript Chart Component.",
                title: "React OHLC Chart",
                pageTitle: "React OHLC Chart | JavaScript Chart Examples | SciChart",
                metaDescription:
                    "Easily create React OHLC Chart or Stock Chart using feature-rich SciChart.js chart library. Supports custom colors. Get your free trial now. ",
                markdownContent:
                    "## React OHLC Chart\n\n### Overview\nThis React OHLC Chart example demonstrates how to create a high-performance, interactive stock chart using SciChart.js within a React application. The example is specifically designed to render OHLC (Open-High-Low-Close) financial data, showcasing advanced customization options and smooth animations for real-time visualization.\n\n### Technical Implementation\nThe chart is initialized using the `<SciChartReact/>` component, which delegates the chart setup to a function that creates a `SciChartSurface`. Within this function, developers add a `CategoryAxis` configured with a `SmartDateLabelProvider` for handling non-contiguous stock market dates, and a `NumericAxis` tailored to display financial values with a fixed decimal precision. The actual OHLC data is processed using an `OhlcDataSeries`, as documented in the [OhlcDataSeries API](https://www.scichart.com/documentation/js/current/typedoc/classes/ohlcdataseries.html). Furthermore, the addition of a SweepAnimation improves the user experience by animating the rendering of the chart series, following best practices as explained in the [Series Startup Animations documentation](https://www.scichart.com/documentation/js/current/Series%20Startup%20Animations.html).\n\n### Features and Capabilities\nThe implementation showcases several advanced features including real-time data streaming capabilities, advanced axis customization, and dynamic updates. The chart integrates multiple interactivity modifiers such as `ZoomExtentsModifier`, `ZoomPanModifier`, and `MouseWheelZoomModifier`, which enhance user engagement by allowing seamless zooming and panning. These interactivity features are in line with the guidelines outlined in the [Adding Zooming and Panning Behavior documentation](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html).\n\n### Integration and Best Practices\nWithin the React framework, the `<SciChartReact/>` component simplifies chart initialization and lifecycle management, supporting robust integration as discussed in the [React Charts with SciChart.js introduction](https://www.scichart.com/blog/react-charts-with-scichart-js/). Developers are encouraged to use this component to maintain responsive design and efficient resource management in their applications. Additionally, the example leverages WebGL rendering to ensure optimal performance even with large financial datasets. This combination of React integration and advanced rendering techniques provides a strong foundation for building scalable data visualization solutions.\n\nFor further customization and modifications, developers can consult the [Axis LabelProviders documentation](https://www.scichart.com/documentation/js/current/Axis%20Label%20Formatting%20-%20LabelProvider%20API.html) to explore additional options for formatting and styling chart axes.",
            },
            angular: {
                subtitle:
                    "For this example, we demonstrate how to create a **Angular OHLC Chart** or Stock Chart using SciChart.js. This is our powerful JavaScript Chart Component.",
                title: "Angular OHLC Chart",
                pageTitle: "Angular OHLC Chart | JavaScript Chart Examples | SciChart",
                metaDescription:
                    "Easily create Angular OHLC Chart or Stock Chart using feature-rich SciChart.js chart library. Supports custom colors. Get your free trial now. ",
                markdownContent:
                    "## Angular Ohlc Chart\n\n### Overview\nThis example demonstrates how to implement an **Angular OHLC Chart** using SciChart.js. It showcases an integration pattern where the chart is initialized within a standalone Angular component using the `ScichartAngularComponent`. The example focuses on visualizing financial OHLC (Open-High-Low-Close) data in a stock chart, making it ideal for applications that require precise financial data representation.\n\n### Technical Implementation\nThe chart is initialized asynchronously through the `drawExample` function, which creates a `SciChartSurface` and configures it with a themed environment. A `CategoryAxis` is employed with a `SmartDateLabelProvider` to handle non-contiguous stock market date values, while a `NumericAxis` formats financial data with exact decimal precision. The OHLC data is structured using an OhlcDataSeries and is rendered via a `FastOhlcRenderableSeries` that features a `SweepAnimation` for smooth visual transitions. This approach aligns with best practices for asynchronous chart initialization in Angular as explained in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) documentation.\n\n### Features and Capabilities\nThe example integrates several advanced features including real-time update capabilities, smooth series animations, and interactive chart modifiers. Interactivity is enhanced through the addition of modifiers like `ZoomExtentsModifier`, `ZoomPanModifier`, and `MouseWheelZoomModifier` which enable intuitive zooming and panning. Such enhancements are consistent with the guidance provided in the [Tutorial 03 - Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html) documentation. Additionally, the performance optimizations inherent in SciChart.js, including efficient WebGL rendering, ensure the chart remains responsive even when handling complex financial datasets.\n\n### Integration and Best Practices\nThis Angular example leverages a standalone component architecture where the chart initialization function is passed as an input property to the `ScichartAngularComponent`, promoting a clear separation of concerns and easy lifecycle management. Developers should note that proper Angular lifecycle handling is important to avoid memory leaks, a concept detailed in the [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) guide. Furthermore, for a deeper understanding of integrating SciChart.js into Angular projects, the [scichart-angular](https://www.npmjs.com/package/scichart-angular) resource offers additional insights and installation details.\n",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20OHLC%20Series%20Type.html",
                title: "This specific page in the JavaScript OHLC Chart documentation will help you to get started",
                linkTitle: "JavaScript OHLC Chart Documentation",
            },
        ],
        path: "ohlc-chart",
        metaKeywords: "ohlc, stock, trading, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/OhlcChart",
        thumbnailImage: "javascript-ohlc-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: false,
    };
//// End of computer generated metadata

const ohlcChartExampleInfo = createExampleInfo(metaData);
export default ohlcChartExampleInfo;
