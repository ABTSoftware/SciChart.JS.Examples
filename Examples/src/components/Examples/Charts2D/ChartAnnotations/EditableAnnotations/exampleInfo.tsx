import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-chart-editable-annotations.jpg";

const previewDescription = `An introduction to the Annotations Editable API in SciChart.js, which allows SVG elements or custom WebGL
rendered elements to be editable over the chart at specific X,Y data-values.`;
const description = `SciChart annotations are available for drag and drop, such as LineAnnotation, BoxAnnotation, TextAnnotation,
HorizontalLineAnnotation, VerticalLineAnnotation, CustomAnnotation`;
const tips = [`Setting only one property isEditable give you access to change annotation`];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlEditableAnnotationsDocumentation,
        title: ExampleStrings.urlTitleEditableAnnotations,
        linkTitle: "Annotations API Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to edit Annotations (shapes, boxes, lines, text, horizontal and vertical line) to a{" "}
        <strong>{frameworkName} Chart</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const editableAnnotationsExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleEditableAnnotations,
    pageTitle: ExampleStrings.titleEditableAnnotations,
    path: ExampleStrings.urlEditableAnnotations,
    filepath: "Charts2D/ChartAnnotations/EditableAnnotations",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `Demonstrates how to edit Annotations (shapes, boxes, lines, text, horizontal and vertical line) over a ${frameworkName} Chart using SciChart.js Annotations API`,
    metaKeywords: "annotations, chart, api, javascript, webgl, canvas, drag and drop",
    thumbnailImage: exampleImage,
};
