import { IExampleMetadata } from "../../../IExampleMetadata";
import { createExampleInfo } from "../../../exampleInfoUtils";
import { metaData } from "./DepthChartMetadata";
import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-depth-chart.jpg";

const previewDescription = `An example which demonstrates a depth chart.`;
const description = ``;
const tips = [""];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlDocumentationHome,
        title: ExampleStrings.titleDocumentationHome,
        linkTitle: "SciChart.js Documentation Home",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>How to create a Market Depth (Order Book) {frameworkName} Chart using Mountain Series and a Custom Modifier</p>
);

const markdownContent: string = undefined;

export const olddepthChartExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleDepthChart,
    pageTitle: ExampleStrings.titleDepthChart,
    path: ExampleStrings.urlDepthChart,
    filepath: "Charts2D/CreateStockCharts/DepthChart",
    subtitle: Subtitle,

    metaDescription: (frameworkName: string) =>
        `Create a ${frameworkName} Depth Chart, using the high performance SciChart.js chart library. Get free demo now.`,
    metaKeywords: "depth, orderbook, stock, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
    markdownContent,
    documentationLinks,
};

// New implementation using centralized utility
export const depthChartExampleInfo = createExampleInfo(metaData as IExampleMetadata);
