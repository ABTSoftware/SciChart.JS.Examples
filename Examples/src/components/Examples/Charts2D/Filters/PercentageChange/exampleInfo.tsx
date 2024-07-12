import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-percentage-change.jpg";

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to use a ScaleOffsetFilter to convert data to a <strong>Percentage Change</strong> with
        realtime updates, using SciChart.js, High Performance{" "}
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
const tips = [
    `ScaleOffsetFilters are available for all DataSeries types, so you could do the same thing for a band or candlestick chart`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlScaleOffsetDocumentation,
        title: ExampleStrings.urlTitleFiltersApiDocumentation,
        linkTitle: "SciChart.js ScaleOffsetFilter Documentation",
    },
];

export const percentageChangeExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titlePercentageChange,
    pageTitle: ExampleStrings.titlePercentageChange,
    path: ExampleStrings.urlPercentageChange,
    filepath: "Charts2D/Filters/PercentageChange",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `How to use a ScaleOffsetFilter to convert data to a percentage change, with realtime updates, rescale on pan`,
    metaKeywords: "real-time, updating, percentage, transform, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
