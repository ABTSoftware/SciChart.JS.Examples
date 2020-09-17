import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examples";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>Demonstrates how to create a JavaScript Heatmap Chart. The FastUniformHeatmapRenderableSeries accepts a 2D array
        of data and has user-defined color map which can be used to color points by value.</p>
    <h4>Tips!</h4>
    <p>Click <strong>Start</strong> to see the incredible performance of the Heatmap Chart in a real-time context!</p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorialsHome} title={ExampleStrings.titleTutorialsHome} target="_blank">
            SciChart.js Tutorials</a></li>
        <li><a href={ExampleStrings.urlHeatmapChartDocumentation} target="_blank"
               title={ExampleStrings.urlTitleHeatmapChartDocumentation}>JavaScript Heatmap Chart Documentation</a></li>
        <li><a href={ExampleStrings.urlRenderSeriesPropertiesDocumentation}
               title={ExampleStrings.urlTitleRenderSeriesProperties} target="_blank">
            Common RenderableSeries Properties</a></li>
    </ul>
</div>);
const Subtitle = () => (<p>Demonstrates how to create a <strong>JavaScript Heatmap Chart</strong>{' '}
    using SciChart.js, High Performance{' '}
    <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const heatmapChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleHeatmapChart,
    path: ExampleStrings.urlHeatmapChart,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
