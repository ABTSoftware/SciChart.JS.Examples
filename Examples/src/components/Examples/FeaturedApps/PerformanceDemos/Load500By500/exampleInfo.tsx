import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import realtimePerformanceImg from "../RealtimePerformanceDemo/javascript-chart-realtime-performance-demo.jpg";
import ghostedTracesImg from "../RealtimeGhostedTraces/javascript-realtime-ghosted-traces-chart.jpg";
import millionPointsDemoImg from "../Load1MillionPoints/javascript-chart-performance-one-million-points.jpg";
import ExampleDescription from "../../../../ExampleDescription/ExampleDescription";
import { TDocumentationLink } from "../../../../../helpes/types/ExampleDescriptionTypes";
import { GalleryItem } from "../../../../../helpes/types/types";
import Gallery from "../../../../Gallery/Gallery";

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
                seoTitle: "Realtime Ghosted Traces JavaScript Chart Performance demo",
                examplePath: ExampleStrings.urlRealtimeGhostedTraces
            },
            {
                imgPath: millionPointsDemoImg,
                title: ExampleStrings.titleLoadOneMillionPoints,
                seoTitle: "Load One Million Points in a JavaScript Chart Performance Demo",
                examplePath: ExampleStrings.urlLoadOneMillionPoints
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

const previewDescription = `This demo showcases the loading or startup time of SciChart.js with many series by appending 500 series to a chart, each with 500 points and rendering instantly!`;
const description = `This kind of plot can be used in statistical analysis such as rendering the output of Monte Carlo
simulations. Anywhere you need hundreds (or even thousands) of line series on a chart, SciChart.js can
help!`;
const tips = [
    `For the fastest possible way of creating and appending data to a SciChartSurface, use the overloaded
    appendRange functions on dataseries.`
];

const Description = () => (
    <div>
        <ExampleDescription
            documentationLinks={documentationLinks}
            tips={tips}
            description={description}
            previewDescription={previewDescription}

        />
    </div>
);
const SeeAlsoComponent = () => <Gallery examples={seeAlso} />;

const Subtitle = () => (
    <p>
        Demonstrates loading <strong>250k points instantly</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const load500By500ExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleLoad500By500,
    path: ExampleStrings.urlLoad500By500,
    subtitle: Subtitle,
    description: Description,
    seeAlso: SeeAlsoComponent,
    code,
    githubUrl,
    seoDescription: `This demo showcases the incredible performance of our JavaScript Chart by loading 500 series with 500 points (250k points) instantly!`,
    seoKeywords: "performance, demo, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-load-500-series-by-500-points.jpg"
};
