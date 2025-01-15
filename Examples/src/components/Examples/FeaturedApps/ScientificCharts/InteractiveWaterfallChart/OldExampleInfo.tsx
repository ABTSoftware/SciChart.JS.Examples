import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-interactive-waterfall-chart.jpg";
import { EPageLayout } from "../../../../../helpers/types/types";

const previewDescription = `Demonstrates how to create a Waterfall chart in SciChart.js, showing chromotragraphy data with interactive selection of points.`;
const description = ``;
const tips = [``, ``];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlDocumentationHome,
        title: ExampleStrings.titleDocumentationHome,
        linkTitle: "Scichart.js Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to create a Waterfall chart in SciChart.js, showing chromotragraphy data with interactive
        selection of points.
    </p>
);

const markdownContent: string = undefined;

export const waterfallChartExampleInfo: TExampleInfo = {
    onWebsite: false,
    title: "Interactive Waterfall Spectral Chart",
    pageTitle: "Interactive Waterfall Chart",
    path: `interactive-waterfall-chart`,
    filepath: "FeaturedApps/ScientificCharts/InteractiveWaterfallChart",
    subtitle: Subtitle,

    metaDescription: previewDescription,
    metaKeywords: "waterfall, chart, interactive, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
    markdownContent,
    documentationLinks,
    pageLayout: EPageLayout.MaxWidth,
};
