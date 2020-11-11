import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import * as React from "react";
import { ExampleStrings } from "../../../ExampleStrings";

const Description = () => (
    <div>
        <p>
            Demonstrates how to add behaviour to scale, zoom or pan a chart by dragging the X or Y Axis on the chart.
            Try it out below! Drag an axis to watch the chart re-scale.
        </p>
        <h4>Tips!</h4>
        <p>Try dragging an axis to zoom or pan the axis. Double clicking the chart resets the zoom!</p>
        <h4>Documentation Links</h4>
        <ul>
            <li>
                <a
                    href={ExampleStrings.urlDocumentationHome}
                    title={ExampleStrings.titleDocumentationHome}
                    target="_blank"
                >
                    SciChart.js Documentation Home
                </a>
            </li>
            <li>
                <a href={ExampleStrings.urlTutorialsHome} title={ExampleStrings.titleTutorialsHome} target="_blank">
                    SciChart.js Tutorials
                </a>
            </li>
        </ul>
        <h4>See Also</h4>
        <ul>
            <li>
                <a href={ExampleStrings.urlSecondaryYAxis} title={ExampleStrings.urlTitleSecondaryYAxis}>
                    Secondary Y-Axis Example
                </a>
            </li>
            <li>
                <a href={ExampleStrings.urlVerticalCharts} title={ExampleStrings.urlTitleVerticalCharts}>
                    Vertical Chart Axis Example
                </a>
            </li>
        </ul>
    </div>
);
const Subtitle = () => (
    <p>
        Demonstrates how to <strong>scale or pan the Axis on a JavaScript Chart</strong> using SciChart.js, High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const dragAxisToScaleExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleDragAxisToScale,
    path: ExampleStrings.urlDragAxisToScale,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl
};
