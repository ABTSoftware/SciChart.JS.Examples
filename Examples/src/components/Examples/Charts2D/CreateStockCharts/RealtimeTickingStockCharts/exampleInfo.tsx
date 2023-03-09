import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-realtime-ticking-stock-charts.jpg";
import {LARGE_TRADE_THRESHOLD} from "./createCandlestickChart";

const previewDescription = `An example which demonstrates real-time ticking / updating stock charts in JavaScript with Price data as
Candlesticks or Ohlc and Moving average indicators on the chart.`;
const description = `Technical indicators are for demonstration purposes only. We recommend using the open source TA-Lib`;
const tips = [`You can change the series type from Candlestick to Ohlc to Mountain and more.`];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlDocumentationHome,
        title: ExampleStrings.titleDocumentationHome,
        linkTitle: "SciChart.js Documentation Home"
    },
    {
        href: ExampleStrings.urlTutorialsHome,
        title: ExampleStrings.titleTutorialsHome,
        linkTitle: "SciChart.js Tutorials"
    },
    {
        href: ExampleStrings.urlCandlestickChartDocumentation,
        title: ExampleStrings.urlTitleCandlestickChartDocumentation,
        linkTitle: "JavaScript Candlestick Chart Documentation"
    }
];

const Subtitle = () => (
    <p>
        Connects to Binance Exchange to fetch historical data on 1-minute timeframe. Subscribes to WebSocket and listens to candles & trades.{" "}
        Candles are updated in realtime. You can zoom, pan the example or use tooltips.{" "}
        <strong><em>Large trades &gt; ${LARGE_TRADE_THRESHOLD.toLocaleString()} size are plotted as bubbles.</em></strong>
    </p>
);

export const realtimeTickingStockChartsExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleRealtimeTickingStockCharts,
    pageTitle: ExampleStrings.pageTitleRealtimeTickingStockCharts,
    path: ExampleStrings.urlRealtimeTickingStockCharts,
    filepath: "Charts2D/CreateStockCharts/RealtimeTickingStockCharts",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    githubUrl,
    metaDescription:
        "Create a JavaScript Realtime Ticking Candlestick / Stock Chart with live ticking and updating, using the high performance SciChart.js chart library. Get free demo now.",
    metaKeywords: "real-time, ticking, updating, stock, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
    extraDependencies: { "websocket-ts": "^1.1.1", "rxjs": "^7.5.6" }
};
