import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import ExampleDescription from "../../../../ExampleDescription/ExampleDescription";
import Gallery from "../../../../Gallery/Gallery";

import realtimePerformanceImg from "../RealtimePerformanceDemo/javascript-chart-realtime-performance-demo.jpg";
import ghostedTracesImg from "../RealtimeGhostedTraces/javascript-realtime-ghosted-traces-chart.jpg";
import load500by500 from "../Load500By500/javascript-chart-load-500-series-by-500-points.jpg";
import { GalleryItem } from "../../../../../helpes/types/types";
import { TDocumentationLink } from "../../../../../helpes/types/ExampleDescriptionTypes";

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: realtimePerformanceImg,
                title: ExampleStrings.titleRealtimeJavaScriptChartDemo,
                seoTitle: "Realtime JavaScript Chart Performance Demo with many millions of points",
                examplePath: ExampleStrings.urlRealtimeJavaScriptChartDemo
            },
            {
                imgPath: ghostedTracesImg,
                title: ExampleStrings.titleRealtimeGhostedTraces,
                seoTitle: ExampleStrings.urlTitleRealtimeGhostedTraces,
                examplePath: ExampleStrings.urlRealtimeGhostedTraces
            },
            {
                imgPath: load500by500,
                title: ExampleStrings.titleLoad500By500,
                seoTitle: ExampleStrings.urlTitleLoad500By500,
                examplePath: ExampleStrings.urlLoad500By500
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

const Description = () => (
    <>
        <ExampleDescription documentationLinks={documentationLinks} tips={tips} description={description} />
    </>
);
const SeeAlsoComponent = () => <Gallery examples={seeAlso} />;

export const loadOneMillionPointsExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleLoadOneMillionPoints,
    path: ExampleStrings.urlLoadOneMillionPoints,
    subtitle: Subtitle,
    description: Description,
    seeAlso: SeeAlsoComponent,
    code,
    githubUrl,
    seoDescription: `This demo showcases the incredible performance of our JavaScript Chart by loading a million points instantly.`,
    seoKeywords: "performance, loading, million, points, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-performance-one-million-points.jpg"
};
