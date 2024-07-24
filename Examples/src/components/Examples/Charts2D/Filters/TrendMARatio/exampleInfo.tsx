import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-trend-ma-ratio.jpg";

const previewDescription = `Ratio Filter divides the original dataseries by the divisor series.  Moving Average and Linear Trend fitlers are then applied to the resulting ratio`;
const description = `Click 'Add Data' to see how the filters automatically recalculate when data changes`;
const tips = [
    `Moving Average and Linear Trend filters can be applied to any kind of data series, and you can pick which field to filter`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlFiltersDocumentation,
        title: ExampleStrings.urlTitleFiltersApiDocumentation,
        linkTitle: "JavaScript Filters Api Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how use <strong>Linear Trend, Moving Average and Ratio Filters</strong> with filter chaining, using
        SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const trendMARatioExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleTrendMARatio,
    pageTitle: ExampleStrings.titleTrendMARatio,
    path: ExampleStrings.urlTrendMARatio,
    filepath: "Charts2D/Filters/TrendMARatio",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `Chart with Linear Trendline, Moving Average and Ratio Filters with filter chaining`,
    metaKeywords: "trend, line, moving, average, ratio, transform, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
