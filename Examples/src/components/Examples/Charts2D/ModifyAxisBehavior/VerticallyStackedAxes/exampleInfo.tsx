import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import * as React from "react";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const description = `Demonstrates data series on a chart with multiple stacked Y-Axes.
SciChart supports stacked e top or bottom axes. This example shows how to select a layout strategy of axes.`;
const tips = [`Make sure data series and annotations are bound to the correct axis.`];

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
                imgPath: ExampleStrings.imgSecondaryYAxis,
                title: ExampleStrings.titleSecondaryYAxis,
                seoTitle: ExampleStrings.urlTitleSecondaryYAxis,
                examplePath: ExampleStrings.urlSecondaryYAxis
            },
            {
                imgPath: ExampleStrings.imgCentralAxes,
                title: ExampleStrings.titleCentralAxes,
                seoTitle: ExampleStrings.urlTitleCentralAxes,
                examplePath: ExampleStrings.urlCentralAxes
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how to create a <strong>JavaScript Chart with Vertically Stacked Y axis</strong> using SciChart.js, High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const verticallyStackedAxesExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleVerticallyStackedAxes,
    path: ExampleStrings.urlVerticallyStackedAxes,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates Vertically Stacked Axes on a JavaScript Chart using SciChart.js. SciChart supports left, right, top, bottom X, Y Stacked axes",
    seoKeywords: "multiple, axis, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-with-multiple-x-axis.jpg"
};
