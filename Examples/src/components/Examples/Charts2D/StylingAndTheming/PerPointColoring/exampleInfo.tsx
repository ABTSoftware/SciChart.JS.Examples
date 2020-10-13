import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>Demonstrates how to use the PaletteProvider API to color lines, points and fills individually based on a rule.
        Using this API you can color individual data-points of the following chart series: Line, Column, Candlestick,
        Ohlc, Mountain, Scatter, Bubble and Band.</p>
    <h4>Tips!</h4>
    <p>The PaletteProvider API is useful for showing thresholds or areas of interest!</p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorialsHome} title={ExampleStrings.titleTutorialsHome} target="_blank">
            SciChart.js Tutorials</a></li>
        <li><a href={ExampleStrings.urlLineChartDocumentation}
               title={ExampleStrings.urlTitleLineChartDocumentation} target="_blank">
            The Line Series Documentation</a></li>
        <li><a href={ExampleStrings.urlMountainChartDocumentation}
               title={ExampleStrings.urlTitleMountainChartDocumentation} target="_blank">
            The Mountain Series Documentation</a></li>
        <li><a href={ExampleStrings.urlScatterChartDocumentation}
               title={ExampleStrings.urlTitleScatterChartDocumentation} target="_blank">
            The Scatter Series Documentation</a></li>
    </ul>
</div>);
const Subtitle = () => (
    <p>Demonstrates how create <strong>JavaScript Charts with per-point coloring</strong>{' '}
        using SciChart.js, High Performance{' '}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const perPointColoringExampleInfo: TExampleInfo = {
    title: ExampleStrings.titlePaletteProvider,
    path: ExampleStrings.urlPaletteProvider,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
