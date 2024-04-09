import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-mountain-chart.jpg";

const description = `A mountain or area chart draws a line with polygon underneath. In SciChart.js the Zero line of the mountain is configurable, so it can be zero or a specific value. The fill color can be solid or gradient as well!`;
const tips = [
    `By setting the stroke property you alter the line color, and fill alters the fill. The Mountain-series also
    supports semi-transparent and linear gradient brush fills and looks great!.`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlMountainChartDocumentation,
        title: ExampleStrings.urlTitleMountainChartDocumentation,
        linkTitle: "JavaScript Mountain Chart Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Use our Mountain Chart example to learn how to create a <strong>{frameworkName} Mountain Chart</strong> using
        SciChart.js, our in-house built{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="JavaScript Chart Framework">
            JavaScript Chart framework
        </a>
        .
    </p>
);

export const mountainChartExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleMountainChart,
    pageTitle: ExampleStrings.pageTitleMountainChart,
    path: ExampleStrings.urlMountainChart,
    filepath: "Charts2D/BasicChartTypes/MountainChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    metaDescription: (frameworkName: string) =>
        `Create ${frameworkName} Mountain Chart with SciChart.js. Zero line can be zero or a specific value. Fill color can be solid or gradient as well. Get a free demo now.`,
    metaKeywords: "mountain, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
