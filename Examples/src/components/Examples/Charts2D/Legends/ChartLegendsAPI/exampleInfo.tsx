import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examples";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>Demonstrates how to add a Legend to a JavaScript Line Chart using SciChart.js. The legend is created when you add
        a LegendModifier type to the sciChartSurface.chartModifiers collection.</p>
    <p>Legends may be placed in the top left, top right, bottom left and bottom right of the chart, and can be oriented
        horizontally or vertically. Each legend item takes its text from the dataSeriesName property</p>
    <h4>Tips!</h4>
    <p>There are many different configurations for the legend, including fine grained control over the legend rows.
        Please review the API documentation below carefully for further information.</p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorialsHome} title={ExampleStrings.titleTutorialsHome} target="_blank">
            SciChart.js Tutorials</a></li>
        <li><a href={ExampleStrings.urlLegendDocumentation} target="_blank"
               title={ExampleStrings.urlTitleLegendDocumentation}>Legend API Documentation</a></li>
    </ul>
</div>);
const Subtitle = () => (<p>Demonstrates how to add a legend to a <strong>JavaScript Chart</strong>{' '}
    using SciChart.js, High Performance{' '}
    <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const chartLegendsAPIExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleChartLegends,
    path: ExampleStrings.urlChartLegends,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
