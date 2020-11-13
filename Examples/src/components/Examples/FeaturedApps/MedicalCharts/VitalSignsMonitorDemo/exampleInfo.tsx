import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>In this example we are simulating four channels of data showing that SciChart.js can be used to draw real-time
        ECG/EKG charts and graphs to monitor heart reate, body temperature, blood pressure, pulse rate, SPO2 blood
        oxygen, volumetric flow and more.</p>
    <p>SciChart.js will help you short-cut your development by providing rich, real-time high performance and reliable
        charts for JavaScript medical and healthcare applications.</p>
    <h4>Tips!</h4>
    <p>This example uses the GlowShaderEffect - an effect that can be tagged onto BaseRenderableSeries in SciChart to
        add oscilloscope/VDU style glow effects. A single point-marker is added to render the latest point which also
        has the glow applied. Try it out!</p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorialsHome} title={ExampleStrings.titleTutorialsHome} target="_blank">
            SciChart.js Tutorials</a></li>
        <li><a href={ExampleStrings.urlPerformanceTipsDocumentation} target="_blank"
               title={ExampleStrings.urlTitlePerformanceTipsDocumentation}>SciChart.js Performance Tips and Tricks</a>
        </li>
    </ul>
    <h4>See Also</h4>
    <ul>
        <li><a href={ExampleStrings.urlLoad500By500}
               title={ExampleStrings.urlTitleLoad500By500}>Performance Demo: Load 500 series x 500 points</a></li>
        <li><a href={ExampleStrings.urlRealtimeGhostedTraces}
               title={ExampleStrings.urlTitleRealtimeGhostedTraces}>Realtime Performance Demo</a></li>
    </ul>
</div>);
const Subtitle = () => (
    <p>Showcases how SciChart.js can be used in a <strong>Medical context</strong>, drawing ECGs with our High
        Performance{' '}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const vitalSignsMonitorDemoExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleVitalSigns,
    path: ExampleStrings.urlVitalSigns,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: `In this example we are simulating four channels of data showing that SciChart.js can be used to draw real-time
        ECG/EKG charts and graphs to monitor heart reate, body temperature, blood pressure, pulse rate, SPO2 blood
        oxygen, volumetric flow and more.`,
    seoKeywords: "ecg, ekg, realtime, medical, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-vital-signs-ecg-medical-chart-example.jpg"
};
