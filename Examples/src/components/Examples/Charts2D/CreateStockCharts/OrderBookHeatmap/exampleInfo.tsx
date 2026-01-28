import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const markdownContent = `
## Order Book Heatmap Chart

This example demonstrates how to create an **Order Book Heatmap** visualization using SciChart.js, combining a **UniformHeatmapRenderableSeries** with a **FastCandlestickRenderableSeries** to display historical orderbook depth levels alongside price candles.


### What is an Order Book Heatmap?

An order book heatmap visualizes the distribution of buy and sell orders at different price levels over time. The intensity of color represents the volume of orders at each price point, helping traders identify:
- **Support and resistance levels** - Areas with high order concentration
- **Liquidity zones** - Where large orders are clustered
- **Price walls** - Significant order accumulations that may affect price movement


### Key Features

- **UniformHeatmapDataSeries** - Efficiently stores 2D grid data with uniform X and Y spacing
- **HeatmapColorMap** - Configurable gradient color mapping from order volume to visual intensity
- **Candlestick overlay** - Price action displayed on top of the heatmap for context
- **Custom tooltips** - CursorModifier with custom template showing OHLC data and order values
- **Interactive navigation** - ZoomPanModifier, MouseWheelZoomModifier, and ZoomExtentsModifier for exploring the data


### Implementation Highlights

The heatmap uses a custom color gradient that transitions from dark (low volume) through white to red (high volume), making it easy to spot areas of high liquidity. The candlestick series is overlaid with semi-transparent colors to ensure both datasets remain visible.
`;

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
                markdownContent,
            },
            react: {
                subtitle: "Create a heatmap chart showing historical orderbook levels",
                title: "Order Book Heatmap",
                pageTitle: "React Orderbook Heatmap",
                metaDescription:
                    "Create a React heatmap chart showing historical orderbook levels, using the high performance SciChart.js chart library. Get free demo now.",
                markdownContent,
            },
            angular: {
                subtitle: "Create a heatmap chart showing historical orderbook levels",
                title: "Angular Orderbook Heatmap",
                pageTitle: "Angular Orderbook Heatmap",
                metaDescription:
                    "Create an Angular heatmap chart showing historical orderbook levels, using the high performance SciChart.js chart library. Get free demo now.",
                markdownContent,
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/v5/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/",
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
