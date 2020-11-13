import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>Using garish colors to demonstrate styling of a JavaScript chart, Axis, grid lines, tick lines and more.</p>
    <p>Almost any element in SciChart is stylable in code and most parts of the chart are exposed. You can easily set
        background, grid-line, axis label, viewport background and chart series colors in JavaScript.
    </p>
    <h4>Tips!</h4>
    <p>Take a look at the documentation on{' '}
        <a href={ExampleStrings.urlAxisStylingDocumentation}
           title={ExampleStrings.urlTitleAxisStylingDocumentation} target="_blank">Axis Styling</a>{' '}
        for more inspiration.
    </p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorialsHome} title={ExampleStrings.titleTutorialsHome} target="_blank">
            SciChart.js Tutorials</a></li>
        <li><a href={ExampleStrings.urlAxisStylingDocumentation}
               title={ExampleStrings.urlTitleAxisStylingDocumentation} target="_blank">The Axis and Chart Styling
           documentation</a></li>
    </ul>
    <h4>See Also</h4>
    <ul>
        <li><a href={ExampleStrings.urlThemeManager}
               title={ExampleStrings.urlTitleThemeManager}>Theme Manager Example</a></li>
    </ul>
</div>);
const Subtitle = () => (
    <p>Demonstrates how to <strong>style or theme a JavaScript Chart</strong>{' '}
        using SciChart.js, High Performance{' '}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const stylingInCodeExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleStylingInCode,
    path: ExampleStrings.urlStylingInCode,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: "Demonstrates how to style a JavaScript Chart entirely in code with SciChart.js themeing API",
    seoKeywords: "styling, in, code, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-styling-theming-in-code.png"
};
