import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const previewDescription = `The Trade Markers demo uses the Annotations API to place CustomAnnotations rendering buy and sell or news
bullet markers over a simulated price chart.`;
const description = `The CustomAnnotations are created and added using SVG to the sciChartSurface.annotations collection. They
may be placed above or below candles with our helpful API.`;
const tips = [
    ` News/Event bullet annotations use AnnotationBase.${" "}yCoordinateMode = ECoordinateMode.${" "}RelativeY to always place
the event bullet at the bottom of the chart.`
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
        href: ExampleStrings.urlAnnotationsDocumentation,
        title: ExampleStrings.urlTitleAnnotationsDocumentation,
        linkTitle: "Annotations API Documentation"
    }
];

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: ExampleStrings.imgEditableAnnotation,
                title: ExampleStrings.titleEditableAnnotations,
                seoTitle: ExampleStrings.urlTitleEditableAnnotations,
                examplePath: ExampleStrings.urlEditableAnnotations
            },
            {
                imgPath: ExampleStrings.imgAnnotationsAreEasyChart,
                title: ExampleStrings.titleAnnotationsAreEasy,
                seoTitle: ExampleStrings.urlTitleAnnotationsDocumentation,
                examplePath: ExampleStrings.urlAnnotationsAreEasy
            },
            {
                imgPath: ExampleStrings.imgTradeMarkers,
                title: ExampleStrings.titleTradeMarkers,
                seoTitle: ExampleStrings.urlTitleTradeMarkers,
                examplePath: ExampleStrings.urlTradeMarkers
            },
            {
                imgPath: ExampleStrings.imgStackedColumnChart,
                title: ExampleStrings.titleStackedColumnChart,
                seoTitle: ExampleStrings.urlTitleStackedColumnChart,
                examplePath: ExampleStrings.urlStackedColumnChart
            },
            {
                imgPath: ExampleStrings.imgOhlcChart,
                title: ExampleStrings.titleOhlcChart,
                seoTitle: ExampleStrings.urlTitleOhlcChart,
                examplePath: ExampleStrings.urlOhlcChart
            },
            {
                imgPath: ExampleStrings.imgRealtimeTickingStockCharts,
                title: ExampleStrings.titleRealtimeTickingStockCharts,
                seoTitle: ExampleStrings.urlTitleRealtimeTickingStockCharts,
                examplePath: ExampleStrings.urlRealtimeTickingStockCharts
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
        Demonstrates how to add Buy/Sell Markers (annotations) and News/Dividend bullets to a{" "}
        <strong>JavaScript Stock Chart</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const tradeMarkerAnnotationsExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleTradeMarkers,
    pageTitle: ExampleStrings.titleTradeMarkers + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlTradeMarkers,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    metaDescription:
        "Demonstrates how to place Buy/Sell arrow markers on a JavaScript Stock Chart using SciChart.js - Annotations API",
    metaKeywords: "trade, markers, demo, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-stock-chart-buy-sell-markers.jpg"
};
