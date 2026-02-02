import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "TradeMarkers",
        id: "chart2D_chartAnnotations_TradeMarkers",
        imagePath: "javascript-stock-chart-buy-sell-markers.jpg",
        description:
            "Demonstrates how to add Hoverable Buy/Sell Markers (annotations) and News/Dividend bullets to a **JavaScript Stock Chart** using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to add Hoverable Buy/Sell Markers (annotations) and News/Dividend bullets to a **JavaScript Stock Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "JavaScript Chart Hoverable Buy Sell Marker Annotations",
                pageTitle: "JavaScript Chart Hoverable Buy Sell Marker Annotations",
                metaDescription:
                    "Demonstrates how to place Buy/Sell arrow markers on a JavaScript Stock Chart using SciChart.js - Annotations API",
                markdownContent:
                    "## Trade Markers Example - JavaScript\n\n### Overview\nThis example demonstrates how to integrate SciChart.js using JavaScript to create a high performance stock chart that features interactive buy/sell markers and news/dividend annotations. The implementation focuses on asynchronous chart initialization, dynamic annotation management, and performance optimization via WebGL rendering.\n\n### Technical Implementation\nThe chart is initialized asynchronously using async/await together with `Promise.all()` to fetch simulated trading data and set up the `SciChartSurface`. A `CategoryAxis` is used for displaying dates (see [The Category Axis](https://www.scichart.com/documentation/js/current/CategoryAxis.html)) and `NumericAxis` represent pricing and additional metrics. Custom SVG-based annotations are created for buy and sell markers, and dynamic hover functionality is implemented via the `AnnotationHoverModifier` (see [Annotation Hover API](https://www.scichart.com/documentation/js/current/AnnotationHover.html)), which binds event handlers for interactive tooltips. Efficient chart rendering is achieved through WebGL, as detailed in [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html).\n\n### Features and Capabilities\nThe example simulates real-time trading actions by dynamically adding annotations based on randomized trading data. It supports advanced multi-axis layout configurations using techniques similar to those described for vertically and horizontally stacked axes. Interactive features such as hoverable annotations provide immediate trade details, and dynamically added news bullets give contextual information, enhancing user engagement. Additionally, the integration of custom SVG strings for marker design showcases how developers can tailor the visual appearance of annotations.\n\n### Integration and Best Practices\nDesigned for JavaScript applications, the example cleanly separates the initialization logic in a dedicated function that takes a DOM element as the chart container. This modular approach simplifies lifecycle management and cleanup via a destructor function. Developers are encouraged to follow these best practices, as explained in resources for asynchronous initialization in JavaScript like [Sequential promises using async/await in JavaScript](https://stackoverflow.com/questions/52697719/sequential-promises-using-async-await-in-vanilla-javascript) to enhance maintainability and performance. Furthermore, the use of custom event subscriptions and dynamic annotation management illustrates best practices for interactive charting solutions.\n",
            },
            react: {
                subtitle:
                    "Demonstrates how to add Hoverable Buy/Sell Markers (annotations) and News/Dividend bullets to a **React Stock Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "React Chart Hoverable Buy Sell Marker Annotations",
                pageTitle: "React Chart Hoverable Buy Sell Marker Annotations",
                metaDescription:
                    "Demonstrates how to place Buy/Sell arrow markers on a React Stock Chart using SciChart.js - Annotations API",
                markdownContent:
                    "## Trade Markers Example for React\n\n### Overview\nThe Trade Markers Example for React demonstrates how to integrate SciChart.js into a React application to render a high performance stock chart with simulated trading data. This example displays a candlestick chart with custom buy/sell markers and news bullet annotations, showcasing the power of interactive and SVG-based custom annotations.\n\n### Technical Implementation\nThe implementation leverages asynchronous data fetching with `Promise.all()` to obtain trade data and initializes the chart using the `<SciChartReact/>` component, as detailed in the [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/) guide. The chart is set up with a `CategoryAxis` for dates and a `NumericAxis` for prices, while various renderable series (e.g., candlestick, line, and mountain series) are used to visualize market data. Custom annotations subclass the base annotation to include hover events, utilizing the `AnnotationHoverModifier` (see [Annotation Hover API](https://www.scichart.com/documentation/js/current/AnnotationHover.html)) for dynamic tooltips.\n\n### Features and Capabilities\nThis example provides real-time simulation of trading actions with custom buy and sell markers that change appearance on hover, effectively illustrating interactive data visualization. It also demonstrates advanced multi-axis configuration and layout management, making use of techniques for integrating [SVG-based annotations](https://www.scichart.com/documentation/js/current/Tutorial%2006%20-%20Adding%20Annotations.html) and setting up multiple axes as explained in the [Tutorial 08 - Adding Multiple Axis](https://www.scichart.com/documentation/js/current/Tutorial%2008%20-%20Adding%20Multiple%20Axis.html) documentation.\n\n### Integration and Best Practices\nThe example follows best practices for React integration by cleanly separating the chart initialization logic, passed into the `<SciChartReact/>` component via the `initChart` prop. Developers can explore asynchronous initialization workflows similar to those discussed in [How to use Promise.all properly fetching data for React app](https://stackoverflow.com/questions/66671540/how-to-use-promise-all-properly-fetching-data-for-react-app) and optimize performance by leveraging WebGL rendering along with efficient event handling. For further insights on performance, consider reviewing [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/).",
            },
            angular: {
                subtitle:
                    "Demonstrates how to add Hoverable Buy/Sell Markers (annotations) and News/Dividend bullets to a **Angular Stock Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Angular Chart Hoverable Buy Sell Marker Annotations",
                pageTitle: "Angular Chart Hoverable Buy Sell Marker Annotations",
                metaDescription:
                    "Demonstrates how to place Buy/Sell arrow markers on a Angular Stock Chart using SciChart.js - Annotations API",
                markdownContent:
                    '## Angular Chart Hoverable Buy Sell Marker Annotations\n\n### Overview\nThis example, "Trade Markers", demonstrates how to integrate SciChart.js within an Angular standalone component to render a high performance stock chart featuring interactive buy/sell markers and news/dividend bullet annotations. The implementation leverages the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package to facilitate seamless integration within Angular applications, ensuring that all chart initialization and interactions are encapsulated in a dedicated Angular component.\n\n### Technical Implementation\nThe chart is initialized asynchronously using async/await together with `Promise.all()` to fetch trading data and set up the `SciChartSurface` efficiently. A `CategoryAxis` is used for date values and `NumericAxis` represent price and balance information, while custom SVG-based annotations are created for buy and sell trades. Custom event handlers, particularly through the use of the `AnnotationHoverModifier` (see [Annotation Hover API](https://www.scichart.com/documentation/js/current/AnnotationHover.html)), allow annotations to respond to hover events by displaying additional tooltips. This approach mirrors common asynchronous integration strategies in Angular, as discussed in resources like [async/await in Angular ngOnInit](https://stackoverflow.com/questions/56092083/async-await-in-angular-ngoninit).\n\n### Features and Capabilities\nThe example provides real-time simulation of trading actions where markers are dynamically added to the chart. It demonstrates advanced features such as a multi-axis layout where a secondary axis displays profit and loss curves, a capability further detailed in the [Tutorial 08 - Adding Multiple Axis](https://www.scichart.com/documentation/js/current/Tutorial%2008%20-%20Adding%20Multiple%20Axis.html) documentation. Custom SVG annotations enable distinct visual representations for buy (green) and sell (red) actions, and interactive tooltips enhance user engagement by presenting detailed trade information on hover.\n\n### Integration and Best Practices\nThe integration follows Angular best practices by encapsulating the chart within a standalone component using the `ScichartAngularComponent`. The chart’s asynchronous initialization and the clear separation of concerns promote maintainability and reusability in large Angular applications. Performance optimizations are achieved through efficient WebGL rendering, ensuring that high-frequency data updates do not impact the user experience. Developers looking to extend or customize this approach should refer to the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide for foundational tips and consult the [Annotation Hover Documentation](https://www.scichart.com/documentation/js/current/AnnotationHover.html) for advanced interactive customization strategies.\n',
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20Annotations%20API%20Overview.html",
                title: "The specific page for the SciChart.js Annotations documentation will help you to get started",
                linkTitle: "Annotations API Documentation",
            },
        ],
        path: "stock-chart-buy-sell-markers",
        metaKeywords: "trade, markers, demo, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/ChartAnnotations/TradeMarkers",
        thumbnailImage: "javascript-stock-chart-buy-sell-markers.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: false
    };
//// End of computer generated metadata

const tradeMarkerAnnotationsExampleInfo = createExampleInfo(metaData);
export default tradeMarkerAnnotationsExampleInfo;
