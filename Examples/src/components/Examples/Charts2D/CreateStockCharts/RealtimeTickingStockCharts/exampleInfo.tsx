import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        id: "chart2D_createStockCharts_RealtimeTickingStockCharts",
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
                markdownContent: null,
            },
            react: {
                subtitle:
                    "Connects to Binance Exchange to fetch historical data on 1-minute timeframe. Subscribes to WebSocket and listens to candles & trades. Candles are updated in realtime. You can zoom, pan the example or use tooltips. ***Large trades > $25,000 size are plotted as bubbles.***",
                title: "React Realtime Ticking Stock Charts",
                pageTitle: "React Realtime Ticking Stock Chart | SciChart.js",
                metaDescription:
                    "Create a React Realtime Ticking Candlestick / Stock Chart with live ticking and updating, using the high performance SciChart.js chart library. Get free demo now.",
                markdownContent: null,
            },
            angular: {
                subtitle:
                    "Connects to Binance Exchange to fetch historical data on 1-minute timeframe. Subscribes to WebSocket and listens to candles & trades. Candles are updated in realtime. You can zoom, pan the example or use tooltips. ***Large trades > $25,000 size are plotted as bubbles.***",
                title: "Angular Realtime Ticking Stock Charts",
                pageTitle: "Angular Realtime Ticking Stock Chart | SciChart.js",
                metaDescription:
                    "Create a Angular Realtime Ticking Candlestick / Stock Chart with live ticking and updating, using the high performance SciChart.js chart library. Get free demo now.",
                markdownContent: null,
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Candlestick%20Series%20type.html",
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
            "websocket-ts": "^1.1.1",
            rxjs: "^7.5.6",
        },
    };
//// End of computer generated metadata

export const realtimeTickingStockChartsExampleInfo = createExampleInfo(metaData);
