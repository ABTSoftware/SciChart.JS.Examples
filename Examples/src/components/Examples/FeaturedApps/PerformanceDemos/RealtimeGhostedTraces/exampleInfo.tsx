import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-realtime-ghosted-traces-oscilloscope-chart.jpg";

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
    pageTitle: ExampleStrings.titleRealtimeGhostedTraces + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlRealtimeGhostedTraces,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    githubUrl,
    metaDescription:
        "This demo showcases the realtime performance of our JavaScript Chart by animating several series with thousands of data-points at 60 FPS",
    metaKeywords: "realtime, ghosted, traces, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
