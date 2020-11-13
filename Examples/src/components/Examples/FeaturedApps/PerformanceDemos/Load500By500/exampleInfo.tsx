import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>This demo showcases the loading or startup time of SciChart.js with many series by appending 500 series to a chart,
        each with 500 points and rendering instantly!</p>
    <p>This kind of plot can be used in statistical analysis such as rendering the output of Monte Carlo simulations.
        Anywhere you need hundreds (or even thousands) of line series on a chart, SciChart.js can help!</p>
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
        <li><a href={ExampleStrings.urlRealtimeGhostedTracesDemo}
               title={ExampleStrings.urlTitleRealtimeGhostedTracesDemo}>Realtime Ghosted Traces Example</a></li>
    </ul>
</div>);
const Subtitle = () => (
    <p>Demonstrates loading <strong>250k points instantly</strong>{' '}
        using SciChart.js, High Performance{' '}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const load500By500ExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleLoad500By500,
    path: ExampleStrings.urlLoad500By500,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: `This demo showcases the loading or startup time of SciChart with many series by appending 500 series to a chart,
        each with 500 points and rendering instantly!`,
    seoKeywords: "performance, demo, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-load-500-series-by-500-points.jpg"
};
