import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>An introduction to the Annotations Editable API in SciChart.js, which allows SVG elements or custom WebGL rendered
        elements to be
        editable over the chart at specific X,Y data-values.</p>
    <p>SciChart annotations are available for drag and drop, such as LineAnnotation, BoxAnnotation, TextAnnotation, HorizontalLineAnnotation, VerticalLineAnnotation, CustomAnnotation</p>
    <h4>Tips!</h4>
    <p>Setting only one property isEditable give you access to change annotation</p>
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
        <li><a href={ExampleStrings.urlTradeMarkers}
               title={ExampleStrings.urlTitleTradeMarkers}>Trading Buy Sell Marker Annotations Example</a></li>
    </ul>
</div>);
const Subtitle = () => (<p>Demonstrates how to edit Annotations (shapes, boxes, lines, text, horizontal and vertical line){' '}
    to a <strong>JavaScript Chart</strong> using SciChart.js, High Performance{' '}
    <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const editableAnnotationsExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleEditableAnnotations,
    path: ExampleStrings.urlEditableAnnotations,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: "Demonstrates how to edita Annotations (shapes, boxes, lines, text, horizontal and vertical line) over a JavaScript Chart using SciChart.js Annotations API",
    seoKeywords: "annotations, chart, api, javascript, webgl, canvas, drag and drop",
    thumbnailImage: "javascript-chart-editable-annotations.jpg"
};
