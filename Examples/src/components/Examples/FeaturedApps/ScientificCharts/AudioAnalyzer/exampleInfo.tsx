import * as React from "react";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-audio-analyzer-fft-example.jpg";

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

// tslint:disable-next-line:max-line-length
const Subtitle = () => (
    <p>
        Demonstrates how to create a <strong>JavaScript Frequency / Audio Analyzer</strong> with Fourier Transform (Frequency spectra){" "}
        and a real-time frequency history using heatmaps.{" "}
        <em>
            <strong>Note: this example requires microphone permissions to run.</strong>
        </em>
    </p>
);

export const audioAnalyzerExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleAudioAnalyzerFeaturedApp,
    pageTitle: ExampleStrings.titleAudioAnalyzerFeaturedApp + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlAudioAnalyzerFeaturedApp,
    documentationLinks,
    tips,
    description,
    subtitle: Subtitle,
    githubUrl,
    metaDescription:
        "Demonstrating the capability of SciChart.js to create a JavaScript Audio Analyzer and " +
        "visualize the Fourier-Transform of an audio waveform in realtime.",
    metaKeywords: "audio, analyzer, demo, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
