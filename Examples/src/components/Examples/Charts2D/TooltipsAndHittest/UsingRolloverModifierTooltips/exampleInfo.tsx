import {TExampleInfo} from "../../../../AppRouter/examples";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import * as React from "react";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>Demonstrates using the RolloverModifier, part of the ChartModifier API, to add mouse-over feedback of data-points
        on time-series to the user.</p>
    <p>This can be used to add Tooltips to a JavaScript chart as well as create Active legends which update
        values as the user moves the mouse.
    </p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorialsHome} title={ExampleStrings.titleTutorialsHome} target="_blank">
            SciChart.js Tutorials</a></li>
        <li><a href={ExampleStrings.urlRolloverModifierDocumentation}
               title={ExampleStrings.urlTitleRolloverModifierDocumentation} target="_blank">RolloverModifier
            documentation</a></li>
    </ul>
</div>);
const Subtitle = () => (
    <p>Demonstrates how to create <strong>custom data-point markers</strong>{' '}
        using SciChart.js, High Performance{' '}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);


export const usingRolloverModifierTooltipsExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleRolloverModifier,
    path: ExampleStrings.urlRolloverModifier,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
