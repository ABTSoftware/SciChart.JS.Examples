import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examples";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>Demonstrates how to create a JavaScript Line Chart. The FastLineRenderableSeries can be used to render an
        XyDataSeries, XyyDataSeries (uses Y1 only) or OhlcDataSeries (renders Close).</p>
    <p>The scatter chart uses the PointMarker API to define the marker shape and size. Point-markers available out of
        the box include Ellipse (circle), Triangle, Square, Cross and CustomPointMarker, which renders an image.</p>
    <h4>Tips!</h4>
    <p>As well as stroke, you can set strokeThickness, isVisible properties to change how the series is rendered.</p>
    <p>You can add data-point markers to a line series using the PointMarker API. This is very performant and uses the
        same WebGL rendering as our Scatter Charts.</p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorialsHome} title={ExampleStrings.titleTutorialsHome} target="_blank">
            SciChart.js Tutorials</a></li>
        <li><a href={ExampleStrings.urlLineChartDocumentation} target="_blank"
               title={ExampleStrings.urlTitleLineChartDocumentation}>JavaScript Line Chart Documentation</a></li>
        <li><a href={ExampleStrings.urlRenderSeriesPropertiesDocumentation}
               title={ExampleStrings.urlTitleRenderSeriesProperties} target="_blank">
            Common RenderableSeries Properties</a></li>
    </ul>
    <h4>See Also</h4>
    <ul>
        <li><a href={ExampleStrings.urlScatterChart}
               title={ExampleStrings.urlScatterChartDocumentation}>The
            JavaScript Bubble Chart Example</a></li>
        <li><a href={ExampleStrings.urlPointMarkers}
               title={ExampleStrings.titlePointMarkers}>Styling
            Point-Markers Example</a></li>
    </ul>
</div>);
const Subtitle = () => (<p>Demonstrates how to create a <strong>JavaScript Line Chart</strong>{' '}
    using SciChart.js, High Performance{' '}
    <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const lineChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleLineChart,
    path: ExampleStrings.urlLineChart,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
