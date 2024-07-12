import { TExampleInfo } from "../../../../AppRouter/examplePages";
import * as React from "react";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-chart-with-multiple-x-axis.jpg";

const description = `Demonstrates a line chart with four series and multiple top / bottom X-Axis and left / right Y-Axis.
SciChart supports multiple top or bottom X-Axes and multiple left and right Y-Axes. This example shows in a
simple way how to register a line series on each axis.`;
const tips = [`Try dragging an axis or the chart to zoom and pan around. Double clicking the chart resets the zoom!`];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlMultipleXAxisDocumentation,
        title: ExampleStrings.urlTitleMultipleXAxisDocumentation,
        linkTitle: "SciChart.js Documentation Home",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to create a <strong>{frameworkName} Chart with multiple X,Y axis</strong> using SciChart.js,
        High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const multipleXAxesExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleMultipleXAxis,
    pageTitle: ExampleStrings.titleMultipleXAxis,
    path: ExampleStrings.urlMultipleXAxis,
    filepath: "Charts2D/ModifyAxisBehavior/MultipleXAxes",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    metaDescription: (frameworkName: string) =>
        `Demonstrates Multiple X & Y Axis on a ${frameworkName} Chart using SciChart.js. SciChart supports unlimited left, right, top, bottom X, Y axis with configurable alignment and individual zooming, panning`,
    metaKeywords: "multiple, axis, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
