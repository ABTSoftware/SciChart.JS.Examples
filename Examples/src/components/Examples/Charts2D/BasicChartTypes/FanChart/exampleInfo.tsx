import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>Demonstrates how to create a JavaScript Fan Chart. This chart type can be used for visualizing forecasting or
        estimation figures
        and can be achieved in SciChart.js using several Band Series overlaid with varying opacity.</p>
    <h4>Tips!</h4>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorialsHome} title={ExampleStrings.titleTutorialsHome} target="_blank">
            SciChart.js Tutorials</a></li>
        <li><a href={ExampleStrings.urlFanChartDocumentation} target="_blank"
               title={ExampleStrings.urlTitleFanChartDocumentation}>JavaScript Fan Chart Documentation</a></li>
        <li><a href={ExampleStrings.urlRenderSeriesPropertiesDocumentation}
               title={ExampleStrings.urlTitleRenderSeriesProperties} target="_blank">
            Common RenderableSeries Properties</a></li>
    </ul>
    <h4>See Also</h4>
    <ul>
        <li><a href={ExampleStrings.urlBandChart}
               title={ExampleStrings.urlTitleBandChart}>The JavaScript Band Chart Example</a></li>
    </ul>
</div>);
const Subtitle = () => (<p>Demonstrates how to create a <strong>JavaScript Fan Chart</strong>{' '}
    using SciChart.js, High Performance{' '}
    <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const fanChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleFanChart,
    path: ExampleStrings.urlFanChart,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: `Demonstrates how to create a JavaScript Fan Chart. This chart type can be used for visualizing forecasting or
        estimation figures and can be achieved in SciChart.js using several Band Series overlaid with varying opacity.`,
    seoKeywords: "fan, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-fan-chart.jpg"
};
