import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import * as React from "react";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const description = `Stacked axes allow data to be drawn in different sections of the chart but still overlap.
Zoom vertically using the mouse wheel, or by dragging individual axes.  Right-click and drag to zoom horizontally.  Double click to Reset`;
const tips = [`Make sure data series and annotations are bound to the correct axis.`,
`You can also Horizontally stack top and bottom axes`];

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
    },
    {
        href: ExampleStrings.urlVerticallyStackedAxesDocumentation,
        title: ExampleStrings.urlTitleVerticallyStackedAxesDocumentation,
        linkTitle: "SciChart.js Stacked Axes Documentation"
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
        "Demonstrates Vertically Stacked Axes on a JavaScript Chart using SciChart.js, allowing data to overlap",
    seoKeywords: "multiple, stacked, overlap, axis, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-with-multiple-x-axis.jpg"
};
