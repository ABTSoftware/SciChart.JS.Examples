import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>Demonstrates the Hit Test API, which can be used to get feedback about clicks on data-points or lines and enable
        selection, of showing of context menus. Click on the data-point and see hit test info on the right.</p>
    <p>Click anywhere on the chart to call BaseRenderableSeries.hitTestProvider.hitTest. The HitTest function accepts a
        mouse-point and returns the nearest data-point, plus its location in X,Y coordinate space.
    </p>
    <h4>Tips!</h4>
    <p>The hitTest function accepts parameters to control the hit-test logic. See the documentation on Hit-Testing for
        more info!</p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorialsHome} title={ExampleStrings.titleTutorialsHome} target="_blank">
            SciChart.js Tutorials</a></li>
        <li><a href={ExampleStrings.urlHitTestDocumentation}
               title={ExampleStrings.urlTitleHitTestDocumentation} target="_blank">Hit-Test API
            documentation</a></li>
    </ul>
</div>);
const Subtitle = () => (
    <p>Demonstrates how to add <strong>Hit-Test on click behavior</strong> to a chart{' '}
        using SciChart.js, High Performance{' '}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);


export const hitTestApiExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleHitTestApi,
    path: ExampleStrings.urlHitTestApi,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: "Demonstrates Hit-Testing a JavaScript Chart - point and click on the chart and get feedback about what data-points were clicked",
    seoKeywords: "hit, test, api, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-hit-test-on-click.png"
};
