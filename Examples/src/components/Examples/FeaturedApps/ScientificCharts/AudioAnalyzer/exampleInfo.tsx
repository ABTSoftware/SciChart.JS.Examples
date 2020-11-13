import * as React from "react";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>Demonstrating the capability of SciChart.js to create a JavaScript Audio Analyzer and{' '}
        visualize the Fourier-Transform of an audio waveform.</p>
    <h4>Tips!</h4>
    <p>This example uses a Line Series to render audio data recorded from the microphone,{' '}
    a Column series to render FFT data, and a
        Heatmap series to render a spectrogram - a scrolling visualisation of frequency domain data.</p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorials3DHome} title={ExampleStrings.titleTutorials3DHome} target="_blank">
            SciChart3D.js Tutorials</a></li>
        <li><a href={ExampleStrings.urlColumnChartDocumentation} target="_blank"
               title={ExampleStrings.urlTitleColumnChartDocumentation}>JavaScript Column
            Chart Documentation</a></li>
        <li><a href={ExampleStrings.urlHeatmapChartDocumentation} target="_blank"
               title={ExampleStrings.urlTitleHeatmapChartDocumentation}>JavaScript Heatmap
            Chart Documentation</a></li>
    </ul>
    <h4>See Also</h4>
    <ul>
        <li><a href={ExampleStrings.urlHeatmapChart}
               title={ExampleStrings.urlTitleHeatmapChart}>The
            JavaScript Heatmap Example</a></li>
        <li><a href={ExampleStrings.urlColumnChart}
               title={ExampleStrings.urlTitleColumnChart}>The
            JavaScript Column Chart Example</a></li>
    </ul>
</div>);
// tslint:disable-next-line:max-line-length
const Subtitle = () => (<p>Demonstrates how to create a <strong>JavaScript Audio Analyzer</strong> with Fourier Transform{' '}
    using SciChart.js, High Performance{' '}
    <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript 3D Charts</a>.{' '}
    <em><strong>Note: </strong>this example requires microphone permissions to run.</em></p>);

export const  audioAnalyzerExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleAudioAnalyzerFeaturedApp,
    path: ExampleStrings.urlAudioAnalyzerFeaturedApp,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: `Demonstrating the capability of SciChart.js to create a JavaScript Audio Analyzer and{' '}
        visualize the Fourier-Transform of an audio waveform.`,
    seoKeywords: "audio, analyzer, demo, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-realtime-audio-analyzer.jpg"
};
