import { IExampleMetadata } from "../../../IExampleMetadata";
import { createExampleInfo } from "../../../exampleInfoUtils";
import { metaData } from "./NonUniformHeatmapChartMetadata";
import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-non-uniform-heatmap-chart.jpg";

const description = `Non-uniform heatmaps should be used if you want to specify independent sizes for heat cells.`;
const tips = [
    `To specify the sizes of the cells, use the xCellOffsets and yCellOffsets params.`,
    `It is possible to specify offsets as arrays or mapping functions.`,
    `Updating data with setZValues method recalcula tes the mapped offsets.`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlNonUniformHeatmapChartDocumentation,
        title: ExampleStrings.urlTitleNonUniformHeatmapChartDocumentation,
        linkTitle: "JavaScript Non Uniform Heatmap Chart Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        This SciChart demo demonstrates how to create a <strong>{frameworkName} Non Uniform Heatmap Chart</strong> using{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="SciChart.js">
            SciChart.js
        </a>{" "}
        our High Performance JavaScript Chart component.
    </p>
);

const markdownContent: string = undefined;

export const oldnonUniformHeatmapExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleNonUniformHeatmapChart,
    pageTitle: ExampleStrings.pageTitleNonUniformHeatmapChart,
    path: ExampleStrings.urlNonUniformHeatmapChart,
    filepath: "Charts2D/BasicChartTypes/NonUniformHeatmapChart",
    subtitle: Subtitle,
    metaDescription: (frameworkName: string) =>
        `Create ${frameworkName} Non Uniform Chart using high performance SciChart.js. Display Heatmap with variable cell sizes. Get free demo now.`,
    metaKeywords: "error, bars, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
    markdownContent,
    documentationLinks,
};

// New implementation using centralized utility
export const nonUniformHeatmapExampleInfo = createExampleInfo(metaData as IExampleMetadata);
