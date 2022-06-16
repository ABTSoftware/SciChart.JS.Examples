import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: ExampleStrings.imgRealtimeJavaScriptChart,
                title: ExampleStrings.titleRealtimeJavaScriptChartDemo,
                seoTitle: ExampleStrings.urlTitleRealtimeJavaScriptChartDemo,
                examplePath: ExampleStrings.urlRealtimeJavaScriptChartDemo
            },
            {
                imgPath: ExampleStrings.imgRealtimeGhostedTracesChart,
                title: ExampleStrings.titleRealtimeGhostedTraces,
                seoTitle: ExampleStrings.urlTitleRealtimeGhostedTraces,
                examplePath: ExampleStrings.urlRealtimeGhostedTraces
            },
            {
                imgPath: ExampleStrings.imgLoad500by500Charts,
                title: ExampleStrings.titleLoad500By500,
                seoTitle: ExampleStrings.urlTitleLoad500By500,
                examplePath: ExampleStrings.urlLoad500By500
            },
            {
                imgPath: ExampleStrings.imgLidarFeaturedApp,
                title: ExampleStrings.titleLidarFeaturedApp,
                seoTitle: ExampleStrings.titleLidarFeaturedApp,
                examplePath: ExampleStrings.urlLidarFeaturedApp
            }
        ]
    }
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
// const previewDescription = ``;
const description = `This demo showcases the loading or startup time of SciChart.js with a million points. Click 'Load' to run the example and see SciChart load 1-million points instantly!`;
const tips = [
    `For the fastest possible way of creating and appending data to a SciChartSurface, use the overloaded
    appendRange functions on dataseries.`
];

const Subtitle = () => (
    <p>
        Showcases how SciChart.js can load and display 1-Million Data-points in milliseconds, making our{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>{" "}
        the fastest in the world!
    </p>
);

export const loadOneMillionPointsExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleLoadOneMillionPoints,
    pageTitle: ExampleStrings.titleLoadOneMillionPoints + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlLoadOneMillionPoints,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    seeAlso,
    code,
    githubUrl,
    metaDescription: `This demo showcases the incredible performance of our JavaScript Chart by loading a million points instantly.`,
    metaKeywords: "performance, loading, million, points, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-performance-one-million-points.jpg"
};
