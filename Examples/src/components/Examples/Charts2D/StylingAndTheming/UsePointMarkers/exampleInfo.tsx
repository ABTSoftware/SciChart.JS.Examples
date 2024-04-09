import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-chart-custom-pointmarkers.jpg";

const previewDescription = `Demonstrates how to use the FastLineRenderableSeries and the Data-Point Markers API to apply fast
WebGL-rendered data point markers to a line series.`;
const description = `The Point-markers are created using the HTML Canvas or custom images, but applied to the line as a WebGL
Texture, so it’s possible to render tens or hundreds of thousands of point-markers using this method.`;

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlPointMarkersDocumentation,
        title: ExampleStrings.urlTitlePointMarkersDocumentation,
        linkTitle: "Point-Markers API documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to create <strong>custom data-point markers</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const usePointMarkersExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titlePointMarkers,
    pageTitle: ExampleStrings.titlePointMarkers,
    path: ExampleStrings.urlPointMarkers,
    filepath: "Charts2D/StylingAndTheming/UsePointMarkers",
    subtitle: Subtitle,
    documentationLinks,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `Demonstrates the different point-marker types for ${frameworkName} Scatter charts (Square, Circle, Triangle and Custom image point-marker)`,
    metaKeywords: "data, point, marker, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
