import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>Demonstrates the speed and power of SciChart.js in a real-time example. Creates a timer and pushes 1,000 points
        every 10ms to 3 line series on the chart (300k points per second). The point count quickly rises into the
        millions, and SciChart is still rendering!</p>
    <h4>Tips!</h4>
    <p>For the fastest possible way of creating and appending data to a SciChartSurface, use the overloaded appendRange
        functions on dataseries.</p>
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
        <li><a href={ExampleStrings.urlRealtimeGhostedTracesDemo}
               title={ExampleStrings.urlTitleRealtimeGhostedTracesDemo}>Realtime Ghosted Traces Example</a></li>
    </ul>
</div>);
const Subtitle = () => (
    <p>Demonstrates appending <strong>millions of points</strong> to a line chart{' '}
        with SciChart.js, High Performance{' '}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const realtimePerformanceDemoExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleRealtimeJavaScriptChartDemo,
    path: ExampleStrings.urlRealtimeJavaScriptChartDemo,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: `Demonstrates the speed and power of SciChart.js in a real-time example. Creates a timer and pushes 1,000 points
        every 10ms to 3 line series on the chart (300k points per second). The point count quickly rises into the
        millions, and SciChart is still rendering!`,
    seoKeywords: "realtime, performance, demo, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-realtime-performance-demo.jpg"
};
