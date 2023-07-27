import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-heatmap-interactions.jpg";

const Subtitle = () => (
    <p>
        Demonstrates rich interactivity with custom modifiers using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

const previewDescription = ``;
const description = `SciChart can handle realtime data, and lots of it!.  Pick a chart type and use the sliders to adjust the data volume and see how SciChart is able to keep up.
Data is streamed from the server via websocket and buffered locally so it keeps up with the data even if the render time is more than the update interval.
Stop the updates then zoom with the mousewheel to see all the data is really there.`;
const tips = [
    `For the fastest possible way of creating and appending data to a SciChartSurface, use the overloaded
    appendRange functions on dataseries.`
];
const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlDocumentationHome,
        title: ExampleStrings.titleDocumentationHome,
        linkTitle: "SciChart.js Documentation Home"
    }
];

export const heatmapInteractionsExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleHeatmapInteractionsData,
    pageTitle: ExampleStrings.titleHeatmapInteractionsData + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlHeatmapInteractionsData,
    filepath: "FeaturedApps/ShowCases/HeatmapInteractions",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    githubUrl,
    metaDescription:
        "This demo showcases the incredible realtime performance of our JavaScript charts by updating the series with millions of data-points!",
    metaKeywords: "realtime, performance, demo, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
