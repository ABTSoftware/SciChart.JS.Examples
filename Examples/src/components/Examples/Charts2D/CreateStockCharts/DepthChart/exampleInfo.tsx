import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
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
        linkTitle: "SciChart.js Documentation Home"
    }
];

const Subtitle = () => (
    <p>How to create a market depth (order book) chart using mountain series and a custom modifier</p>
);

export const depthChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleDepthChart,
    pageTitle: ExampleStrings.titleDepthChart + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlDepthChart,
    filepath: "Charts2D/CreateStockCharts/DepthChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    githubUrl,
    metaDescription:
        "Create a JavaScript Depth Chart, using the high performance SciChart.js chart library. Get free demo now.",
    metaKeywords: "depth, orderbook, stock, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
