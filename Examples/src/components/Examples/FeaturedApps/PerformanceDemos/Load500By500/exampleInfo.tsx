import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-chart-load-500-series-by-500-points.jpg";

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlPerformanceTipsDocumentation,
        title: ExampleStrings.urlTitlePerformanceTipsDocumentation,
        linkTitle: "SciChart.js Performance Tips and Tricks",
    },
];

const previewDescription = `This demo showcases the loading or startup time of SciChart.js with many series by appending 500 series to a chart, each with 500 points and rendering instantly!`;
const description = `This kind of plot can be used in statistical analysis such as rendering the output of Monte Carlo
simulations. Anywhere you need hundreds (or even thousands) of line series on a chart, SciChart.js can
help!`;
const tips = [
    `For the fastest possible way of creating and appending data to a SciChartSurface, use the overloaded
    appendRange functions on dataseries.`,
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates loading <strong>500 series, each with 500 points (250k points total) instantly</strong>. Click the{" "}
        <strong>Reload</strong> button at the bottom of the demo to see the chart draw again.
    </p>
);

export const load500By500ExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleLoad500By500,
    pageTitle: ExampleStrings.titleLoad500By500,
    path: ExampleStrings.urlLoad500By500,
    filepath: "FeaturedApps/PerformanceDemos/Load500By500",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `This demo showcases the incredible performance of our ${frameworkName} Chart by loading 500 series with 500 points (250k points) instantly!`,
    metaKeywords: "performance, demo, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
