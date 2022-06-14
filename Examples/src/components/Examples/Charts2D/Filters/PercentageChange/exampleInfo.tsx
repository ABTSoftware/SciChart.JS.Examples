import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const Subtitle = () => (
    <p>
        Demonstrates how to use a ScaleOffsetFilter to convert data to a <strong>Percentage Change</strong> with realtime updates,
        using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

const previewDescription = `ScaleOffsetFilter multiples each data point by a scale factor and adds an offset.
This can be used to convert data to a percentage change`;
const description = `The zero value for change is the visible start of the chart and data rescales as you pan.
Click the Add Data button to see that data is automatically transformed when the original data is updated.
A simple extention to the RenderableSeries allows us to show the original values for the transformed series in the rollover tooltip`;
const tips = [`ScaleOffsetFilters are available for all DataSeries types, so you could do the same thing for a band or candlestick chart`];

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
        href: ExampleStrings.urlScaleOffsetDocumentation,
        title: ExampleStrings.urlTitleFiltersApiDocumentation,
        linkTitle: "SciChart.js ScaleOffsetFilter Documentation"
    }
];

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: ExampleStrings.imgTrendMARatio,
                title: ExampleStrings.titleTrendMARatio,
                seoTitle: ExampleStrings.titleTrendMARatio,
                examplePath: ExampleStrings.urlTrendMARatio
            },
            {
                imgPath: ExampleStrings.imgCustomFilters,
                title: ExampleStrings.titleCustomFilters,
                seoTitle: ExampleStrings.titleCustomFilters,
                examplePath: ExampleStrings.urlCustomFilters
            },
            {
                imgPath: ExampleStrings.imgLineChart,
                title: ExampleStrings.titleLineChart,
                seoTitle: ExampleStrings.urlTitleLineChartDocumentation,
                examplePath: ExampleStrings.urlLineChart
            },
        ]
    }
];

export const percentageChangeExampleInfo: TExampleInfo = {
    title: ExampleStrings.titlePercentageChange,
    pageTitle: ExampleStrings.titlePercentageChange + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlPercentageChange,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    metaDescription:
        "How to use a ScaleOffsetFilter to convert data to a percentage change, with realtime updates, rescale on pan",
    metaKeywords: "real-time, updating, percentage, transform, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-percentage-change.jpg"
};
