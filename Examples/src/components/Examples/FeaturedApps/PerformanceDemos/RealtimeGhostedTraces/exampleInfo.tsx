import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import Gallery from "../../../../Gallery/Gallery";
import load500By500 from "../Load500By500/javascript-chart-load-500-series-by-500-points.jpg";
import realtimePerformanceImg from "../RealtimePerformanceDemo/javascript-chart-realtime-performance-demo.jpg";
import millionPointsDemoImg from "../Load1MillionPoints/javascript-chart-performance-one-million-points.jpg";
import { GalleryItem } from "../../../../../helpes/types/types";
import ExampleDescription from "../../../../ExampleDescription/ExampleDescription";
import { TDocumentationLink } from "../../../../../helpes/types/ExampleDescriptionTypes";

const description = `This real-time performance demo shows persistence of old traces giving a ‘ghosted’ effect. As new series are
drawn older series are made increasingly transparent until they become invisible.`;
const tips = [
    ` This example uses the GlowShaderEffect - an effect that can be tagged onto BaseRenderableSeries in SciChart
    to add oscilloscope/VDU style glow effects. Try it out!`
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
const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: load500By500,
                title: ExampleStrings.titleLoad500By500,
                seoTitle:
                    "This demo showcases the incredible performance of our JavaScript Chart by loading 500 series with 500 points (250k points) instantly!",
                examplePath: ExampleStrings.urlLoad500By500
            },
            {
                imgPath: realtimePerformanceImg,
                title: ExampleStrings.titleRealtimeJavaScriptChartDemo,
                seoTitle: "Realtime JavaScript Chart Performance Demo with many millions of points",
                examplePath: ExampleStrings.urlRealtimeJavaScriptChartDemo
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
const Subtitle = () => (
    <p>
        Demonstrates real-time oscilloscope style effects with SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);
const Description = () => (
    <div>
        <ExampleDescription
            documentationLinks={documentationLinks}
            tips={tips}
            description={description}
            seeAlso={seeAlso}
        />
    </div>
);
const SeeAlsoComponent = () => <Gallery examples={seeAlso} />;

export const realtimeGhostedTracesExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleRealtimeGhostedTraces,
    path: ExampleStrings.urlRealtimeGhostedTraces,
    subtitle: Subtitle,
    description: Description,
    seeAlso: SeeAlsoComponent,
    code,
    githubUrl,
    seoDescription:
        "This demo showcases the realtime performance of our JavaScript Chart by animating several series with thousands of data-points at 60 FPS",
    seoKeywords: "realtime, ghosted, traces, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-realtime-ghosted-traces-chart.jpg"
};
