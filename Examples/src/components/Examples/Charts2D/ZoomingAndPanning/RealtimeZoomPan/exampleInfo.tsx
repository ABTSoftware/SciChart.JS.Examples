import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import * as React from "react";
import { ExampleStrings } from "../../../ExampleStrings";

const Description = () => (
    <div>
        <p>
            This examples shows how to add zooming and panning behaviour to a realtime JavaScript Chart.{' '}
        </p>
        <p>When you use AutoRanging in a SciChart.js chart, the chart will always automatically range to fit the data.{' '}
        This means that zoom, pan modifiers will not work on the chart. In order to allow both behaviors, this example{' '}
        demonstrates how to use the ZoomState property to determine when to zoom to fit,{' '}
        or when to allow user zooming.</p>
        <h4>Tips!</h4>
        <p>Check in the source-code for how we use the SciChartSurface.ZoomState property to determine when to{' '}
        scroll and when to allow user-zooming.</p>
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
            <li>Ò
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
        Zoom the real-time chart below by dragging on the surface.{' '}
        Then double-click to reset zoom and start automatically scrolling again.
    </p>
);

export const realtimeZoomPanExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleRealtimeZoomPan,
    path: ExampleStrings.urlRealtimeZoomPan,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: `This examples shows how to add zooming and panning behaviour to a realtime JavaScript Chart.`,
    seoKeywords: "drag, axis, scale, javascript, webgl, canvas",
    thumbnailImage: "zoom-and-pan-a-realtime-javascript-chart.jpg"
};
