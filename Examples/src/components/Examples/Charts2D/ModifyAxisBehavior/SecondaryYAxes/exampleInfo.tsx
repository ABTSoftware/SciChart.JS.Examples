import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpes/types/types";
import { TDocumentationLink } from "../../../../../helpes/types/ExampleDescriptionTypes";

const description = `Demonstrates how to assign line series to different Y Axis in a JavaScript Chart. SciChart supports multiple
top or bottom X-Axes and multiple left and right Y-Axes. This example shows in a simple way how to register
a line series on each axis.`;
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

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: ExampleStrings.imgMultipleXAxis,
                title: ExampleStrings.titleMultipleXAxis,
                seoTitle: ExampleStrings.urlTitleMultipleXAxis,
                examplePath: ExampleStrings.urlMultipleXAxis
            },
            {
                imgPath: ExampleStrings.imgVerticalCharts,
                title: ExampleStrings.titleVerticalCharts,
                seoTitle: ExampleStrings.urlTitleVerticalCharts,
                examplePath: ExampleStrings.urlVerticalCharts
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how to create a <strong>JavaScript Chart with Secondary Y axis</strong> using SciChart.js, High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const secondaryYAxesExampleInfo: TExampleInfo = {
    title: "Secondary Y Axes",
    path: ExampleStrings.urlSecondaryYAxis,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates Secondary Y Axis on a JavaScript Chart using SciChart.js. SciChart supports unlimited, multiple left, right, top, bottom X, Y axis with configurable alignment and individual zooming, panning",
    seoKeywords: "secondary, axis, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-with-secondary-y-axis.jpg"
};
