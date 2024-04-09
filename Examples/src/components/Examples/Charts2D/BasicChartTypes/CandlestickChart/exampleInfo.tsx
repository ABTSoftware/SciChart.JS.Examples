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
        This demo shows you how to create a <strong>{frameworkName} Candlestick Chart</strong> or Stock Chart using
        SciChart.js. Data is fetched from Binance and placed on the chart. Two moving averages are added. Zooming,
        panning and tooltips as well. Switch between Candlestick or Ohlc, or see the{" "}
        <strong>Realtime Ticking Stock Charts</strong> demo which shows how to add live updates.
    </p>
);

export const candlestickChartExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleCandlestickChart,
    pageTitle: ExampleStrings.pageTitleCandlestickChart,
    path: ExampleStrings.urlCandlestickChart,
    filepath: "Charts2D/BasicChartTypes/CandleStickChart",
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
