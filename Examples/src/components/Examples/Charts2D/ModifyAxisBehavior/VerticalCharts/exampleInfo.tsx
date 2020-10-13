import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>Demonstrates a vertical chart with XAxis on the Left and YAxis on the Top. SciChart.js supports unlimited X and Y
        axis and allows placement of any axis on the Left, Right, Top, Bottom of the chart.</p>
    <h4>Tips!</h4>
    <p>The vertical chart, popular in Oil &amp; Gas, Geo-surveying, is created by setting xAxis.axisAlignment = Left,
        and yAxis.axisAlignment = top.</p>
    <p>Try dragging an axis or the chart to zoom and pan around. Double clicking the chart resets the zoom!</p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorialsHome} title={ExampleStrings.titleTutorialsHome} target="_blank">
            SciChart.js Tutorials</a></li>
        <li><a href={ExampleStrings.urlVerticalChartsDocumentation}
               title={ExampleStrings.urlTitleVerticalChartsDocumentation} target="_blank">
            Vertical Axis Alignment Documentation</a></li>
    </ul>
    <h4>See Also</h4>
    <ul>
        <li><a href={ExampleStrings.urlMultipleXAxis}
               title={ExampleStrings.urlTitleMultipleXAxis}>Multiple X-Axes Example</a></li>
        <li><a href={ExampleStrings.urlSecondaryYAxis}
               title={ExampleStrings.urlTitleSecondaryYAxis}>Secondary Y-Axis Example</a></li>
    </ul>
</div>);
const Subtitle = () => (
    <p>Demonstrates how to create a <strong>rotated JavaScript Chart with vertical X-Axis</strong>{' '}
        using SciChart.js, High Performance{' '}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const verticalChartsExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleVerticalCharts,
    path: ExampleStrings.urlVerticalCharts,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
