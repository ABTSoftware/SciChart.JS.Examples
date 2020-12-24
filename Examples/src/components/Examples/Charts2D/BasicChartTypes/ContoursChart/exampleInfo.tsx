import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>Demonstrates how to create a JavaScript Contour map Chart. The UniformContoursRenderableSeries accepts a 2D array
        of data and calculates contour lines at a specified step value and draws them on the chart.</p>
    <h4>Tips!</h4>
    <p>Contours are calculated using GPU Shader programs so are very fast, but require some tweaking of properties on
        UniformContoursRenderableSeries to get a good visual.</p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorialsHome} title={ExampleStrings.titleTutorialsHome} target="_blank">
            SciChart.js Tutorials</a></li>
        <li><a href={ExampleStrings.urlContourChartDocumentation} target="_blank"
               title={ExampleStrings.urlTitleContourChartDocumentation}>JavaScript Contours Chart Documentation</a></li>
        <li><a href={ExampleStrings.urlRenderSeriesPropertiesDocumentation}
               title={ExampleStrings.urlTitleRenderSeriesProperties} target="_blank">
            Common RenderableSeries Properties</a></li>
    </ul>
</div>);
const Subtitle = () => (<p>Demonstrates how to create a <strong>JavaScript Contour-map Chart</strong>{' '}
    using SciChart.js, High Performance{' '}
    <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const contourChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleContourChart,
    path: ExampleStrings.urlContourChart,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: "Demonstrates how to create a Realtime JavaScript Contour-map Chart. The Contours series accepts a 2D array" +
        "of data and calculates contour lines at a specified step value and draws them on the chart.",
    seoKeywords: "contour, contours, heatmap, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-contours-chart.jpg"
};
