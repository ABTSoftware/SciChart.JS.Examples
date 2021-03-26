import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import { GalleryItem } from "../../../../../helpers/types/types";

const Subtitle = () => (
    <p>
        Demonstrates appending <strong>millions of points</strong> to a line chart with SciChart.js, High Performance{" "}
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
const description = `Demonstrates the speed and power of SciChart.js in a real-time example. Creates a timer and pushes 1,000
points every 10ms to 3 line series on the chart (300k points per second). The point count quickly rises into
the millions, and SciChart is still rendering!`;
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

export const realtimePerformanceDemoExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleRealtimeJavaScriptChartDemo,
    path: ExampleStrings.urlRealtimeJavaScriptChartDemo,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "This demo showcases the incredible realtime performance of our JavaScript charts by updating the series with millions of data-points!",
    seoKeywords: "realtime, performance, demo, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-realtime-performance-demo.jpg"
};
