import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import { GalleryItem } from "../../../../../helpers/types/types";

const Subtitle = () => (
    <p>
        Demonstrates handling realtime big data with different chart types using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: ExampleStrings.imgLoad500by500Charts,
                title: ExampleStrings.titleLoad500By500,
                seoTitle: ExampleStrings.urlTitleLoad500By500,
                examplePath: ExampleStrings.urlLoad500By500
            },
            {
                imgPath: ExampleStrings.imgRealtimeGhostedTracesChart,
                title: ExampleStrings.titleRealtimeGhostedTraces,
                seoTitle: ExampleStrings.urlTitleRealtimeGhostedTraces,
                examplePath: ExampleStrings.urlRealtimeGhostedTraces
            },
            {
                imgPath: ExampleStrings.imgLoadOneMillionPointsChart,
                title: ExampleStrings.titleLoadOneMillionPoints,
                seoTitle: ExampleStrings.urlTitleLoad500By500,
                examplePath: ExampleStrings.urlLoadOneMillionPoints
            },
            {
                imgPath: ExampleStrings.imgTenorCurves,
                title: ExampleStrings.titleTenorCurvesFeaturedApp,
                seoTitle: ExampleStrings.titleTenorCurvesFeaturedApp,
                examplePath: ExampleStrings.urlTenorCurvesFeaturedApp
            }
        ]
    }
];

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
    },
    {
        href: ExampleStrings.urlTutorialsHome,
        title: ExampleStrings.titleTutorialsHome,
        linkTitle: "SciChart.js Tutorials"
    },
    {
        href: ExampleStrings.urlPerformanceTipsDocumentation,
        title: ExampleStrings.urlTitlePerformanceTipsDocumentation,
        linkTitle: "SciChart.js Performance Tips and Tricks"
    }
];

export const realtimeBigDataDemoExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleRealtimeBigDataJavaScriptChartDemo,
    pageTitle: ExampleStrings.titleRealtimeBigDataJavaScriptChartDemo + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlRealtimeBigDataJavaScriptChartDemo,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    metaDescription:
        "This demo showcases the incredible realtime performance of our JavaScript charts by updating the series with millions of data-points!",
    metaKeywords: "realtime, performance, demo, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-realtime-performance-demo.jpg"
};
