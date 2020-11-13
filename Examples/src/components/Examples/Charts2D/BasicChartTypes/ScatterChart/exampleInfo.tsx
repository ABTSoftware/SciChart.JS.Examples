import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>Demonstrates how to create a JavaScript Scatter Chart. The XyScatterRenderableSeries can be used to render an
        XyDataSeries, XyyDataSeries (uses Y1 only) or OhlcDataSeries (renders Close).</p>
    <p>The scatter chart uses the PointMarker API to define the marker shape and size. Point-markers available out of
        the box include Ellipse (circle), Triangle, Square, Cross and CustomPointMarker, which renders an image.</p>
    <h4>Tips!</h4>
    <p>Perhaps you wanted a scatter point with a line? If so, you can do this using the Line Series type
        and by setting the pointMarker property.</p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorialsHome} title={ExampleStrings.titleTutorialsHome} target="_blank">
            SciChart.js Tutorials</a></li>
        <li><a href={ExampleStrings.urlScatterChartDocumentation} target="_blank"
               title={ExampleStrings.urlTitleScatterChartDocumentation}>JavaScript Scatter Chart Documentation</a></li>
        <li><a href={ExampleStrings.urlRenderSeriesPropertiesDocumentation}
               title={ExampleStrings.urlTitleRenderSeriesProperties} target="_blank">
            Common RenderableSeries Properties</a></li>
    </ul>
    <h4>See Also</h4>
    <ul>
        <li><a href={ExampleStrings.urlBubbleChart}
               title={ExampleStrings.urlTitleBubbleChartDocumentation}>The
            JavaScript Bubble Chart Example</a></li>
        <li><a href={ExampleStrings.urlPointMarkers}
               title={ExampleStrings.titlePointMarkers}>Styling
            Point-Markers Example</a></li>
    </ul>
</div>);
const Subtitle = () => (<p>Demonstrates how to create a <strong>JavaScript Scatter Chart</strong>{' '}
    using SciChart.js, High Performance{' '}
    <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const scatterChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleScatterChart,
    path: ExampleStrings.urlScatterChart,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: `Demonstrates how to create a JavaScript Scatter Chart. The XyScatterRenderableSeries can be used to render an
        XyDataSeries, XyyDataSeries (uses Y1 only) or OhlcDataSeries (renders Close).`,
    seoKeywords: "scatter, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-scatter-chart.jpg"
};
