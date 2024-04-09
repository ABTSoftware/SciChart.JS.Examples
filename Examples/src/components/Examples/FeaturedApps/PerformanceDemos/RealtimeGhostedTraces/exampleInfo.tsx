import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-realtime-ghosted-traces-oscilloscope-chart.jpg";

const description = `This real-time performance demo shows persistence of old traces giving a ‘ghosted’ effect. As new series are
drawn older series are made increasingly transparent until they become invisible.`;
const tips = [
    ` This example uses the GlowShaderEffect - an effect that can be tagged onto BaseRenderableSeries in SciChart
    to add oscilloscope/VDU style glow effects. Try it out!`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlPerformanceTipsDocumentation,
        title: ExampleStrings.urlTitlePerformanceTipsDocumentation,
        linkTitle: "SciChart.js Performance Tips and Tricks",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates real-time oscilloscope style effects with SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const realtimeGhostedTracesExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleRealtimeGhostedTraces,
    pageTitle: ExampleStrings.titleRealtimeGhostedTraces,
    path: ExampleStrings.urlRealtimeGhostedTraces,
    filepath: "FeaturedApps/PerformanceDemos/RealtimeGhostedTraces",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    metaDescription: (frameworkName: string) =>
        `This demo showcases the realtime performance of our ${frameworkName} Chart by animating several series with thousands of data-points at 60 FPS`,
    metaKeywords: "realtime, ghosted, traces, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
