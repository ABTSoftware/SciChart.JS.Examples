import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>Demonstrates how to create a JavaScript Stacked Mountain Chart. An area or polygon is rendered from the Y-value
        of each stacked mountain series to the Y-value of the next.</p>
    <h4>Tips!</h4>
    <p>Did you know SciChart.js supports 100% Stacked Mountain Charts? See the <a
        href={ExampleStrings.urlStackedMountainChartDocumentation} target="_blank"
        title={ExampleStrings.urlTitleStackedMountainChartDocumentation}>Stacked Mountain Chart documentation</a> for
        more details.</p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorialsHome} title={ExampleStrings.titleTutorialsHome} target="_blank">
            SciChart.js Tutorials</a></li>
        <li><a href={ExampleStrings.urlStackedMountainChartDocumentation} target="_blank"
               title={ExampleStrings.urlTitleStackedMountainChartDocumentation}>JavaScript Stacked Mountain Chart
            Documentation</a>
        </li>
        <li><a href={ExampleStrings.urlRenderSeriesPropertiesDocumentation}
               title={ExampleStrings.urlTitleRenderSeriesProperties} target="_blank">
            Common RenderableSeries Properties</a></li>
    </ul>
    <h4>See Also</h4>
    <ul>
        <li><a href={ExampleStrings.urlMountainChart}
               title={ExampleStrings.urlTitleMountainChart}>The JavaScript Mountain Chart Example</a>
        </li>
        <li><a href={ExampleStrings.urlStackedColumnChart}
               title={ExampleStrings.urlTitleStackedColumnChart}>The JavaScript Stacked Column Chart Example</a>
        </li>
        <li><a href={ExampleStrings.urlGroupedColumnChart}
               title={ExampleStrings.urlTitleGroupedColumnChart}>The JavaScript Grouped Column Chart Example</a>
        </li>
    </ul>
</div>);
const Subtitle = () => (<p>Demonstrates how to create a <strong>JavaScript Stacked Mountain Chart</strong>{' '}
    using SciChart.js, High Performance{' '}
    <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const stackedMountainChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleStackedMountainChart,
    path: ExampleStrings.urlStackedMountainChart,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: `Demonstrates how to create a JavaScript Stacked Mountain Chart. An area or polygon is rendered from the Y-value
        of each stacked mountain series to the Y-value of the next.`,
    seoKeywords: "stacked, mountain, chart, javascript, webgl, canvas"
};
