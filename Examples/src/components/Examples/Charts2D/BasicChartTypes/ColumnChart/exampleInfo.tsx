import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examples";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>Demonstrates how to create a JavaScript Column Chart. Columns are rendered with a stroke and fill, and support
        gradient fill and paletteproviders for more custom coloring options.</p>
    <h4>Tips!</h4>
    <p>To change the width of the column, set the dataPointWidth property from 0.0 to 1.0. This alters how much space
        the column takes up.</p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorialsHome} title={ExampleStrings.titleTutorialsHome} target="_blank">
            SciChart.js Tutorials</a></li>
        <li><a href={ExampleStrings.urlColumnChartDocumentation} target="_blank"
               title={ExampleStrings.urlTitleColumnChartDocumentation}>JavaScript Column Chart Documentation</a></li>
        <li><a href={ExampleStrings.urlRenderSeriesPropertiesDocumentation}
               title={ExampleStrings.urlTitleRenderSeriesProperties} target="_blank">
            Common RenderableSeries Properties</a></li>
    </ul>
    <h4>See Also</h4>
    <ul>
        <li><a href={ExampleStrings.urlStackedColumnChart}
               title={ExampleStrings.urlTitleStackedColumnChart}>The JavaScript Stacked Column Chart Example</a></li>
        <li><a href={ExampleStrings.urlGroupedColumnChart}
               title={ExampleStrings.urlTitleGroupedColumnChart}>The JavaScript Grouped Column Chart Example</a></li>
    </ul>
</div>);
const Subtitle = () => (<p>Demonstrates how to create a <strong>JavaScript Column Chart</strong>{' '}
    using SciChart.js, High Performance{' '}
    <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const columnChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleColumnChart,
    path: ExampleStrings.urlColumnChart,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
