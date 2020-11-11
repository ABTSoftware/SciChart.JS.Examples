import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>An introduction to the Annotations API in SciChart.js, which allows SVG elements or custom WebGL rendered
        elements to be
        placed over the chart at specific X,Y data-values.</p>
    <p>Several annotations are available out of the box, such as LineAnnotation, BoxAnnotation, TextAnnotation,
        and we provide a CustomAnnotation and SVGAnnotation which allows for custom shapes to be placed over the
        chart.</p>
    <h4>Tips!</h4>
    <p>The AnnotationBase type has properties for x,yCoordinateMode which allow you to place annotations are relative or
        absolute values. Great for docking annotations to the top,left,right,bottom of a chart, or creating
        watermarks!</p>
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
        <li><a href={ExampleStrings.urlTradeMarkers}
               title={ExampleStrings.urlTitleTradeMarkers}>Trading Buy Sell Marker Annotations Example</a></li>
    </ul>
</div>);
const Subtitle = () => (<p>Demonstrates how to add Annotations (shapes, boxes, lines, text){' '}
    to a <strong>JavaScript Chart</strong> using SciChart.js, High Performance{' '}
    <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const annotationsAreEasyExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleAnnotationsAreEasy,
    path: ExampleStrings.urlAnnotationsAreEasy,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: `An introduction to the Annotations API in SciChart.js, which allows SVG elements or custom WebGL rendered
        elements to be placed over the chart at specific X,Y data-values.`,
    seoKeywords: "annotations, chart, api, javascript, webgl, canvas"
};
