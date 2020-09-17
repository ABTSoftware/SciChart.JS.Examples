import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examples";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>The Trade Markers demo uses the Annotations API to place CustomAnnotations rendering buy and sell or news bullet
        markers over a simulated price chart.</p>
    <p>The CustomAnnotations are created and added using SVG to the sciChartSurface.annotations collection. They may be
        placed above or below candles with our helpful API.</p>
    <h4>Tips!</h4>
    <p>News/Event bullet annotations use AnnotationBase.yCoordinateMode = ECoordinateMode.RelativeY to always place the
        event bullet at the bottom of the chart.
    </p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorialsHome} title={ExampleStrings.titleTutorialsHome} target="_blank">
            SciChart.js Tutorials</a></li>
        <li><a href={ExampleStrings.urlAnnotationsDocumentation} target="_blank"
               title={ExampleStrings.urlTitleAnnotationsDocumentation}>Annotations API Documentation</a></li>
    </ul>
    <h4>See Also</h4>
    <ul>
        <li><a href={ExampleStrings.urlAnnotationsAreEasy}
               title={ExampleStrings.urlTitleAnnotationsDocumentation}>JavaScript Chart Annotations Example</a></li>
    </ul>
</div>);

const Subtitle = () => (<p>Demonstrates how to add Buy/Sell Markers (annotations) and News/Dividend bullets{' '}
    to a <strong>JavaScript Stock Chart</strong> using SciChart.js, High Performance{' '}
    <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const tradeMarkerAnnotationsExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleTradeMarkers,
    path: ExampleStrings.urlTradeMarkers,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
