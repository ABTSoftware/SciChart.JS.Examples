import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>Demonstrates the FastLineRenderableSeries StrokeDashArray and StrokeThickness
        properties which can be used to style a dashed line, dotted line or solid line.</p>
    <p>The StrokeDashArray property accepts a number array e.g. [2,3] which defines the length of the dash
        and the length of the gap.</p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorialsHome} title={ExampleStrings.titleTutorialsHome} target="_blank">
            SciChart.js Tutorials</a></li>
        <li><a href={ExampleStrings.urlLineChartDocumentation}
               title={ExampleStrings.urlTitleLineChartDocumentation} target="_blank">
            The Line Series Documentation</a></li>
    </ul>
</div>);
const Subtitle = () => (
    <p>Demonstrates how create <strong>JavaScript Charts with dashed lines</strong>{' '}
        using SciChart.js, High Performance{' '}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const dashedLineStylingExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleDashedLineStyling,
    path: ExampleStrings.urlDashedLineStyling,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: "Demonstrates dashed line series in JavaScript charts with SciChart.js",
    seoKeywords: "dash, dashed, dotted, line, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-dashed-dotted-lines.jpg"
};
