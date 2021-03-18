import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpes/types/types";
import Gallery from "../../../../Gallery/Gallery";
import { TDocumentationLink } from "../../../../../helpes/types/ExampleDescriptionTypes";
import stockChart from "../TradeMarkers/javascript-stock-chart-buy-sell-markers.jpg";
import editableAnnotationsChart from "../EditableAnnotations/javascript-chart-editable-annotations.jpg";
import ExampleDescription from "../../../../ExampleDescription/ExampleDescription";

const previewDescription = `An introduction to the Annotations API in SciChart.js, which allows SVG elements or custom WebGL rendered
elements to be placed over the chart at specific X,Y data-values.`;
const description = `Several annotations are available out of the box, such as LineAnnotation, BoxAnnotation, TextAnnotation, and
we provide a CustomAnnotation and SVGAnnotation which allows for custom shapes to be placed over the chart.`;
const tips = [
    `The AnnotationBase type has properties for x,yCoordinateMode which allow you to place annotations are
    relative or absolute values. Great for docking annotations to the top,left,right,bottom of a chart, or
    creating watermarks!`
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlDocumentationHome,
        title: ExampleStrings.titleDocumentationHome,
        linkTitle: "SciChart.js Documentation Home"
    },
    {
        href: ExampleStrings.urlTutorialsHome,
        title: ExampleStrings.titleTutorialsHome,
        linkTitle: "SciChart.js Tutorials"
    },
    {
        href: ExampleStrings.urlAnnotationsDocumentation,
        title: ExampleStrings.urlTitleAnnotationsDocumentation,
        linkTitle: "Annotations API Documentation"
    }
];

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: stockChart,
                title: ExampleStrings.titleTradeMarkers,
                seoTitle: ExampleStrings.urlTitleTradeMarkers,
                examplePath: ExampleStrings.urlTradeMarkers
            },
            {
                imgPath: editableAnnotationsChart,
                title: ExampleStrings.titleEditableAnnotations,
                seoTitle: ExampleStrings.urlTitleEditableAnnotations,
                examplePath: ExampleStrings.urlEditableAnnotations
            }
        ]
    }
];

const SeeAlsoComponent = () => <Gallery examples={seeAlso} />;

const Subtitle = () => (
    <p>
        Demonstrates how to add Annotations (shapes, boxes, lines, text) to a <strong>JavaScript Chart</strong> using
        SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

const Description = () => (
    <div>
        <ExampleDescription
            documentationLinks={documentationLinks}
            tips={tips}
            description={description}
            previewDescription={previewDescription}
        />
    </div>
);

export const annotationsAreEasyExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleAnnotationsAreEasy,
    path: ExampleStrings.urlAnnotationsAreEasy,
    subtitle: Subtitle,
    description: Description,
    seeAlso: SeeAlsoComponent,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates how to place Annotations (lines, arrows, markers, text) over a JavaScript Chart using SciChart.js Annotations API",
    seoKeywords: "annotations, chart, api, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-annotations.jpg"
};
