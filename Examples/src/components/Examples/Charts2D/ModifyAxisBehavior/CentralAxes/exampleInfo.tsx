import { TExampleInfo } from "../../../../AppRouter/examplePages";
import * as React from "react";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-central-axes.jpg";

const description = `Demonstrates a chart with axes being placed centrally.
SciChart supports customization of axes placement. This example shows how to use inner axes and set a layout strategy.`;
const tips = [`You can create a custom Axis Layout Strategy!`];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlCentralAxesDocumentation,
        title: ExampleStrings.urlTitleCentralAxesDocumentation,
        linkTitle: "Central Axis documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to create a <strong>{frameworkName} Chart with central axes</strong> using SciChart.js, High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const centralAxesExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleCentralAxes,
    pageTitle: ExampleStrings.titleCentralAxes,
    path: ExampleStrings.urlCentralAxes,
    filepath: "Charts2D/ModifyAxisBehavior/CentralAxes",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    metaDescription: (frameworkName: string) =>
        `Demonstrates Central Axes on a ${frameworkName} Chart using SciChart.js. SciChart supports unlimited left, right, top, bottom X, Y axis with configurable layout`,
    metaKeywords: "multiple, axis, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
