import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-custom-filters.jpg";

const previewDescription = `This uses a simple custom filter to apply random noise to a line, then an advanced aggregation filter calculates the frequency distribution`;
const description = `Simple Custom Filters are great if you just want to apply some function to each y value.  Just create an XyCustomFilter and set your function.
If you want to significantly reshape your data, create a class that extends XyFilterBase`;
const tips = [
    " There are CustomFilter and FitlerBase types for each of the series types (xy, xyy, xyz, ohlc)",
    " Complex custom filters do not have to output the same series type as they take as input.",
    " If your filter takes a parameter, use a setter to call filterAll when the parameter is updated",
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlCustomFiltersDocumentation,
        title: ExampleStrings.urlTitleFiltersApiDocumentation,
        linkTitle: "SciChart.js Custom Filters Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates simple and advanced <strong>Custom Filters</strong>, with realtime updates using SciChart.js, High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const customFiltersExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleCustomFilters,
    pageTitle: ExampleStrings.titleCustomFilters,
    path: ExampleStrings.urlCustomFilters,
    filepath: "Charts2D/Filters/CustomFilters",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `Demonstrates simple and advanced Custom Filters for data transformation and aggregation, with realtime updates`,
    metaKeywords: "real-time, filter, transform, updating, aggregation, custom, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
