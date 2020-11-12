import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import * as React from "react";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>Demonstrates using the CursorModifier, part of the ChartModifier API, to add a cursor and tooltips which tracks
        the mouse.</p>
    <p>This can be used to add Tooltips to a JavaScript chart as well as draw cursors (crosshairs) and axis labels
        values as the user moves the mouse.
    </p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorialsHome} title={ExampleStrings.titleTutorialsHome} target="_blank">
            SciChart.js Tutorials</a></li>
        <li><a href={ExampleStrings.urlCursorModifierDocumentation}
               title={ExampleStrings.urlTitleCursorModifierDocumentation} target="_blank">CursorModifier
            documentation</a></li>
    </ul>
</div>);
const Subtitle = () => (
    <p>Demonstrates how to create <strong>crosshairs on mouseover</strong>{' '}
        using SciChart.js, High Performance{' '}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);


export const usingCursorModifierTooltipsExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleCursorModifier,
    path: ExampleStrings.urlCursorModifier,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: `Demonstrates using the CursorModifier, part of the ChartModifier API, to add a cursor and tooltips which tracks
        the mouse.`,
    seoKeywords: "cursor, modifier, chart, javascript, webgl, canvas"
};
