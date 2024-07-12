import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-heatmap-chart.jpg";

const description = `Our Heatmap is highly dynamic and enables display of Sonar, MRI/medical imagery, Spectrograms or Audio/Radio analysis in JavaScript.
    The entire heatmap is represented by a 2D array and is color-mapped to a numeric value.
    Massive heatmaps (1000x1000 or more) can be achieved in SciChart.js!`;

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlHeatmapChartDocumentation,
        title: ExampleStrings.urlTitleHeatmapChartDocumentation,
        linkTitle: "JavaScript Heatmap Chart Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        If you want to learn about heatmaps. this demo shows you how to create a{" "}
        <strong>{frameworkName} Heatmap Chart</strong> using SciChart.js, our 5-star rated{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="JavaScript Chart Component">
            JavaScript Chart Component
        </a>
        .
    </p>
);

export const heatmapChartExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleHeatmapChart,
    pageTitle: ExampleStrings.pageTitleHeatmapChart,
    path: ExampleStrings.urlHeatmapChart,
    filepath: "Charts2D/BasicChartTypes/HeatmapChart",
    subtitle: Subtitle,
    documentationLinks,
    description,
    metaDescription: (frameworkName: string) =>
        `Easily create a high performance ${frameworkName} Heatmap Chart with SciChart. Get your free trial of our 5-star rated JavaScript Chart Component today.`,
    metaKeywords: "heatmap, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
