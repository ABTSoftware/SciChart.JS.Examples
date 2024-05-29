import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-candlestick-chart.jpg";

const previewDescription = `SciChart.js supports Candlestick Charts or OHLC with custom colours per bar and Date X-Axis.`;
const description = `Candlestick charts can be animated, dynamically updated for real trading apps or combined with other series types to draw technical indicators or shapes.`;
const tips = [
    `Try dragging on the chart to pan or zoom it. Use the mousewheel to zoom and double-click to zoom to fit.`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlCandlestickChartDocumentation,
        title: ExampleStrings.urlTitleCandlestickChartDocumentation,
        linkTitle: "JavaScript Candlestick Chart Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        This demo shows you how to create a <strong>{frameworkName} Shareable Stock Chart</strong> using SciChart.js.
    </p>
);

export const sharedChartExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleShareableChart,
    pageTitle: ExampleStrings.pageTitleShareableChart,
    path: ExampleStrings.urlShareableChart,
    filepath: "Charts2D/CreateStockCharts/ShareableCharts",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `Discover how to create a ${frameworkName} Candlestick Chart or Stock Chart using SciChart.js. For high Performance JavaScript Charts, get your free demo now.`,
    metaKeywords: "candlestick, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
