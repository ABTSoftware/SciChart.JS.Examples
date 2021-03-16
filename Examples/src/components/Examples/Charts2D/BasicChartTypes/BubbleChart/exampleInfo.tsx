import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>Demonstrates how to create a JavaScript Bubble Chart. This is a chart type which draws point-marker (Ellipse,
        Square, Triangle or Custom) at X,Y locations.</p>
    <p>The FastBubbleRenderableSeries requires an XyzDataSeries, which contains X,Y,Z data. The size or scale of the
        point is defined by a Z-point.</p>
    <h4>Tips!</h4>
    <p>If you share a single XyzDataSeries between Line and Bubble Renderable Series, the line will render the X-Y
        points while the Bubble will render the X-Y-Z points.</p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorialsHome} title={ExampleStrings.titleTutorialsHome} target="_blank">
            SciChart.js Tutorials</a></li>
        <li><a href={ExampleStrings.urlBubbleChartDocumentation} target="_blank"
               title={ExampleStrings.urlTitleBubbleChartDocumentation}>JavaScript Bubble
            Chart Documentation</a></li>
        <li><a href={ExampleStrings.urlRenderSeriesPropertiesDocumentation}
               title={ExampleStrings.urlTitleRenderSeriesProperties} target="_blank">
            Common RenderableSeries Properties</a></li>
    </ul>
    <h4>See Also</h4>
    <ul>
        <li><a href={ExampleStrings.urlScatterChart}
               title={ExampleStrings.urlTitleScatterChart}>The
            JavaScript Scatter Chart Example</a></li>
        <li><a href={ExampleStrings.urlPointMarkers}
               title={ExampleStrings.urlTitlePointMarkers}>Styling
            Point-Markers Example</a></li>
    </ul>
</div>);
const Subtitle = () => (<p>Demonstrates how to create a <strong>JavaScript Bubble Chart</strong>{' '}
    using SciChart.js, High Performance{' '}
    <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const bubbleChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleBubbleChart,
    path: ExampleStrings.urlBubbleChart,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: "Demonstrates how to create a JavaScript Bubble Chart. This is a chart type which draws point-marker (Ellipse, " +
        "Square, Triangle or Custom) at X,Y locations.",
    seoKeywords: "bubble, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-bubble-chart.jpg"
};
