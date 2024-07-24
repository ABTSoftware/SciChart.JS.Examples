import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-ohlc-chart.jpg";

const previewDescription = `SciChart.js supports Candlestick Charts or OHLC with custom colours per bar and Date X-Axis.`;
const description = `OHLC charts can be animated, dynamically updated for real trading apps or combined with other series types to draw technical indicators or shapes.`;
const tips = [
    `Try dragging on the chart to pan or zoom it. Use the mousewheel to zoom and double-click to zoom to fit.`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlOhlcChartDocumentation,
        title: ExampleStrings.urlTitleOhlcChartDocumentation,
        linkTitle: "JavaScript OHLC Chart Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        For this example, we demonstrate how to create a <strong>{frameworkName} OHLC Chart</strong> or Stock Chart
        using SciChart.js. This is our powerful{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="JavaScript Chart Component">
            JavaScript Chart Component
        </a>
        .
    </p>
);

export const ohlcChartExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleOhlcChart,
    pageTitle: ExampleStrings.pageTitleOhlcChart,
    path: ExampleStrings.urlOhlcChart,
    filepath: "Charts2D/BasicChartTypes/OhlcChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `Easily create ${frameworkName} OHLC Chart or Stock Chart using feature-rich SciChart.js chart library. Supports custom colors. Get your free trial now. `,
    metaKeywords: "ohlc, stock, trading, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
