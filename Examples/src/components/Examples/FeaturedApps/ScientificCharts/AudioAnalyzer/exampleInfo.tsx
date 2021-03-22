import * as React from "react";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpes/types/types";
import { TDocumentationLink } from "../../../../../helpes/types/ExampleDescriptionTypes";
import columnChart from "../../../Charts2D/BasicChartTypes/ColumnChart/javascript-column-chart.jpg";
import heatmapChart from "../../../Charts2D/BasicChartTypes/HeatmapChart/javascript-heatmap-chart.jpg";
import ExampleDescription from "../../../../ExampleDescription/ExampleDescription";

const description = `Demonstrating the capability of SciChart.js to create a JavaScript Audio Analyzer and visualize the
Fourier-Transform of an audio waveform.`;
const tips = [
    `This example uses a Line Series to render audio data recorded from the microphone, a Column series to render
    FFT data, and a Heatmap series to render a spectrogram - a scrolling visualisation of frequency domain data.`
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlDocumentationHome,
        title: ExampleStrings.titleDocumentationHome,
        linkTitle: "SciChart.js Documentation Home"
    },
    {
        href: ExampleStrings.urlTutorials3DHome,
        title: ExampleStrings.titleTutorials3DHome,
        linkTitle: "SciChart3D.js Tutorials"
    },
    {
        href: ExampleStrings.urlColumnChartDocumentation,
        title: ExampleStrings.urlTitleColumnChartDocumentation,
        linkTitle: "JavaScript Column Chart Documentation"
    },
    {
        href: ExampleStrings.urlHeatmapChartDocumentation,
        title: ExampleStrings.urlTitleHeatmapChartDocumentation,
        linkTitle: "JavaScript Heatmap Chart Documentation"
    }
];

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: heatmapChart,
                title: ExampleStrings.titleHeatmapChart,
                seoTitle: ExampleStrings.urlTitleHeatmapChart,
                examplePath: ExampleStrings.urlHeatmapChart
            },
            {
                imgPath: columnChart,
                title: ExampleStrings.titleColumnChart,
                seoTitle: ExampleStrings.urlTitleColumnChart,
                examplePath: ExampleStrings.urlColumnChart
            }
        ]
    }
];

// tslint:disable-next-line:max-line-length
const Subtitle = () => (
    <p>
        Demonstrates how to create a <strong>JavaScript Audio Analyzer</strong> with Fourier Transform using
        SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript 3D Charts
        </a>
        .{" "}
        <em>
            <strong>Note: </strong>this example requires microphone permissions to run.
        </em>
    </p>
);

const Description = () => (
    <div>
        <ExampleDescription documentationLinks={documentationLinks} tips={tips} description={description} />
    </div>
);

export const audioAnalyzerExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleAudioAnalyzerFeaturedApp,
    path: ExampleStrings.urlAudioAnalyzerFeaturedApp,
    subtitle: Subtitle,
    description: Description,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "Demonstrating the capability of SciChart.js to create a JavaScript Audio Analyzer and " +
        "visualize the Fourier-Transform of an audio waveform in realtime.",
    seoKeywords: "audio, analyzer, demo, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-realtime-audio-analyzer.jpg"
};
