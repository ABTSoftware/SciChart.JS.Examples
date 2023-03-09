import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-spline-smoothed-line-chart.jpg";

const previewDescription = `This example demonstrating a JavaScript Spline Line chart uses the
SplineLineRenderableSeries type.`;
const description = `SciChart's Spline Line type includes a spline-interpolation algorithm to smooth the line, when you have a
few data-points and want a nicer looking, smoothed line series in your chart applications and dashboards`;
const tips = [
    `As well as stroke, you can set strokeThickness, isVisible properties to change how the series is rendered.`,
    `You can add data-point markers to a line series using the PointMarker API. This is very performant and uses the
    same WebGL rendering as our Scatter Charts.`
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
        href: ExampleStrings.urlSplineLineChartDocumentation,
        title: ExampleStrings.titleSplineLineChart,
        linkTitle: "JavaScript Spline Line Chart Documentation"
    },
    {
        href: ExampleStrings.urlRenderSeriesPropertiesDocumentation,
        title: ExampleStrings.urlTitleRenderSeriesProperties,
        linkTitle: "Common RenderableSeries Properties"
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how to create a <strong>JavaScript Spline Line Chart</strong> using SciChart.js, our feature-rich{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="JavaScript Chart Library">
            JavaScript Chart Library
        </a>
    </p>
);

export const splineLineChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleSplineLineChart,
    pageTitle: ExampleStrings.pageTitleSplineLineChart,
    path: ExampleStrings.urlSplineLineChart,
    filepath: "Charts2D/BasicChartTypes/SplineLineChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    githubUrl,
    metaDescription:
        "Discover how to create a JavaScript Spline Line Chart with SciChart. Demo includes algorithm for smoother lines. Get your free trial now.",
    metaKeywords: "spline, smoothed, line, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
