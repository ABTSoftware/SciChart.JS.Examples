import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-vertical-charts.jpg";

const description = `Demonstrates a vertical chart with XAxis on the Left and YAxis on the Top. SciChart.js supports unlimited X
and Y axis and allows placement of any axis on the Left, Right, Top, Bottom of the chart.`;
const tips = [
    `The vertical chart, popular in Oil & Gas, Geo-surveying, is created by setting xAxis.axisAlignment =
Left, and yAxis.axisAlignment = top.`,
    `Try dragging an axis or the chart to zoom and pan around. Double clicking the chart resets the zoom!`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlVerticalChartsDocumentation,
        title: ExampleStrings.urlTitleVerticalChartsDocumentation,
        linkTitle: "SciChart.js Documentation Home",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to create a <strong>rotated {frameworkName} Chart with vertical X-Axis</strong> using
        SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const verticalChartsExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleVerticalCharts,
    pageTitle: ExampleStrings.titleVerticalCharts,
    path: ExampleStrings.urlVerticalCharts,
    filepath: "Charts2D/ModifyAxisBehavior/VerticalCharts",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    metaDescription: (frameworkName: string) =>
        `Demonstrates alignment of Axis to create a vertical chart with SciChart.js - JavaScript Charts.`,
    metaKeywords: "vertical, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
