import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "OrderBookHeatmap",
        id: "chart2D_createStockCharts_OrderBookHeatmap",
        imagePath: "javascript-order-book-heatmap.jpg",
        description: "",
        tips: [],
        frameworks: {
            javascript: {
                subtitle: "Create a heatmap chart showing historical orderbook levels",
                title: "JavaScript Orderbook Heatmap",
                pageTitle: "JavaScript Orderbook Heatmap",
                metaDescription:
                    "Create a Javascript heatmap chart showing historical orderbook levels using the high performance SciChart.js chart library. Get free demo now.",
                markdownContent: "",
            },
            react: {
                subtitle: "Create a heatmap chart showing historical orderbook levels",
                title: "Order Book Heatmap",
                pageTitle: "React Orderbook Heatmap",
                metaDescription:
                    "Create a React heatmap chart showing historical orderbook levels, using the high performance SciChart.js chart library. Get free demo now.",
                markdownContent: "",
            },
            angular: {
                subtitle:
                    "Connects to Binance Exchange to fetch historical data on 1-minute timeframe. Subscribes to WebSocket and listens to candles & trades. Candles are updated in realtime. You can zoom, pan the example or use tooltips. ***Large trades > $25,000 size are plotted as bubbles.***",
                title: "Angular Orderbook Heatmap",
                pageTitle: "Angular Orderbook Heatmap",
                metaDescription:
                    "Create an Angular heatmap chart showing historical orderbook levels, using the high performance SciChart.js chart library. Get free demo now.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/v4/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/",
                title: "The specific page for the JavaScript Heatmap Chart documentation will help you to get started",
                linkTitle: "JavaScript Heatmap Chart Documentation",
            },
        ],
        path: "order-book-heatmap",
        metaKeywords: "orderbook, heatmap, trading, stock, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/CreateStockCharts/OrderBookHeatmap",
        thumbnailImage: "javascript-order-book-heatmap.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        isNew: true,
    };
//// End of computer generated metadata

const orderBookHeatmapExampleInfo = createExampleInfo(metaData);
export default orderBookHeatmapExampleInfo;
