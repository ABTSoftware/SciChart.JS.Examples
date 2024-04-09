import { TExampleInfo } from "../../../../AppRouter/examplePages";
import * as React from "react";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-overview-chart.jpg";

const previewDescription = `This examples shows how use SciChartOverview to quickly create an overview chart
 that contains a draggable box that controls the visible range of another chart`;
const description = `Drag the box to pan the main chart, and drag the handles of the box to resize it and zoom the main chart.
Right click and drag on the main chart to zoom.`;
const tips = [
    `The overview is a normal sciChartSurface so you can add annotations to it, or customise it any way you want.`,
    `You can easily customise which series appear in the overview, and how they are rendered, with the transformRenderableSeries option.`,
    `You can also apply the overview to vertical charts.`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlOverviewDocumentation,
        title: ExampleStrings.urlTitleOverviewDocumentation,
        linkTitle: "SciChart.js Overview Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to zoom and pan with an <strong>Overview Chart</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const overviewExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleOverview,
    pageTitle: ExampleStrings.titleOverview,
    path: ExampleStrings.urlOverview,
    filepath: "Charts2D/ZoomingAndPanning/OverviewModifier",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) => `Demonstrates how to zoom and pan with an Overview Chart`,
    metaKeywords: "drag, axis, scale, overview, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
