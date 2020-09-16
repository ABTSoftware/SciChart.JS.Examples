import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examples";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>Demonstrates how to create a JavaScript Band Chart. This is a chart type which draws an area (polygon or fill)
        between two lines. The FastBandRenderableSeries requires an XyyDataSeries, which contains one X-point and two
        Y-points</p>
    <p>Dual lines are drawn by the stroke, strokeY1 properties and shaded bands are drawn by the fill and fillY1
        properties, depending on whether y1 is greater than y2</p>
    <h4>Tips!</h4>
    <p>If you have data where Y1 is greater than Y2 always, you’ll get an envelope effect. Great for rendering
        confidence intervals, error margins or Bollinger Bands!</p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorialsHome} title={ExampleStrings.titleTutorialsHome} target="_blank">
            SciChart.js Tutorials</a></li>
        <li><a href={ExampleStrings.urlBandChartDocumentation} target="_blank"
               title={ExampleStrings.urlTitleBandChartDocumentation}>JavaScript Band Chart Documentation</a></li>
        <li><a href={ExampleStrings.urlRenderSeriesPropertiesDocumentation}
               title={ExampleStrings.urlTitleRenderSeriesProperties} target="_blank">
            Common RenderableSeries Properties</a></li>
    </ul>
    <h4>See Also</h4>
    <ul>
        <li><a href={ExampleStrings.urlMultiPaneStockChart}
               title={ExampleStrings.urlTitleMultiPaneStockChart}>The Multi-Pane
            Stock Chart Example</a></li>
    </ul>
</div>);
const Subtitle = () => (<p>Demonstrates how to create a <strong>JavaScript Band Chart</strong> or High-Low Fill{' '}
    using SciChart.js, High Performance{' '}
    <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const bandSeriesChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleBandChart,
    path: ExampleStrings.urlBandChart,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
