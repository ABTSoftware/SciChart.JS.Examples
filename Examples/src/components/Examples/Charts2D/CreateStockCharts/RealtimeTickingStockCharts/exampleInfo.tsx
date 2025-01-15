import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\createstockcharts\\realtimetickingstockcharts",
        imagePath: "./javascript-realtime-ticking-stock-charts.jpg",
        description: "",
        path: "realtime-ticking-stock-charts",
        metaKeywords: "real-time, ticking, updating, stock, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/CreateStockCharts/RealtimeTickingStockCharts",
        tips: ['""'],
        thumbnailImage: "javascript-realtime-ticking-stock-charts.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Connects to Binance Exchange to fetch historical data on 1-minute timeframe. Subscribes to WebSocket and listens to candles & trades. Candles are updated in realtime. You can zoom, pan the example or use tooltips. **[object Object]**",
                title: "JavaScript Realtime Ticking Stock Charts",
                pageTitle: "JavaScript Realtime Ticking Stock Chart | SciChart.js",
                metaDescription:
                    "Create a JavaScript Realtime Ticking Candlestick / Stock Chart with live ticking and updating, using the high performance SciChart.js chart library. Get free demo now.",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Connects to Binance Exchange to fetch historical data on 1-minute timeframe. Subscribes to WebSocket and listens to candles & trades. Candles are updated in realtime. You can zoom, pan the example or use tooltips. **[object Object]**",
                title: "React Realtime Ticking Stock Charts",
                pageTitle: "React Realtime Ticking Stock Chart | SciChart.js",
                metaDescription:
                    "Create a React Realtime Ticking Candlestick / Stock Chart with live ticking and updating, using the high performance SciChart.js chart library. Get free demo now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Connects to Binance Exchange to fetch historical data on 1-minute timeframe. Subscribes to WebSocket and listens to candles & trades. Candles are updated in realtime. You can zoom, pan the example or use tooltips. **[object Object]**",
                title: "Angular Realtime Ticking Stock Charts",
                pageTitle: "Angular Realtime Ticking Stock Chart | SciChart.js",
                metaDescription:
                    "Create a Angular Realtime Ticking Candlestick / Stock Chart with live ticking and updating, using the high performance SciChart.js chart library. Get free demo now.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Candlestick%20Series%20type.html",
                title: "This specific page in the JavaScript Candlestick Chart documentation will help you to get started",
                linkTitle: "JavaScript Candlestick Chart Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const realtimeTickingStockChartsExampleInfo = createExampleInfo(metaData);
