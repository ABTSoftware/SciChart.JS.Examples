import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import candlestickImg from "../CandlestickChart/javascript-candlestick-chart.jpg";
import multiPaneStockChart from "../../CreateStockCharts/MultiPaneStockCharts/javascript-multi-pane-stock-charts.jpg";
import realtimeStockImg from "../../CreateStockCharts/RealtimeTickingStockCharts/javascript-realtime-ticking-stock-charts.jpg";
import { TDocumentationLink } from "../../../../../helpes/types/ExampleDescriptionTypes";
import { GalleryItem } from "../../../../../helpes/types/types";
import ExampleDescription from "../../../../ExampleDescription/ExampleDescription";

const previewDescription = ` Demonstrates how to create a JavaScript Digital Line Chart. The FastLineRenderableSeries can be used to
render an XyDataSeries, XyyDataSeries (uses Y1 only) or OhlcDataSeries (renders Close).`;
const description = `The FastOhlcRenderableSeries requires an OhlcDataSeries, which contains X,Open,High,Low,Close data. The
color of the candles is controlled by the strokeUp, strokeDown properties. Further customisation of color
per-bar can be achieved with the SciChart.js PaletteProvider API.`;
const tips = [
    `Try dragging on the chart to pan or zoom it. Use the mousewheel to zoom and double-click to zoom to fit.`
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
        href: ExampleStrings.urlOhlcChartDocumentation,
        title: ExampleStrings.urlTitleOhlcChartDocumentation,
        linkTitle: "JavaScript Ohlc Chart Documentation"
    },
    {
        href: ExampleStrings.urlRenderSeriesPropertiesDocumentation,
        title: ExampleStrings.urlTitleRenderSeriesProperties,
        linkTitle: "Common RenderableSeries Properties"
    }
];

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: candlestickImg,
                title: ExampleStrings.titleCandlestickChart,
                seoTitle: ExampleStrings.urlTitleCandlestickChart,
                examplePath: ExampleStrings.urlCandlestickChart
            },
            {
                imgPath: multiPaneStockChart,
                title: ExampleStrings.titleMultiPaneStockChart,
                seoTitle: ExampleStrings.urlTitleMultiPaneStockChart,
                examplePath: ExampleStrings.urlMultiPaneStockChart
            },
            {
                imgPath: realtimeStockImg,
                title: ExampleStrings.titleRealtimeTickingStockCharts,
                seoTitle: ExampleStrings.urlTitleRealtimeTickingStockCharts,
                examplePath: ExampleStrings.urlRealtimeTickingStockCharts
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how to create a <strong>JavaScript Ohlc Chart</strong> or Stock Chart using SciChart.js, High
        Performance{" "}
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
export const ohlcChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleOhlcChart,
    path: ExampleStrings.urlOhlcChart,
    subtitle: Subtitle,
    description: Description,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates how to create a JavaScript Ohlc Chart. This is a chart type used in financial, stock trading " +
        "applications which renders Date, Open, High, Low, Close data.",
    seoKeywords: "ohlc, stock, trading, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-ohlc-chart.jpg"
};
