import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpes/types/types";
import { TDocumentationLink } from "../../../../../helpes/types/ExampleDescriptionTypes";
import multiPaneStockChart from "../../CreateStockCharts/MultiPaneStockCharts/javascript-multi-pane-stock-charts.jpg";
import ohlcImg from "../../BasicChartTypes/OhlcChart/javascript-ohlc-chart.jpg";
import candlestickImg from "../../BasicChartTypes/CandlestickChart/javascript-candlestick-chart.jpg";
import ExampleDescription from "../../../../ExampleDescription/ExampleDescription";

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
                imgPath: multiPaneStockChart,
                title: ExampleStrings.titleMultiPaneStockChart,
                seoTitle: ExampleStrings.urlTitleMultiPaneStockChart,
                examplePath: ExampleStrings.urlMultiPaneStockChart
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
        Demonstrates how create a <strong>JavaScript Stock Chart</strong> with live real-time ticking and updating,
        using SciChart.js, High Performance{" "}
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

export const realtimeTickingStockChartsExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleRealtimeTickingStockCharts,
    path: ExampleStrings.urlRealtimeTickingStockCharts,
    subtitle: Subtitle,
    description: Description,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "Realtime JavaScript Stock Chart demo using SciChart.js. Features live updating Candlestick/Ohlc charts, moving averages and volume",
    seoKeywords: "real-time, ticking, updating, stock, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-realtime-ticking-stock-charts.jpg"
};
