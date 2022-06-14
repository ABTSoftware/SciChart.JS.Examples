import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const description = `Demonstrates a vertical chart with XAxis on the Left and YAxis on the Top. SciChart.js supports unlimited X
and Y axis and allows placement of any axis on the Left, Right, Top, Bottom of the chart.`;
const tips = [
    `The vertical chart, popular in Oil & Gas, Geo-surveying, is created by setting xAxis.axisAlignment =
Left, and yAxis.axisAlignment = top.`,
    `Try dragging an axis or the chart to zoom and pan around. Double clicking the chart resets the zoom!`
];

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
        href: ExampleStrings.urlVerticalChartsDocumentation,
        title: ExampleStrings.urlTitleVerticalChartsDocumentation,
        linkTitle: "Vertical Axis Alignment Documentation"
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
                imgPath: ExampleStrings.imgSecondaryYAxis,
                title: ExampleStrings.titleSecondaryYAxis,
                seoTitle: ExampleStrings.urlTitleSecondaryYAxis,
                examplePath: ExampleStrings.urlSecondaryYAxis
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how to create a <strong>rotated JavaScript Chart with vertical X-Axis</strong> using SciChart.js,
        High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const verticalChartsExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleVerticalCharts,
    pageTitle: ExampleStrings.titleVerticalCharts + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlVerticalCharts,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    seeAlso,
    code,
    githubUrl,
    metaDescription: "Demonstrates alignment of Axis to create a vertical chart with SciChart.js - JavaScript Charts.",
    metaKeywords: "vertical, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-vertical-charts.jpg"
};
