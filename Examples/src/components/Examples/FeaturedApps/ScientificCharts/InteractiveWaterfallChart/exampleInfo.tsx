import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-interactive-waterfall-chart.jpg";

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

const Subtitle = () => (
    <p>
        Demonstrates how to create a Waterfall chart in SciChart.js, showing chromotragraphy data with interactive
        selection of points.
    </p>
);

export const waterfallChartExampleInfo: TExampleInfo = {
    onWebsite: false,
    title: "Interactive Waterfall Spectral Chart",
    pageTitle: "Interactive Waterfall Chart",
    path: `interactive-waterfall-chart`,
    filepath: "FeaturedApps/ScientificCharts/InteractiveWaterfallChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    githubUrl,
    metaDescription: previewDescription,
    metaKeywords: "waterfall, chart, interactive, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
