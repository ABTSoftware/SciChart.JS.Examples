import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-stacked-grouped-column-chart.jpg";

const description = `Demonstrates how to create a JavaScript Stacked Column Chart with side-by-side grouping. This mode of
Stacked Column Charts groups the columns next to each other, allowing for easy comparison of several
datasets.`;
const tips = [
    `To change the width of the column, set the dataPointWidth property from 0.0 to 1.0. This alters how much space the column takes up.`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlStackedColumnChartDocumentation,
        title: ExampleStrings.urlTitleStackedColumnChartDocumentation,
        linkTitle: "JavaScript Stacked Column Chart Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        We have created a simple example that shows you how to create a{" "}
        <strong>{frameworkName} Stacked Column Chart Side-by-side</strong> using our{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="JavaScript Chart Framework">
            JavaScript Chart Framework
        </a>
        .
    </p>
);

export const stackedColumnSideBySideExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleGroupedColumnChart,
    pageTitle: ExampleStrings.pageTitleGroupedColumnChart,
    path: ExampleStrings.urlGroupedColumnChart,
    filepath: "Charts2D/BasicChartTypes/StackedColumnSideBySideChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    metaDescription: (frameworkName: string) =>
        `Design ${frameworkName} Stacked Group Column Chart side-by-side using our 5-star rated JavaScript Chart Framework, SciChart.js. Get  your free demo now.`,
    metaKeywords: "stacked, column, side-by-side, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
