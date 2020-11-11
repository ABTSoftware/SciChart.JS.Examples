import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>Demonstrates how to assign line series to different Y Axis in a JavaScript Chart. SciChart
        supports multiple top or bottom X-Axes and multiple left and right Y-Axes. This example shows in a simple way
        how to register a line series on each axis.</p>
    <h4>Tips!</h4>
    <p>Try dragging an axis or the chart to zoom and pan around. Double clicking the chart resets the zoom!</p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorialsHome} title={ExampleStrings.titleTutorialsHome} target="_blank">
            SciChart.js Tutorials</a></li>
    </ul>
    <h4>See Also</h4>
    <ul>
        <li><a href={ExampleStrings.urlMultipleXAxis}
               title={ExampleStrings.urlTitleMultipleXAxis}>Multiple X-Axes Example</a></li>
        <li><a href={ExampleStrings.urlVerticalCharts}
               title={ExampleStrings.urlTitleVerticalCharts}>Vertical Chart Axis Example</a></li>
    </ul>
</div>);
const Subtitle = () => (<p>Demonstrates how to create a <strong>JavaScript Chart with Secondary Y axis</strong>{' '}
    using SciChart.js, High Performance{' '}
    <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const secondaryYAxesExampleInfo: TExampleInfo = {
    title: "Secondary Y Axes",
    path: ExampleStrings.urlSecondaryYAxis,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: `Demonstrates how to assign line series to different Y Axis in a JavaScript Chart. SciChart
        supports multiple top or bottom X-Axes and multiple left and right Y-Axes. This example shows in a simple way
        how to register a line series on each axis.`,
    seoKeywords: "secondary, axis, chart, javascript, webgl, canvas"
};
