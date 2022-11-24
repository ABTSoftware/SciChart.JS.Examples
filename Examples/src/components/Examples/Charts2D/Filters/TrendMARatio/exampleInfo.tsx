import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-trend-ma-ratio.jpg";

const previewDescription = `Ratio Filter divides the original dataseries by the divisor series.  Moving Average and Linear Trend fitlers are then applied to the resulting ratio`;
const description = `Click 'Add Data' to see how the filters automatically recalculate when data changes`;
const tips = [`Moving Average and Linear Trend filters can be applied to any kind of data series, and you can pick which field to filter`];

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
        href: ExampleStrings.urlFiltersDocumentation,
        title: ExampleStrings.urlTitleFiltersApiDocumentation,
        linkTitle: "JavaScript Filters Api Documentation"
    }
];

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: ExampleStrings.imgPercentageChange,
                title: ExampleStrings.titlePercentageChange,
                seoTitle: ExampleStrings.titlePercentageChange,
                examplePath: ExampleStrings.urlPercentageChange
            },
            {
                imgPath: ExampleStrings.imgCustomFilters,
                title: ExampleStrings.titleCustomFilters,
                seoTitle: ExampleStrings.titleCustomFilters,
                examplePath: ExampleStrings.urlCustomFilters
            },
            {
                imgPath: ExampleStrings.imgRealtimeTickingStockCharts,
                title: ExampleStrings.titleRealtimeTickingStockCharts,
                seoTitle: ExampleStrings.urlTitleRealtimeTickingStockCharts,
                examplePath: ExampleStrings.urlRealtimeTickingStockCharts
            },
            {
                imgPath: ExampleStrings.imgLineChart,
                title: ExampleStrings.titleLineChart,
                seoTitle: ExampleStrings.urlTitleLineChartDocumentation,
                examplePath: ExampleStrings.urlLineChart
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how use <strong>Linear Trend, Moving Average and Ratio Filters</strong> with filter chaining,
        using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const trendMARatioExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleTrendMARatio,
    pageTitle: ExampleStrings.titleTrendMARatio + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlTrendMARatio,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    metaDescription:
        "Chart with Linear Trendline, Moving Average and Ratio Filters with filter chaining",
    metaKeywords: "trend, line, moving, average, ratio, transform, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
