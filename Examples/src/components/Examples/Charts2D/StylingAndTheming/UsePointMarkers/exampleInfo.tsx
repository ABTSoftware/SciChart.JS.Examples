import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>Demonstrates how to use the FastLineRenderableSeries and the Data-Point Markers API to apply fast WebGL-rendered
        data point markers to a line series.</p>
    <p>The Point-markers are created using the HTML Canvas or custom images, but applied to the line as a WebGL Texture,
        so it’s possible to render tens or hundreds of thousands of point-markers using this method.
    </p>
    <h4>Tips!</h4>
    <p>Take a look at the documentation on{' '}
        <a href={ExampleStrings.urlPointMarkersDocumentation}
           title={ExampleStrings.urlTitlePointMarkersDocumentation} target="_blank">Custom Point-Markers</a>{' '}
        for more inspiration.
    </p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorialsHome} title={ExampleStrings.titleTutorialsHome} target="_blank">
            SciChart.js Tutorials</a></li>
        <li><a href={ExampleStrings.urlPointMarkersDocumentation}
               title={ExampleStrings.urlTitlePointMarkersDocumentation} target="_blank">Point-Markers API
            documentation</a></li>
    </ul>
    <h4>See Also</h4>
    <ul>
        <li><a href={ExampleStrings.urlScatterChart}
               title={ExampleStrings.urlTitleScatterChart}>JavaScript Scatter Chart Example</a></li>
        <li><a href={ExampleStrings.urlBubbleChart}
               title={ExampleStrings.urlTitleBubbleChart}>JavaScript Bubble Chart Example</a></li>
    </ul>
</div>);
const Subtitle = () => (
    <p>Demonstrates how to create <strong>custom data-point markers</strong>{' '}
        using SciChart.js, High Performance{' '}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const usePointMarkersExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleUsePointMarkers,
    path: ExampleStrings.urlUsePointMarkers,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: `Demonstrates how to use the FastLineRenderableSeries and the Data-Point Markers API to apply fast WebGL-rendered
        data point markers to a line series.`,
    seoKeywords: "data, point, marker, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-custom-poinmarkers.jpg"
};
