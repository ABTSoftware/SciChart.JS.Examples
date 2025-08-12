import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "TextSeriesChart",
        id: "chart2D_basicCharts_TextChart",
        imagePath: "javascript-text-chart.jpg",
        description:
            "This example demonstrates **FastTextRenderableSeries** using SciChart.js. The dataset is an AI analysis of 2100 tweets, extracting the organisations mentioned and the sentiment of the tweet.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "This example demonstrates **FastTextRenderableSeries** using SciChart.js. The dataset is an AI analysis of 2100 tweets, extracting the organisations mentioned and the sentiment of the tweet.",
                title: "JavaScript Text Chart",
                pageTitle: "JavaScript Text Chart",
                metaDescription: "Create JavaScript Text Chart with high performance SciChart.js.  ",
                markdownContent:
                    "## Text Series Chart - JavaScript\n\n### Overview\nThis example demonstrates how to create a high-performance text chart using SciChart.js in a JavaScript application. The chart visualizes AI-analyzed tweet data, showing the number of tweets on a logarithmic x-axis and the average sentiment on a numeric y-axis, rendered as text.\n\n### Technical Implementation\nThe chart is initialized asynchronously using the `SciChartSurface.create()` method which sets up a WebAssembly context for optimal performance. For more details on this asynchronous initialization, refer to the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide and the [Creating a new SciChartSurface and loading Wasm](https://www.scichart.com/documentation/js/current/SciChartSurface.create%20and%20createSingle.html) documentation. The x-axis is configured as a `LogarithmicAxis` (see [The Logarithmic Axis](https://www.scichart.com/documentation/js/current/Logarithmic%20Axis.html)) while the y-axis is set up with a `NumericAxis`, ensuring proper display ranges. Data is fetched asynchronously via a REST API call and bound to an `XyTextDataSeries`, which is then rendered using `FastTextRenderableSeries` as explained in [The Text Series](https://www.scichart.com/documentation/js/current/TheTextSeriesType.html) documentation.\n\n### Features and Capabilities\nThis implementation includes advanced interactive features such as zooming and panning. The chart modifiers (`ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier`) enable dynamic user interactions and can be reviewed in further detail in the [Tutorial 03 - Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html) guide. Additionally, custom theming is applied using an `appTheme`, contributing to a polished and consistent visual appearance.\n\n### Integration and Best Practices\nThe example follows best practices in JavaScript by utilizing asynchronous operations for efficient data fetching and WebAssembly for rendering performance. It also incorporates a resource management approach by providing a cleanup function that disposes of the `SciChartSurface` instance when it is no longer needed, addressing concerns detailed in the [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) documentation. This strategy ensures proper disposal of resources and helps prevent memory leaks, aligning with the recommended practices outlined in the SciChart documentation.",
            },
            react: {
                subtitle:
                    "This example demonstrates **FastTextRenderableSeries** using SciChart.js. The dataset is an AI analysis of 2100 tweets, extracting the organisations mentioned and the sentiment of the tweet.",
                title: "React Text Chart",
                pageTitle: "React Text Chart",
                metaDescription: "Create React Text Chart with high performance SciChart.js.  ",
                markdownContent:
                    "## Text Series Chart in React\n\n### Overview\nThis example demonstrates the use of SciChart.js within a React application to create a high-performance chart that visualizes text-based data. It renders AI-analyzed tweet data to display metrics such as the number of tweets (using a `LogarithmicAxis` x-axis) and the average sentiment (using a `NumericAxis` y-axis) by leveraging the `FastTextRenderableSeries`.\n\n### Technical Implementation\nIn this example the chart is initialized asynchronously via the `<SciChartReact/>` component. The initialization logic is encapsulated in the `drawExample` function, which creates a `SciChartSurface` and its associated WebAssembly context. Data is fetched asynchronously from an API and passed into an `XyTextDataSeries`, which is then rendered by the `FastTextRenderableSeries` as described in the [Text Series Type documentation](https://www.scichart.com/documentation/js/current/TheTextSeriesType.html). Interactive modifiers such as `ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier` are applied to enable dynamic user interactions; see details on these modifiers in the [ZoomPanModifier documentation](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html).\n\n### Features and Capabilities\nThe implementation includes several advanced features and customizations such as asynchronous data handling for smooth chart initialization and interactive user experience through zooming and panning. The custom theming integrated via the SciChart.js theme further enhances the visual presentation, while WebAssembly ensures high-performance rendering even with complex text series.\n\n### Integration and Best Practices\nThis example follows best practices for React integration, encapsulating chart logic within the dedicated `<SciChartReact/>` component to facilitate reusability and maintainability. Developers can leverage the asynchronous initialization pattern for optimal performance and proper resource management as explained in the [Tutorial 02 - Creating a Chart with scichart-react](https://www.scichart.com/documentation/js/current/Tutorial02CreatingChartsWithInitChart.html) guide. The approach demonstrated here aligns with recommended practices for managing async operations and leveraging WebAssembly for high-performance rendering as further discussed in the [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/) article.",
            },
            angular: {
                subtitle:
                    "This example demonstrates **FastTextRenderableSeries** using SciChart.js. The dataset is an AI analysis of 2100 tweets, extracting the organisations mentioned and the sentiment of the tweet.",
                title: "Angular Text Chart",
                pageTitle: "Angular Text Chart",
                metaDescription: "Create Angular Text Chart with high performance SciChart.js.  ",
                markdownContent:
                    "## Angular Text Chart - Angular\n\n### Overview\nThis example demonstrates an Angular integration of SciChart.js using the `FastTextRenderableSeries`. It visualizes an analysis of tweet data, showing the number of tweets on a `LogarithmicAxis` x-axis and average sentiment on a `NumericAxis` y-axis. The integration leverages an Angular standalone component to manage asynchronous chart initialization and interactivity.\n\n### Technical Implementation\nThe chart is initialized asynchronously within an Angular component by binding the `drawExample` function to the `ScichartAngularComponent`. The asynchronous initialization creates a `SciChartSurface` with a WebAssembly context to ensure high-performance rendering. The implementation sets up a logarithmic x-axis and a numeric y-axis with customized settings. Data is fetched from an external API and populated into an `XyTextDataSeries`, which is rendered using the `FastTextRenderableSeries`. Interactive modifiers such as `ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier` are added to enable user interactions. This approach is in line with best practices outlined in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide and the fundamentals of asynchronous initialization explained in the [Tutorial 01 - Setting up a npm Project with SciChart.js](https://www.scichart.com/documentation/js/current/Tutorial%2001%20-%20Setting%20up%20a%20Project%20with%20SciChart.js.html) resource.\n\n### Features and Capabilities\nThe example showcases advanced features including dynamic data binding and real-time performance through WebAssembly. Custom theming through an `appTheme` is applied to enhance the visual appearance. The interactive chart modifiers provide smooth zooming and panning experiences, as detailed in the [Tutorial 03 - Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html) documentation. Furthermore, WebAssembly is leveraged for performance optimization, adhering to practices outlined in the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) guide.\n\n### Integration and Best Practices\nThe integration within Angular is achieved by binding the chart initialization function directly in the component’s template, following Angular’s template binding best practices. Developers can refer to the [scichart-angular](https://www.npmjs.com/package/scichart-angular) npm page for details on integrating SciChart.js with Angular. Dynamic theming is applied as described in the [Chart Styling - Creating a Custom Theme - SciChart](https://www.scichart.com/documentation/js/current/Chart%20Styling%20-%20Creating%20a%20Custom%20Theme.html) documentation. Overall, this example adheres to Angular lifecycle and resource management best practices, ensuring that asynchronous chart creation and potential resource cleanup are handled efficiently.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/TheTextSeriesType.html",
                title: "The documentation page for the TextSeries in SciChart.js",
                linkTitle: "SciChart.js Documentation Home",
            },
        ],
        path: "text-chart",
        metaKeywords: "text, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/TextSeriesChart",
        thumbnailImage: "javascript-text-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: false,
    };
//// End of computer generated metadata

const textChartExampleInfo = createExampleInfo(metaData);
export default textChartExampleInfo;
