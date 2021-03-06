import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

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
                imgPath: ExampleStrings.imgLoad500by500Charts,
                title: ExampleStrings.titleLoad500By500,
                seoTitle: ExampleStrings.urlTitleLoad500By500,
                examplePath: ExampleStrings.urlLoad500By500
            },
            {
                imgPath: ExampleStrings.imgRealtimeJavaScriptChart,
                title: ExampleStrings.titleRealtimeJavaScriptChartDemo,
                seoTitle: ExampleStrings.urlTitleRealtimeJavaScriptChartDemo,
                examplePath: ExampleStrings.urlRealtimeJavaScriptChartDemo
            },
            {
                imgPath: ExampleStrings.imgTenorCurves,
                title: ExampleStrings.titleTenorCurvesFeaturedApp,
                seoTitle: ExampleStrings.titleTenorCurvesFeaturedApp,
                examplePath: ExampleStrings.urlTenorCurvesFeaturedApp
            },
            {
                imgPath: ExampleStrings.imgLoadOneMillionPointsChart,
                title: ExampleStrings.titleLoadOneMillionPoints,
                seoTitle: ExampleStrings.titleLoadOneMillionPoints,
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

export const realtimeGhostedTracesExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleRealtimeGhostedTraces,
    path: ExampleStrings.urlRealtimeGhostedTraces,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "This demo showcases the realtime performance of our JavaScript Chart by animating several series with thousands of data-points at 60 FPS",
    seoKeywords: "realtime, ghosted, traces, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-realtime-ghosted-traces-chart.jpg"
};
