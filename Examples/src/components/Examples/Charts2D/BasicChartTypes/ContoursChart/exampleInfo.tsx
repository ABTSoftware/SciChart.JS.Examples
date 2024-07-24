import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-heatmap-chart-with-contours.jpg";

const description = `Our Heatmap is highly dynamic and enables display of Sonar, MRI/medical imagery, Spectrograms or Audio/Radio analysis in JavaScript.
    The entire heatmap is represented by a 2D array and is color-mapped to a numeric value.
    Contour lines are calculated at a specified step value and drawn over the chart automatically.`;
const tips = [
    `Contours are calculated using GPU Shader programs so are very fast, but require some tweaking of properties
on UniformContoursRenderableSeries to get a good visual.`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlContourChartDocumentation,
        title: ExampleStrings.urlTitleContourChartDocumentation,
        linkTitle: "JavaScript Contours Chart Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Our Contours Chart example demonstrates how to create a <strong>{frameworkName} Contour-map Chart</strong> using
        our{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="powerful JavaScript Chart Library">
            powerful JavaScript Chart Library
        </a>
        .
    </p>
);

export const contourChartExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleContourChart,
    pageTitle: ExampleStrings.pageTitleContourChart,
    path: ExampleStrings.urlContourChart,
    filepath: "Charts2D/BasicChartTypes/ContoursChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    metaDescription: (frameworkName: string) =>
        `Design a highly dynamic ${frameworkName} Heatmap Chart With Contours with SciChart's feature-rich JavaScript Chart Library. Get your free demo today.`,
    metaKeywords: "contour, contours, heatmap, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
