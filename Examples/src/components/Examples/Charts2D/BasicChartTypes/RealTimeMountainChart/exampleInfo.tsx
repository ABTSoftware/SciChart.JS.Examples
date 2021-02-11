import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>Demonstrates how to create a JavaScript Mountain Chart with animated realtime updates.</p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorialsHome} title={ExampleStrings.titleTutorialsHome} target="_blank">
            SciChart.js Tutorials</a></li>
        <li><a href="#" target="_blank">JavaScript Mountain Chart Documentation</a></li>
    </ul>
    <h4>See Also</h4>
    <ul>
        <li><a href="/javascript-mountain-chart">The JavaScript Mountain Chart Example</a></li>
    </ul>
</div>);

const Subtitle = () => (<p>Demonstrates how create a <strong>JavaScript Mountain Chart with animated realtime updates</strong>{' '}
    using SciChart.js, High Performance{' '}
    <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const realTimeMountainChartExampleInfo: TExampleInfo = {
    title: "JavaScript Realtime Mountain Chart",
    path: "/javascript-realtime-mountain-chart",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: "Demonstrates how to create a JavaScript Mountain Chart with animated realtime updates.",
    seoKeywords: "mountain, chart, realtime, animated, javascript, canvas",
    thumbnailImage: "javascript-animated-mountain-chart.jpg"
};
