import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>This real-time performance demo shows persistence of old traces giving a ‘ghosted’ effect. As new series are
        drawn older series are made increasingly transparent until they become invisible.
    </p>
    <h4>Tips!</h4>
    <p>This example uses the GlowShaderEffect - an effect that can be tagged onto BaseRenderableSeries in SciChart to
        add oscilloscope/VDU style glow effects. Try it out!</p>
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
        <li><a href={ExampleStrings.urlRealtimeJavaScriptChartDemo}
               title={ExampleStrings.urlTitleRealtimeJavaScriptChartDemo}>Realtime Performance Demo</a></li>
    </ul>
</div>);
const Subtitle = () => (
    <p>Demonstrates real-time oscilloscope style effects with SciChart.js, High Performance{' '}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const realtimeGhostedTracesExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleRealtimeGhostedTraces,
    path: ExampleStrings.urlRealtimeGhostedTraces,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: "This demo showcases the realtime performance of our JavaScript Chart by animating several series with thousands of data-points at 60 FPS",
    seoKeywords: "realtime, ghosted, traces, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-realtime-ghosted-traces-chart.jpg"
};
