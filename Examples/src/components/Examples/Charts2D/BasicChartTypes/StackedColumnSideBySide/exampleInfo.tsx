import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>Demonstrates how to create a JavaScript Stacked Column Chart with side-by-side grouping. This mode of Stacked
        Column Charts groups the columns
        next to each other, allowing for easy comparison of several datasets.</p>
    <h4>Tips!</h4>
    <p>Did you know SciChart.js supports 100% Stacked Column Charts as well as several other options? See
        the <a
            href={ExampleStrings.urlStackedColumnChartDocumentation} target="_blank"
            title={ExampleStrings.urlTitleStackedColumnChartDocumentation}>Stacked Column Chart documentation</a> for
        more details.</p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorialsHome} title={ExampleStrings.titleTutorialsHome} target="_blank">
            SciChart.js Tutorials</a></li>
        <li><a href={ExampleStrings.urlStackedColumnChartDocumentation} target="_blank"
               title={ExampleStrings.urlTitleStackedColumnChartDocumentation}>JavaScript Stacked Column Chart
            Documentation</a>
        </li>
        <li><a href={ExampleStrings.urlRenderSeriesPropertiesDocumentation}
               title={ExampleStrings.urlTitleRenderSeriesProperties} target="_blank">
            Common RenderableSeries Properties</a></li>
    </ul>
    <h4>See Also</h4>
    <ul>
        <li><a href={ExampleStrings.urlColumnChart}
               title={ExampleStrings.urlTitleColumnChart}>The JavaScript Column Chart Example</a>
        </li>
        <li><a href={ExampleStrings.urlStackedColumnChart}
               title={ExampleStrings.urlTitleStackedColumnChart}>The JavaScript Stacked Column Chart Example</a>
        </li>
    </ul>
</div>);
const Subtitle = () => (
    <p>Demonstrates how to create a <strong>JavaScript Stacked Column Chart Side-by-side</strong>{' '}
        using SciChart.js, High Performance{' '}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const stackedColumnSideBySideExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleGroupedColumnChart,
    path: ExampleStrings.urlGroupedColumnChart,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: `Demonstrates how to create a JavaScript Stacked Column Chart with side-by-side grouping. This mode of Stacked
        Column Charts groups the columns next to each other, allowing for easy comparison of several datasets.`,
    seoKeywords: "stacked, column, side-by-side, chart, javascript, webgl, canvas"
};
