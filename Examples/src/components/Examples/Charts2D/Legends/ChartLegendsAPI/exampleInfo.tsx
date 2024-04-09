import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-chart-legends.jpg";

const previewDescription = `Demonstrates how to add a Legend to a JavaScript Line Chart using SciChart.js. The legend is created when
you add a LegendModifier type to the sciChartSurface.chartModifiers collection.`;
const description = `Legends may be placed in the top left, top right, bottom left and bottom right of the chart, and can be
oriented horizontally or vertically. Each legend item takes its text from the dataSeriesName property`;
const tips = [
    `There are many different configurations for the legend, including fine grained control over the legend rows.
    Please review the API documentation below carefully for further information.`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlLegendDocumentation,
        title: ExampleStrings.urlTitleLegendDocumentation,
        linkTitle: "Legend API Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to add a legend to a <strong>{frameworkName} Chart</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const chartLegendsAPIExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleChartLegends,
    pageTitle: ExampleStrings.titleChartLegends,
    path: ExampleStrings.urlChartLegends,
    filepath: "Charts2D/Legends/ChartLegendsAPI",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription:
        "Demonstrates how to add a Legends to a JavaScript Line Chart using SciChart.js. The legend is created when you add " +
        "a LegendModifier type to the sciChartSurface.chartModifiers collection.",
    metaKeywords: "legend, api, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
