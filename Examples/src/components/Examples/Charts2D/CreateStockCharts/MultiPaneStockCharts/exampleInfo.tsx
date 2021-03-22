import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpes/types/types";
import { TDocumentationLink } from "../../../../../helpes/types/ExampleDescriptionTypes";
import ohlcImg from "../../BasicChartTypes/OhlcChart/javascript-ohlc-chart.jpg";
import candlestickImg from "../../BasicChartTypes/CandlestickChart/javascript-candlestick-chart.jpg";
import realtimeStockImg from "../../CreateStockCharts/RealtimeTickingStockCharts/javascript-realtime-ticking-stock-charts.jpg";
import ExampleDescription from "../../../../ExampleDescription/ExampleDescription";

const previewDescription = `An example which demonstrates creating static multi-pane stock charts in JavaScript with Price data as
Candlesticks, Volume bars behind the chart, Moving averages, plus how to link several charts together to
draw Macd and RSI indicators.`;
const description = ` All charts are synchronized together by using the mouseEventGroup property on chart modifiers and the
SciChartVerticalGroup type. Technical indicators are for demonstration purposes only. We recommend using the open source TA-Lib to add more complex indicators to SciChart.js`;
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
                imgPath: realtimeStockImg,
                title: ExampleStrings.titleRealtimeTickingStockCharts,
                seoTitle: ExampleStrings.urlTitleRealtimeTickingStockCharts,
                examplePath: ExampleStrings.urlRealtimeTickingStockCharts
            },
            {
                imgPath: ohlcImg,
                title: ExampleStrings.titleOhlcChart,
                seoTitle: ExampleStrings.urlTitleOhlcChart,
                examplePath: ExampleStrings.urlOhlcChart
            },
            {
                imgPath: candlestickImg,
                title: ExampleStrings.titleCandlestickChart,
                seoTitle: ExampleStrings.urlTitleCandlestickChart,
                examplePath: ExampleStrings.urlCandlestickChart
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how create a multi-pane <strong>JavaScript Stock Chart</strong> with indicator panels, synchronized
        zooming, panning and cursors, using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

const Description = () => (
    <div>
        <ExampleDescription
            documentationLinks={documentationLinks}
            tips={tips}
            description={description}
            previewDescription={previewDescription}
        />
    </div>
);

export const multiPaneStockChartsExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleMultiPaneStockChart,
    path: ExampleStrings.urlMultiPaneStockChart,
    subtitle: Subtitle,
    description: Description,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "Multi-Pane JavaScript Stock Chart (Candlestick Chart) Example using SciChart.js. Features Indicators, Volume, Moving-Averages and Tooltips across stock charts",
    seoKeywords: "multi-pane, stock, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-multi-pane-stock-charts.jpg"
};
