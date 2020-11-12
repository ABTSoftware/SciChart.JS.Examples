import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>Demonstrates how to create a JavaScript Donut Chart. This is a circular chart type with a hole in the center
        consisting of
        sectors which are proportional to the quantity it represents.</p>
    <h4>Tips!</h4>
    <p>You can change the fill color of every segment and the style of its label.</p>
    <p>Every segment can be highlighted by clicking on it or when selected in the legend.</p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorialsHome} title={ExampleStrings.titleTutorialsHome} target="_blank">
            SciChart.js Tutorials</a></li>
        <li><a href={ExampleStrings.urlDonutChartDocumentation} title={ExampleStrings.urlTitleDonutChartDocumentation}
               target="_blank">
            JavaScript Donut Chart Documentation</a></li>
    </ul>
    <h4>See Also</h4>
    <ul>
        <li><a href={ExampleStrings.urlPieChart} title={ExampleStrings.urlTitlePieChart}>
            The JavaScript Pie Chart Example</a></li>
    </ul>
</div>);

const Subtitle = () => (
    <p>Demonstrates how create a <strong>JavaScript Donut Chart</strong> using SciChart.js, High Performance <a
        href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const donutChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleDonutChart,
    path: ExampleStrings.urlDonutChart,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: `Demonstrates how to create a JavaScript Donut Chart. This is a circular chart type with a hole in the center
        consisting of sectors which are proportional to the quantity it represents.`,
    seoKeywords: "donut, chart, javascript, canvas"
};
