import { TExampleInfo } from "../../../../AppRouter/examplePages";
import * as React from "react";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-sync-multi-chart.jpg";

const previewDescription = `This example demonstrates how to synchronise layout and visible range across multiple dynamic charts, and how to synchronise series with an overview chart.`;
const description = ``;
const tips = [``];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlSyncDocs,
        title: "This is a tutorial for how to synchronise the axis and modifiers for multiple charts",
        linkTitle: "SciChart.js Synchronise Charts Tutorial",
    },
    {
        href: ExampleStrings.urlOverviewDocumentation,
        title: ExampleStrings.urlTitleOverviewDocumentation,
        linkTitle: "SciChart.js Overview Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        This example demonstrates how to synchronise layout and visible range across multiple dynamic charts, and how to
        synchronise series with an overview chart.using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const syncMultiChartExampleInfo: TExampleInfo = {
    onWebsite: false,
    title: ExampleStrings.titleSyncMultiChart,
    pageTitle: ExampleStrings.titleSyncMultiChart,
    path: ExampleStrings.urlSyncMultiChart,
    filepath: "Charts2D/MultiChart/SyncMultiChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) => `Synchronise multiple dynamic charts and overview`,
    metaKeywords: "axis, synchronise, multiple, charts, overview, zoom, pan, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
