import { TExampleInfo } from "../../../../AppRouter/examplePages";
import * as React from "react";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-draw-behind-axes.jpg";

const description = `Demonstrates a chart where the series can draw into the axes area.`;
const tips = [`You can also draw axes over the chart area, and in other positions, buy using Inner Axes`];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlDrawBehindAxesDocumentation,
        title: ExampleStrings.urlTitleDrawBehindAxesDocumentation,
        linkTitle: "Central Axis documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to create a <strong>{frameworkName} Chart with transparent axes</strong> using SciChart.js,
        High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const drawBehindAxesExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleDrawBehindAxes,
    pageTitle: ExampleStrings.titleDrawBehindAxes,
    path: ExampleStrings.urlDrawBehindAxes,
    filepath: "Charts2D/ModifyAxisBehavior/DrawBehindAxes",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    metaDescription: (frameworkName: string) =>
        `Demonstrates the option of the transparent Axes customization on a ${frameworkName} Chart using SciChart.js.`,
    metaKeywords: "multiple, axis, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
