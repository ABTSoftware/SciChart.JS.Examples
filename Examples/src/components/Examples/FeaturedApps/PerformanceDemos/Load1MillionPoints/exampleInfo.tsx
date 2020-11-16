import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>This demo showcases the loading or startup time of SciChart.js with a million points.
        Click 'Load' to run the example and see SciChart load 1-million points instantly!</p>
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
        <li><a href={ExampleStrings.urlRealtimeJavaScriptChartDemo}
               title={ExampleStrings.urlTitleRealtimeJavaScriptChartDemo}>Realtime JavaScript Chart Example</a></li>
        <li><a href={ExampleStrings.urlLoad500By500}
               title={ExampleStrings.urlTitleLoad500By500}>Performance Demo: Load 500 series x 500 points</a></li>
        <li><a href={ExampleStrings.urlRealtimeGhostedTraces}
               title={ExampleStrings.urlTitleRealtimeGhostedTraces}>Realtime Performance Demo</a></li>
    </ul>
</div>);
const Subtitle = () => (
    <p>Showcases how SciChart.js can load and display 1-Million Data-points in milliseconds, making our{' '}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a>{' '}
        the fastest in the world!</p>);

export const loadOneMillionPointsExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleLoadOneMillionPoints,
    path: ExampleStrings.urlLoadOneMillionPoints,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: `This demo showcases the incredible performance of our JavaScript Chart by loading a million points instantly.`,
    seoKeywords: "performance, loading, million, points, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-performance-one-million-points.jpg"
};
