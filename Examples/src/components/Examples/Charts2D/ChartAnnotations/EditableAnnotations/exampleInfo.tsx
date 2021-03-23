import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpes/types/types";
import { TDocumentationLink } from "../../../../../helpes/types/ExampleDescriptionTypes";

const previewDescription = `An introduction to the Annotations Editable API in SciChart.js, which allows SVG elements or custom WebGL
rendered elements to be editable over the chart at specific X,Y data-values.`;
const description = `SciChart annotations are available for drag and drop, such as LineAnnotation, BoxAnnotation, TextAnnotation,
HorizontalLineAnnotation, VerticalLineAnnotation, CustomAnnotation`;
const tips = [`Setting only one property isEditable give you access to change annotation`];

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
                imgPath: ExampleStrings.imgTradeMarkers,
                title: ExampleStrings.titleTradeMarkers,
                seoTitle: ExampleStrings.urlTitleTradeMarkers,
                examplePath: ExampleStrings.urlTradeMarkers
            },
            {
                imgPath: ExampleStrings.imgAnnotaionsAreEasyChart,
                title: ExampleStrings.titleAnnotationsAreEasy,
                seoTitle: ExampleStrings.urlTitleAnnotationsDocumentation,
                examplePath: ExampleStrings.urlAnnotationsAreEasy
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how to edit Annotations (shapes, boxes, lines, text, horizontal and vertical line) to a{" "}
        <strong>JavaScript Chart</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const editableAnnotationsExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleEditableAnnotations,
    path: ExampleStrings.urlEditableAnnotations,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates how to edita Annotations (shapes, boxes, lines, text, horizontal and vertical line) over a JavaScript Chart using SciChart.js Annotations API",
    seoKeywords: "annotations, chart, api, javascript, webgl, canvas, drag and drop",
    thumbnailImage: "javascript-chart-editable-annotations.jpg"
};
