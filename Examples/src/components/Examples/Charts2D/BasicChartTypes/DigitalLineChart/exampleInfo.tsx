import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-digital-line-chart.jpg";

const previewDescription = `Step Lines or Digital Lines are created in SciChart.js using the FastLineRenderableSeries. By setting the property IsDigitalLine=true the line is drawn as a step function.`;
const description = `In SciChart.js lines can be stepped, continuous or spline interpolated (smoothed) using our flexible JS Chart Library.`;
const tips = [
    `As well as stroke, you can set strokeThickness, isVisible properties to change how the series is rendered.`,
    `You can add data-point markers to a line series using the PointMarker API. This is very performant and uses
    the same WebGL rendering as our Scatter Charts.`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlDigitalLineChartDocumentation,
        title: ExampleStrings.urlTitleDigitalLineChartDocumentation,
        linkTitle: "JavaScript Digital Line Chart Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to create a <strong>{frameworkName} Digital Line Chart</strong> using SciChart.js, our powerful{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="JavaScript Charts">
            JavaScript Charts
        </a>
    </p>
);

export const digitalLineChartExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleDigitalLineChart,
    pageTitle: ExampleStrings.pageTitleDigitalLineChart,
    path: ExampleStrings.urlDigitalLineChart,
    filepath: "Charts2D/BasicChartTypes/DigitalLineChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `Discover how to create a ${frameworkName} Digital Line Chart with SciChart - your feature-rich JavaScript Chart Library. Get your free demo now.`,
    metaKeywords: "digital, line, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
