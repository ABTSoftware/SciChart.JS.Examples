import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const previewDescription = `This uses a simple custom filter to apply random noise to a line, then a complex aggregation filter calculates the frequency distribution`;
const description = `Simple Custom Filters are great if you just want to apply some function to each y value.  Just create an XyCustomFilter and set your function.
If you want to significantly reshape your data, create a class that extends XyFilterBase`;
const tips = [' There are CustomFilter and FitlerBase types for each of the series types (xy, xyy, xyz, ohlc)',
' Complex custom filters do not have to output the same series type as they take as input.',
' If your filter takes a parameter, use a setter to call filterAll when the parameter is updated'
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
        href: ExampleStrings.urlFiltersApiDocumentation,
        title: ExampleStrings.urlTitleFiltersApiDocumentation,
        linkTitle: "JavaScript Filters Api Documentation"
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
        Demonstrates simple and advanced <strong>custom filters</strong>, with realtime updates
        using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const customFiltersExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleCustomFilters,
    path: ExampleStrings.urlCustomFilters,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "Realtime JavaScript Stock Chart demo using SciChart.js. Features live updating Candlestick/Ohlc charts, moving averages and volume",
    seoKeywords: "real-time, ticking, updating, stock, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-javascript-trend-ma-ratio.jpg"
};
