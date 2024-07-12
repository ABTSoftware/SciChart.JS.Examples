import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-streaming-data.jpg";

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates handling realtime big data with different chart types using SciChart.js, High Performance{" "}
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
    appendRange functions on dataseries.`,
];
const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlDocumentationHome,
        title: ExampleStrings.titleDocumentationHome,
        linkTitle: "SciChart.js Documentation Home",
    },
];

export const websocketBigDataDemoExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleRealtimeBigDataJavaScriptChartDemo,
    pageTitle: ExampleStrings.titleRealtimeBigDataJavaScriptChartDemo,
    path: ExampleStrings.urlRealtimeBigDataJavaScriptChartDemo,
    filepath: "FeaturedApps/ShowCases/WebsocketBigData",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `This demo showcases the incredible realtime performance of our JavaScript charts by updating the series with millions of data-points!`,
    metaKeywords: "realtime, performance, demo, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
