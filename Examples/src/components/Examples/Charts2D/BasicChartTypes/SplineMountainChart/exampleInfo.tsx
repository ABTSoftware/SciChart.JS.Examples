import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-spline-mountain-chart.jpg";

const previewDescription = `A mountain or area chart draws a polygon from a line to configurable zero value. This variation on Mountain Charts in SciChart.js uses Spline (smoothed) lines to achieve a nice visual effect!`;
const description = `This chart type features a spline or smoothed line which beautifies the datavizualization where there are
few points on the chart.`;
const tips = [
    `By setting the stroke property you alter the line color, and fill alters the fill. The Mountain-series also
    supports semi-transparent and linear gradient brush fills and looks great!.`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlSplineMountainChartDocumentation,
        title: ExampleStrings.urlTitleSplineMountainChartDocumentation,
        linkTitle: "JavaScript Mountain Chart Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        This example showcases how to create a <strong>{frameworkName} Spline Mountain Chart</strong> using{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="SciChart.js">
            SciChart.js
        </a>
        ' feature-rich and High Performance JavaScript Charts.
    </p>
);

export const splineMountainChartExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleSplineMountainChart,
    pageTitle: ExampleStrings.pageTitleSplineMountainChart,
    path: ExampleStrings.urlSplineMountainChart,
    filepath: "Charts2D/BasicChartTypes/SplineMountainChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `${frameworkName} Spline Mountain Chart design made easy. Use SciChart.js' JavaScript Charts for high performance, feature-rich designs. Get free demo now.`,
    metaKeywords: "mountain, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
