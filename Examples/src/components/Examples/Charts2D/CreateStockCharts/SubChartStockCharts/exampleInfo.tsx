import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-subcharts-multi-pane-stock-charts.jpg";

const previewDescription = `An example which demonstrates creating static multi-pane stock charts in JavaScript with Price data as
Candlesticks, Volume bars behind the chart, Moving averages, plus how to link several charts together to
draw Macd and RSI indicators.`;
const description = ` All charts are synchronized together by using the mouseEventGroup property on chart modifiers and the
SciChartVerticalGroup type. Technical indicators are for demo purposes only. We recommend using TA-Lib to add more complex indicators to SciChart.js`;
const tips = [
    `SciChart.js supports all the features you need to create rich, interactive, realtime JavaScript Stock Chart
    applications. Including Candlestick/OHLC charts, Band Series for bollinger bands, multi-panes, plus
    incredible real-time performance.`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlDocumentationHome,
        title: ExampleStrings.titleDocumentationHome,
        linkTitle: "SciChart.js Documentation Home",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Using the new Sub-Charts API, create a multi-pane stock chart example with indicator panels on a single WebGL
        chart surface. This allows for higher-performance since the WebGL context is shared. Zooming, panning, cursors
        are synchronised between the charts.{" "}
    </p>
);

export const subChartStockChartsExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleSubChartStockChart,
    pageTitle: ExampleStrings.pageTitleSubChartStockChart,
    path: ExampleStrings.urluSubChartStockChart,
    filepath: "Charts2D/CreateStockCharts/SubChartStockCharts",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `Create a ${frameworkName} Multi-Pane Candlestick / Stock Chart with indicator panels, synchronized zooming, panning and cursors. Get your free trial of SciChart.js now.`,
    metaKeywords: "multi-pane, stock, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
