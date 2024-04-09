import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-stacked-column-chart.jpg";

const description = `Stacked Column Charts can be created in JavaScript using SciChart.js. An column or rectangle is rendered from the
    Y-value of each stacked column series to the Y-value of the next.
    Each column can have a different color and you can stack to 100% using our library.`;
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
        The example on this page demonstrates how to create a <strong>{frameworkName} Stacked Column Chart</strong>{" "}
        using our{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="JavaScript Chart Library">
            feature-rich JavaScript Chart Library
        </a>
        , SciChart.js.
    </p>
);

export const stackedColumnChartExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleStackedColumnChart,
    pageTitle: ExampleStrings.pageTitleStackedColumnChart,
    path: ExampleStrings.urlStackedColumnChart,
    filepath: "Charts2D/BasicChartTypes/StackedColumnChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    metaDescription: (frameworkName: string) =>
        `Discover how to create a ${frameworkName} Stacked Column Chart using our feature-rich JavaScript Chart Library, SciChart.js. Get your free demo today!`,
    metaKeywords: "stacked, column, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
