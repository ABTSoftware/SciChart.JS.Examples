import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>This example demonstrates how a JavaScript Spline Line chart can be created using the
        SplineLineRenderableSeries type.</p>
    <p>SciChart's Spline Line type includes a spline-interpolation algorithm to smooth the line, when you have a few
        data-points and want
        a nicer looking, smoothed line series in your chart applications and dashboards</p>
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
        <li><a href={ExampleStrings.urlSplineLineChartDocumentation} target="_blank"
               title={ExampleStrings.urlTitleSplineLineChartDocumentation}>
            JavaScript Spline Line Chart Documentation</a></li>
        <li><a href={ExampleStrings.urlRenderSeriesPropertiesDocumentation}
               title={ExampleStrings.urlTitleRenderSeriesProperties} target="_blank">
            Common RenderableSeries Properties</a></li>
    </ul>
    <h4>See Also</h4>
    <ul>
        <li><a href={ExampleStrings.urlSplineMountainChart}
               title={ExampleStrings.titleSplineMountainChart}>The
            JavaScript Spline Mountain Chart Example</a></li>
        <li><a href={ExampleStrings.urlSplineBandChart}
               title={ExampleStrings.titleSplineBandChart}>The
            JavaScript Spline Band Chart Example</a></li>
    </ul>
</div>);
const Subtitle = () => (<p>Demonstrates how to create a <strong>JavaScript Spline Line Chart</strong>{' '}
    using SciChart.js, High Performance{' '}
    <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const splineLineChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleSplineLineChart,
    path: ExampleStrings.urlSplineLineChart,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: "Demonstrates how to create a JavaScript Spline (smoothed) Line Chart. " +
        "The Spline Line Series also supports gradient-coloring and per-point coloring via our PaletteProvider API.",
    seoKeywords: "spline, smoothed, line, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-spline-smoothed-line-chart.jpg"
};
