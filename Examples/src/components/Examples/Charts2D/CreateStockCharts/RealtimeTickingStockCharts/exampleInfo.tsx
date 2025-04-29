import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DCreateStockChartsRealtimeTickingStockCharts",
        imagePath: "javascript-realtime-ticking-stock-charts.jpg",
        description:
            "Connects to Binance Exchange to fetch historical data on 1-minute timeframe. Subscribes to WebSocket and listens to candles & trades. Candles are updated in realtime. You can zoom, pan the example or use tooltips. ***Large trades > $25,000 size are plotted as bubbles.***",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Connects to Binance Exchange to fetch historical data on 1-minute timeframe. Subscribes to WebSocket and listens to candles & trades. Candles are updated in realtime. You can zoom, pan the example or use tooltips. ***Large trades > $25,000 size are plotted as bubbles.***",
                title: "JavaScript Realtime Ticking Stock Charts",
                pageTitle: "JavaScript Realtime Ticking Stock Chart | SciChart.js",
                metaDescription:
                    "Create a JavaScript Realtime Ticking Candlestick / Stock Chart with live ticking and updating, using the high performance SciChart.js chart library. Get free demo now.",
                markdownContent:
                    "## Realtime Ticking Stock Charts with JavaScript\n\n### Overview\nThis example demonstrates a high-performance financial chart that updates in realtime using JavaScript and the SciChart.js library. It connects to the Binance Exchange for both historical candle and live trade data, updating candlestick charts dynamically while highlighting significant trades.\n\n### Technical Implementation\nThe implementation establishes WebSocket connections via the websocket-ts library to fetch candle and trade streams from Binance. These streams are merged using RxJS operators such as `combineLatest` and `scan`, a technique explained in detail in [Ultimate Guide to RxJS Join Operators](https://medium.com/@nandeepbarochiya/ultimate-guide-to-rxjs-join-operators-combine-and-merge-streams-90f93f6f722b). The streaming data is processed and transformed into updated candlestick data with custom logic, and the chart is rendered using SciChart.js components such as the `FastCandlestickRenderableSeries` as described in [The Candlestick Series type](https://www.scichart.com/documentation/js/current/The%20Candlestick%20Series%20type.html). In addition, moving average filters are applied to the data series to smooth trends, as covered in the [Moving Average Filter Documentation](https://www.scichart.com/documentation/js/current/MovingAverageFilter.html). For WebSocket communication, best practices outlined in [Writing WebSocket client applications](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing%20WebSocket%20client%20applications) have been followed.\n\n### Features and Capabilities\nThe example offers several advanced features including **realtime chart updates**, dynamic switching between candlestick and OHLC series, and the visualization of large trades as bubbles. Custom palette providers dynamically color volume bars based on trade direction, which leverages the capabilities discussed in [The PaletteProvider API](https://www.scichart.com/documentation/js/current/The%20PaletteProvider%20API.html). Axis animations are also implemented to smoothly adjust the visible range as new data arrives, ensuring an engaging user experience.\n\n### Integration and Best Practices\nDevelopers can use this example as a blueprint for integrating live exchange data with SciChart.js in a JavaScript environment. The solution demonstrates the effective use of RxJS for managing realtime data subscriptions and handling stream merging to maintain performance. By employing WebSocket connections for direct market data integration and utilizing SciChart.js for rendering high-performance charts, the implementation adheres to best practices in both realtime data processing and graphical rendering. This approach is ideal for developers looking to build scalable, responsive financial applications with minimal overhead.",
            },
            react: {
                subtitle:
                    "Connects to Binance Exchange to fetch historical data on 1-minute timeframe. Subscribes to WebSocket and listens to candles & trades. Candles are updated in realtime. You can zoom, pan the example or use tooltips. ***Large trades > $25,000 size are plotted as bubbles.***",
                title: "React Realtime Ticking Stock Charts",
                pageTitle: "React Realtime Ticking Stock Chart | SciChart.js",
                metaDescription:
                    "Create a React Realtime Ticking Candlestick / Stock Chart with live ticking and updating, using the high performance SciChart.js chart library. Get free demo now.",
                markdownContent:
                    "## React Realtime Ticking Stock Charts\n\n### Overview\nThis example demonstrates a real-time ticking stock chart implemented in React using the high performance SciChart.js chart library. It connects to the Binance Exchange via WebSocket and displays live candle and trade data updates, making it ideal for applications that require rapid, real-time visualization.\n\n### Technical Implementation\nThe implementation leverages React components along with hooks and refs to integrate `<SciChartReact/>` and `SciChartNestedOverview`. Real-time updates are achieved using RxJS operators like `combineLatest` and `scan` to `merge` and process live data streams from a custom WebSocket client powered by the websocket-ts package. For an in-depth discussion about real-time data streaming with RxJS in a React application, see [Reactive Programming in React With RxJS](https://dzone.com/articles/reactive-programming-in-react-with-rxjs).\n\n### Features and Capabilities\nThis example showcases several advanced features, including real-time chart updates, dynamic switching between candlestick and OHLC series, and the visualization of large trades above a $25,000 threshold with custom bubble renderings. It also applies moving average filters on streaming data, as detailed in the [Moving Average Filter | JavaScript Chart Documentation - SciChart](https://www.scichart.com/documentation/js/current/MovingAverageFilter.html). These capabilities highlight the customizability and performance strengths of SciChart.js when integrated within a React framework.\n\n### Integration and Best Practices\nThe integration follows best practices for React by encapsulating the SciChart surface and controls in reusable components and managing state through hooks. The use of `<SciChartReact/>` ensures a smooth React integration as demonstrated in [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/). Real-time WebSocket data is efficiently managed with RxJS, aligning with guidelines from [The complete guide to WebSockets with React](https://ably.com/blog/websockets-react-tutorial). Additionally, the example implements animated transitions for axis range updates, a technique explored in [Axis Ranging - How to Listen to VisibleRange Changes](https://www.scichart.com/documentation/js/current/Axis%20Ranging%20-%20How%20to%20Listen%20to%20VisibleRange%20Changes.html). Together, these practices ensure optimal performance and a seamless user experience.",
            },
            angular: {
                subtitle:
                    "Connects to Binance Exchange to fetch historical data on 1-minute timeframe. Subscribes to WebSocket and listens to candles & trades. Candles are updated in realtime. You can zoom, pan the example or use tooltips. ***Large trades > $25,000 size are plotted as bubbles.***",
                title: "Angular Realtime Ticking Stock Charts",
                pageTitle: "Angular Realtime Ticking Stock Chart | SciChart.js",
                metaDescription:
                    "Create a Angular Realtime Ticking Candlestick / Stock Chart with live ticking and updating, using the high performance SciChart.js chart library. Get free demo now.",
                markdownContent:
                    "## Angular Realtime Ticking Stock Charts\n\n### Overview\nThis example demonstrates the creation of a real-time updating candlestick chart using Angular with the high performance SciChart.js library. Designed for financial applications, the chart connects to the Binance Exchange via WebSocket to fetch 1-minute historical and live trading data, updating the candlestick series as new trades arrive. Large trades above a $25,000 threshold are highlighted as bubbles, providing clear visual emphasis on significant market moves.\n\n### Technical Implementation\nThe implementation utilizes Angular’s integration capabilities with RxJS to process live data streams. A custom WebSocket client leverages RxJS operators such as `combineLatest`, `scan`, and `skipWhile` to merge trade and candle streams, ensuring that new data updates the existing candles or creates new ones when required. This approach demonstrates effective use of real-time streaming in an Angular environment, a pattern that is explained in detail in the [Adding Realtime Updates](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html) documentation. Chart rendering is achieved using SciChart.js components and custom palette providers, which dynamically adjust color based on market action.\n\n### Features and Capabilities\nThe chart supports live data updating, interactive zooming and panning, and the ability to switch between candlestick and OHLC series using Angular Material toggle controls. Additionally, moving average filters are applied to the data series to provide trend insights, an implementation detailed in the [Moving Average Filter](https://www.scichart.com/documentation/js/current/MovingAverageFilter.html) documentation. The real-time data processing and custom rendering ensure high performance even with high frequency updates, making it ideal for performance intensive financial applications.\n\n### Integration and Best Practices\nThis example adheres to Angular best practices by integrating third-party libraries like SciChart.js and handling real-time WebSocket data with RxJS. The use of Angular Material components for user interface elements, such as toggle buttons and dropdown controls, provides a seamless and responsive user experience. Developers interested in Angular WebSocket integration can refer to resources such as the [WebSockets in Angular: A Comprehensive Guide](https://medium.com/@saranipeiris17/websockets-in-angular-a-comprehensive-guide-e92ca33f5d67) and leverage techniques from [Angular RxJS real-time data](https://angular.love/combinelatest-rxjs-reference) to efficiently manage asynchronous data streams. Additionally, custom palette providers illustrate how to implement dynamic chart coloring directly within an Angular application, a feature further described in the [PaletteProvider API](https://www.scichart.com/documentation/js/current/The%20PaletteProvider%20API.html) documentation.\n\nOverall, this example encapsulates a robust integration of Angular, RxJS, and SciChart.js to deliver highly interactive and performant real-time stock charts.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20Candlestick%20Series%20type.html",
                title: "This specific page in the JavaScript Candlestick Chart documentation will help you to get started",
                linkTitle: "JavaScript Candlestick Chart Documentation",
            },
        ],
        path: "realtime-ticking-stock-charts",
        metaKeywords: "real-time, ticking, updating, stock, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/CreateStockCharts/RealtimeTickingStockCharts",
        thumbnailImage: "javascript-realtime-ticking-stock-charts.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {
            websocket_ts: "^1.1.1",
            rxjs: "^7.5.6",
        },
    };
//// End of computer generated metadata

export const realtimeTickingStockChartsExampleInfo = createExampleInfo(metaData);
