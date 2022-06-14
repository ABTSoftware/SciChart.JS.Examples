import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

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

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: ExampleStrings.imgMultiPaneStockChart,
                title: ExampleStrings.titleMultiPaneStockChart,
                seoTitle: ExampleStrings.urlTitleMultiPaneStockChart,
                examplePath: ExampleStrings.urlMultiPaneStockChart
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
        Get the code view our example to learn how create a <strong>JavaScript Stock Chart</strong>{" "}
        with live real-time ticking and updating, using SciChart.js, our range of{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="High Performance JavaScript Charts">
            High Performance JavaScript Charts
        </a>.
    </p>
);

export const realtimeTickingStockChartsExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleRealtimeTickingStockCharts,
    pageTitle: ExampleStrings.pageTitleRealtimeTickingStockCharts,
    path: ExampleStrings.urlRealtimeTickingStockCharts,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    metaDescription:
        "Realtime JavaScript Stock Chart demo using SciChart.js. Features live updating Candlestick/Ohlc charts, moving averages and volume",
    metaKeywords: "real-time, ticking, updating, stock, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-realtime-ticking-stock-charts.jpg"
};
