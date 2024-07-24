import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-chart-performance-load-one-million-points.jpg";

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlPerformanceTipsDocumentation,
        title: ExampleStrings.urlTitlePerformanceTipsDocumentation,
        linkTitle: "SciChart.js Performance Tips and Tricks",
    },
];

// const previewDescription = ``;
const description = `This demo showcases the loading or startup time of SciChart.js with a million points. Click 'Load' to run the example and see SciChart load 1-million points instantly!`;
const tips = [
    `For the fastest possible way of creating and appending data to a SciChartSurface, use the overloaded
    appendRange functions on dataseries.`,
];

const Subtitle = (frameworkName: string) => (
    <p>
        Showcases how SciChart.js can load and display 1-Million Data-points in milliseconds. Click the{" "}
        <strong>Reload</strong> button at the bottom of the demo to see the chart draw again.
    </p>
);

export const loadOneMillionPointsExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleLoadOneMillionPoints,
    pageTitle: ExampleStrings.titleLoadOneMillionPoints,
    path: ExampleStrings.urlLoadOneMillionPoints,
    filepath: "FeaturedApps/PerformanceDemos/Load1MillionPoints",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    metaDescription: `This demo showcases the incredible performance of our JavaScript Chart by loading a million points instantly.`,
    metaKeywords: "performance, loading, million, points, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
