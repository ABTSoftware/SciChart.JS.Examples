import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const previewDescription = `An example which demonstrates creating static multi-pane stock charts in JavaScript with Price data as
Candlesticks, Volume bars behind the chart, Moving averages, plus how to link several charts together to
draw Macd and RSI indicators.`;
const description = ` All charts are synchronized together by using the mouseEventGroup property on chart modifiers and the
SciChartVerticalGroup type. Technical indicators are for demo purposes only. We recommend using TA-Lib to add more complex indicators to SciChart.js`;
const tips = [
    `SciChart.js supports all the features you need to create rich, interactive, realtime JavaScript Stock Chart
    applications. Including Candlestick/OHLC charts, Band Series for bollinger bands, multi-panes, plus
    incredible real-time performance.`
];

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

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: ExampleStrings.imgRealtimeTickingStockCharts,
                title: ExampleStrings.titleRealtimeTickingStockCharts,
                seoTitle: ExampleStrings.urlTitleRealtimeTickingStockCharts,
                examplePath: ExampleStrings.urlRealtimeTickingStockCharts
            },
            {
                imgPath: ExampleStrings.imgOhlcChart,
                title: ExampleStrings.titleOhlcChart,
                seoTitle: ExampleStrings.urlTitleOhlcChart,
                examplePath: ExampleStrings.urlOhlcChart
            },
            {
                imgPath: ExampleStrings.imgCandleStickChart,
                title: ExampleStrings.titleCandlestickChart,
                seoTitle: ExampleStrings.urlTitleCandlestickChart,
                examplePath: ExampleStrings.urlCandlestickChart
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        Here we are demonstrating how create a multi-pane JavaScript Stock Chart with indicator panels,{" "}
        synchronized zooming, panning and cursors, using our{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="powerful and feature rich JavaScript Charting Library">
            powerful and feature rich JavaScript Charting Library
        </a>.
    </p>
);

export const multiPaneStockChartsExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleMultiPaneStockChart,
    pageTitle: ExampleStrings.pageTitleMultiPaneStockChart,
    path: ExampleStrings.urlMultiPaneStockChart,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    metaDescription:
        "Create a JavaScript Multi-Pane Candlestick / Stock Chart with indicator panels, synchronized zooming, panning and cursors. Get your free trial of SciChart.js now.",
    metaKeywords: "multi-pane, stock, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-multi-pane-stock-charts.jpg"
};
