import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>Demonstrates how to create a JavaScript Stacked Column Chart. An column or rectangle is rendered from the Y-value
        of each stacked column series to the Y-value of the next.</p>
    <h4>Tips!</h4>
    <p>Did you know SciChart.js supports 100% Stacked Column Charts as well as Grouped (side-by-side) Column charts? See
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
        <li><a href={ExampleStrings.urlGroupedColumnChart}
               title={ExampleStrings.urlTitleGroupedColumnChart}>The JavaScript Grouped Column Chart Example</a>
        </li>
    </ul>
</div>);
const Subtitle = () => (<p>Demonstrates how to create a <strong>JavaScript Stacked Column Chart</strong>{' '}
    using SciChart.js, High Performance{' '}
    <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const stackedColumnChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleStackedColumnChart,
    path: ExampleStrings.urlStackedColumnChart,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
