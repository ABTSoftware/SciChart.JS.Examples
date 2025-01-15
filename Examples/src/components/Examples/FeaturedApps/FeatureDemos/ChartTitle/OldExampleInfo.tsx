import { IExampleMetadata } from "../../../IExampleMetadata";
import { createExampleInfo } from "../../../exampleInfoUtils";
import { metaData } from "./ChartTitleMetadata";
import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-chart-title.jpg";

const previewDescription = `Demonstrates how to set a Chart Title and some configuration options.`;
const description = ``;
const tips = [``, ``];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlDocumentationHome,
        title: ExampleStrings.titleDocumentationHome,
        linkTitle: "SciChart.js Documentation Home",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>A Chart Title can be placed above, below, or either side of the chart, and be left, center or right aligned.</p>
);

const markdownContent: string = undefined;

export const oldchartTitleExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleChartTitle,
    pageTitle: ExampleStrings.titleChartTitle,
    path: ExampleStrings.urlChartTitle,
    subtitle: Subtitle,

    filepath: "FeaturedApps/FeatureDemos/ChartTitle",
    metaDescription: (frameworkName: string) =>
        `Demonstrates chart title with different position and alignment options`,
    metaKeywords: "title, text, alignment, multiline, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
    markdownContent,
    documentationLinks,
};

// New implementation using centralized utility
export const chartTitleExampleInfo = createExampleInfo(metaData as IExampleMetadata);
