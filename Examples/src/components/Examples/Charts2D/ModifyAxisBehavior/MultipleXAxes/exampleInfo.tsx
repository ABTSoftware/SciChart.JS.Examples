import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import * as React from "react";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-chart-with-multiple-x-axis.jpg";

const description = `Demonstrates a line chart with four series and multiple top / bottom X-Axis and left / right Y-Axis.
SciChart supports multiple top or bottom X-Axes and multiple left and right Y-Axes. This example shows in a
simple way how to register a line series on each axis.`;
const tips = [`Try dragging an axis or the chart to zoom and pan around. Double clicking the chart resets the zoom!`];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlDocumentationHome,
        title: ExampleStrings.titleDocumentationHome,
        linkTitle: "SciChart.js Documentation Home"
    },
    {
        href: ExampleStrings.urlTutorialsHome,
        title: ExampleStrings.titleTutorialsHome,
        linkTitle: "SciChart.js Tutorials"
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how to create a <strong>JavaScript Chart with multiple X,Y axis</strong> using SciChart.js, High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const multipleXAxesExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleMultipleXAxis,
    pageTitle: ExampleStrings.titleMultipleXAxis + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlMultipleXAxis,
    filepath: "Charts2D/ModifyAxisBehavior/MultipleXAxes",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    githubUrl,
    metaDescription:
        "Demonstrates Multiple X & Y Axis on a JavaScript Chart using SciChart.js. SciChart supports unlimited left, right, top, bottom X, Y axis with configurable alignment and individual zooming, panning",
    metaKeywords: "multiple, axis, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
