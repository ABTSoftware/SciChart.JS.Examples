import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-digital-mountain-chart.jpg";

const description = `A mountain or area chart draws a polygon from a line to configurable zero value.
    This variation on Mountain Charts in SciChart.js uses the IsDigitalLine property to achieve a stepped-line visual effect!`;
const tips = [
    `By setting the stroke property you alter the line color, and fill alters the fill. The Mountain-series also
    supports semi-transparent and linear gradient brush fills and looks great!.`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlDigitalMountainChartDocumentation,
        title: ExampleStrings.titleDigitalMountainChart,
        linkTitle: "JavaScript Digital Mountain Chart Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        For Digital Mountain Charts, you can use this demonstration to see how to create a{" "}
        <strong>{frameworkName} Digital Mountain Chart</strong> using SciChart.js, and its powerful{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="JavaScript Chart Library">
            JavaScript Chart Library
        </a>
        .
    </p>
);

export const digitalMountainChartExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleDigitalMountainChart,
    pageTitle: ExampleStrings.pageTitleDigitalMountainChart,
    path: ExampleStrings.urlDigitalMountainChart,
    filepath: "Charts2D/BasicChartTypes/DigitalMountainChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    metaDescription: (frameworkName: string) =>
        `Create ${frameworkName} Digital Mountain Chart with a stepped-line visual effect. Get your free trial of SciChart's 5-star rated JavaScript Chart Component now.`,
    metaKeywords: "digital, mountain, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
