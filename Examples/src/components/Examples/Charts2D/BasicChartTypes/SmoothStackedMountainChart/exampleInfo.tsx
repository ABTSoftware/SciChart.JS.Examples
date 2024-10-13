import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-smooth-stacked-mountain-chart.jpg";

const description = `Smooth Stacked Mountain Charts can be created in JavaScript using SciChart.js. An mountain or area is rendered from the
    Y-value of each stacked mountain series to the Y-value of the next.
    Each area can have a different color and you can stack to 100% using our library.`;
const tips = [
    `By setting the stroke property you alter the line color, and fill alters the fill. The Mountain-series also
    supports semi-transparent and linear gradient brush fills and looks great!`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlStackedMountainChartDocumentation,
        title: ExampleStrings.urlTitleStackedMountainChartDocumentation,
        linkTitle: "JavaScript Stacked Mountain Chart Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Learn how to make a <strong>{frameworkName} Smooth Stacked Mountain Chart</strong> using with SciChart's{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="powerful JavaScript Charts">
            powerful JavaScript Charts
        </a>{" "}
        and it's range of features.
    </p>
);

const markdownContent: string = undefined

export const smoothStackedMountainChartExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleSmoothStackedMountainChart,
    pageTitle: ExampleStrings.pageTitleSmoothStackedMountainChart,
    path: ExampleStrings.urlSmoothStackedMountainChart,
    filepath: "Charts2D/BasicChartTypes/SmoothStackedMountainChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    metaDescription: (frameworkName: string) =>
        `Design a high performance ${frameworkName} Stacked Mountain Chart with SciChart.js - your one-stop JavaScript chart library. Get free demo now to get started.`,
    metaKeywords: "stacked, mountain, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
    markdownContent
};
